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

export default {
	async fetch(request, env) {
		// CORS: daftar origin dari variabel ALLOWED_ORIGINS (pisah koma, atau "*")
		const origin = request.headers.get('Origin');
		const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
		let cors = {};
		if (allowed.includes('*')) {
			cors = { 'Access-Control-Allow-Origin': '*' };
		} else if (origin && allowed.includes(origin)) {
			cors = { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' };
		} else if (!allowed.length) {
			// Fallback jika ALLOWED_ORIGINS belum di-set di environment Worker
			cors = { 'Access-Control-Allow-Origin': '*' };
		}
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

		// URL: /{sig}/{videoId}/{file...}
		const url = new URL(request.url);
		const [sig, videoId, ...rest] = url.pathname.slice(1).split('/');

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

		// Ambil langsung ${videoId}/${file} dari bucket R2
		// Contoh:
		// - /{sig}/film-badut-gendong/poster.jpg -> videoId="film-badut-gendong", file="poster.jpg" -> R2: "film-badut-gendong/poster.jpg"
		// - /{sig}/film-badut-gendong/index.m3u8 -> videoId="film-badut-gendong", file="index.m3u8" -> R2: "film-badut-gendong/index.m3u8"
		// - /{sig}/queen-of-tears/episode-1/index.m3u8 -> videoId="queen-of-tears", file="episode-1/index.m3u8" -> R2: "queen-of-tears/episode-1/index.m3u8"
		const obj = await env.BUCKET.get(`${videoId}/${file}`);
		if (!obj) return reply('Not found', 404);

		const ext = (file.split('.').pop() || '').toLowerCase();
		const contentType =
			TYPES[ext] || obj.httpMetadata?.contentType || 'application/octet-stream';

		let cacheControl;
		if (ext === 'm3u8') {
			cacheControl = 'public, max-age=60';
		} else if (['ts', 'm4s', 'aac'].includes(ext)) {
			cacheControl = 'public, max-age=31536000, immutable';
		} else if (['jpg', 'jpeg', 'png', 'webp', 'avif'].includes(ext)) {
			cacheControl = 'public, max-age=86400';
		} else {
			cacheControl = 'public, max-age=3600';
		}

		return new Response(request.method === 'HEAD' ? null : obj.body, {
			headers: {
				...cors,
				'Content-Type': contentType,
				'Cache-Control': cacheControl,
			},
		});
	},
};
