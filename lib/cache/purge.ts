/**
 * Helper to purge Cloudflare Cache via Cloudflare API
 * Requires CF_ZONE_ID and CF_API_TOKEN in environment variables.
 */

export async function purgeCloudflare(urls: string[]): Promise<boolean> {
  const zoneId = process.env.CF_ZONE_ID;
  const apiToken = process.env.CF_API_TOKEN;

  if (!zoneId || !apiToken) {
    // Di development atau jika belum di-set, log secara anggun tanpa crash
    if (process.env.NODE_ENV === "development") {
      console.log("[Cloudflare Purge] CF_ZONE_ID atau CF_API_TOKEN belum diatur, skip purge.");
    }
    return false;
  }

  if (!urls || urls.length === 0) {
    return true;
  }

  // Normalisasi URL agar memiliki domain lengkap
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://tengokfull.web.id").replace(/\/$/, "");
  const fullUrls = urls.map((u) => (u.startsWith("http") ? u : `${siteUrl}${u.startsWith("/") ? "" : "/"}${u}`));

  try {
    const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ files: fullUrls }),
    });

    const result = await response.json();
    if (!result.success) {
      console.warn("[Cloudflare Purge] Failed:", result.errors);
      return false;
    }

    console.log(`[Cloudflare Purge] Successfully purged ${fullUrls.length} URLs.`);
    return true;
  } catch (err) {
    console.warn("[Cloudflare Purge] Error executing purge:", err);
    return false;
  }
}

