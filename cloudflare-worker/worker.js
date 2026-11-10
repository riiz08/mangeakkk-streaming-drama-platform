const enc = new TextEncoder();
const hexToBytes = (h) => new Uint8Array(h.match(/../g).map((b) => parseInt(b, 16)));

const TYPES = {
	m3u8: 'application/vnd.apple.mpegurl',
	ts: 'video/mp2t',
	m4s: 'video/iso.segment',
	mp4: 'video/mp4',
	aac: 'audio/aac',
	vtt: 'text/vtt',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp',
};

const ALLOWED_ORIGINS = [
	'https://tengokfull.web.id',
	'https://www.tengokfull.web.id',
];
const isAllowed = (origin) =>
	ALLOWED_ORIGINS.includes(origin) ||
	/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin || '');

export default {
	async fetch(request, env) {
		const origin = request.headers.get('Origin');
		const cors = isAllowed(origin)
			? { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
			: {};
		const reply = (body, status) => new Response(body, { status, headers: cors });

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 204,
				headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS', 'Access-Control-Max-Age': '86400' },
			});
		}
		if (request.method !== 'GET' && request.method !== 'HEAD') {
			return reply('Method Not Allowed', 405);
		}

		// URL: /{videoId}/{sig}/{file...}
		const url = new URL(request.url);
		const [videoId, sig, ...rest] = url.pathname.slice(1).split('/');

		let file;
		try {
			file = decodeURIComponent(rest.join('/'));
		} catch {
			return reply('Bad Request', 400);
		}

		if (!videoId || !file || !/^[0-9a-f]{64}$/.test(sig || '') || file.includes('..')) {
			return reply('Forbidden', 403);
		}

		const hmacKey = await crypto.subtle.importKey(
			'raw', enc.encode(env.SECRET),
			{ name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
		);
		const ok = await crypto.subtle.verify(
			'HMAC', hmacKey, hexToBytes(sig), enc.encode(videoId)
		);
		if (!ok) return reply('Forbidden', 403);

		// Key R2 sesuai struktur upload:
		//   HLS    -> videos/{folder}/{filename}
		//   Poster -> posters/{timestamp}-{filename}
		const r2Key = file.startsWith('posters/')
			? file
			: `videos/${videoId}/${file}`;

		const obj = await env.BUCKET.get(r2Key);
		if (!obj) return reply('Not found', 404);

		const ext = (file.split('.').pop() || '').toLowerCase();
		const contentType =
			TYPES[ext] || obj.httpMetadata?.contentType || 'application/octet-stream';

		return new Response(request.method === 'HEAD' ? null : obj.body, {
			headers: {
				...cors,
				'Content-Type': contentType,
				'Cache-Control': ext === 'm3u8' ? 'private, max-age=10' : 'private, max-age=3600',
			},
		});
	},
};
