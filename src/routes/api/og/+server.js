// src/routes/api/og/+server.js
//
// Fetches Open Graph meta tags for a given URL server-side,
// avoiding CORS restrictions that would block client-side fetches.
//
// Usage: GET /api/og?url=https://example.com
// Returns: { title, description, image, host }

import { json, error } from "@sveltejs/kit";

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, fetch }) {
  const target = url.searchParams.get("url");

  if (!target) {
    throw error(400, "Missing ?url= parameter");
  }

  // Basic allow-list — only fetch from known jam hosts
  const allowed = [
    "itch.io",
    "globalgamejam.org",
    "v3.globalgamejam.org",
    "assetstore.unity.com",
    "github.com",
    "vercel.app",
  ];

  let targetHost;
  try {
    targetHost = new URL(target).hostname.replace(/^www\./, "");
  } catch {
    throw error(400, "Invalid URL");
  }

  const isAllowed = allowed.some(
    (h) => targetHost === h || targetHost.endsWith("." + h)
  );
  if (!isAllowed) {
    throw error(403, "Host not allowed");
  }

  try {
    const res = await fetch(target, {
      headers: {
        // Polite browser-like UA so sites don't block us
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioBot/1.0; +https://example.com)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      throw error(502, `Upstream returned ${res.status}`);
    }

    const html = await res.text();

    // Parse OG / Twitter / fallback meta tags with regex
    // (no DOM available in Node server-side, and we want zero dependencies)
    const og = extractOG(html);

    return json(og, {
      headers: {
        // Cache for 24 hours — these rarely change
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (e) {
    if (e.status) throw e; // re-throw SvelteKit errors
    throw error(502, "Failed to fetch upstream page");
  }
}

/**
 * Extract Open Graph / Twitter Card / fallback meta tags from raw HTML.
 * Returns { title, description, image, host }
 * @param {string} html
 */
function extractOG(html) {
  // Helper: pull content="…" or value="…" from a tag string
  const attr = (/** @type {{ match: (arg0: RegExp) => string[]; }} */ tag, /** @type {string} */ name) => {
    const re = new RegExp(`${name}=["']([^"']*)["']`, "i");
    return tag.match(re)?.[1]?.trim() ?? null;
  };

  // Grab all <meta …> tags in one pass
  const metaTags = [...html.matchAll(/<meta\s[^>]+>/gi)].map((m) => m[0]);

  const getMeta = (/** @type {string} */ property) => {
    for (const tag of metaTags) {
      const prop = attr(tag, "property") ?? attr(tag, "name");
      if (prop?.toLowerCase() === property.toLowerCase()) {
        return attr(tag, "content") ?? attr(tag, "value");
      }
    }
    return null;
  };

  // Title: og:title → twitter:title → <title> tag
  const ogTitle =
    getMeta("og:title") ??
    getMeta("twitter:title") ??
    html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ??
    null;

  // Description
  const ogDesc =
    getMeta("og:description") ??
    getMeta("twitter:description") ??
    getMeta("description") ??
    null;

  // Image: og:image → twitter:image
  const ogImage =
    getMeta("og:image") ??
    getMeta("twitter:image") ??
    getMeta("twitter:image:src") ??
    null;

  // Resolve relative image URLs won't happen for these sites,
  // but guard anyway by only returning http(s) URLs.
  const safeImage =
    ogImage && /^https?:\/\//i.test(ogImage) ? ogImage : null;

  return {
    title: decode(ogTitle),
    description: decode(ogDesc),
    image: safeImage,
  };
}

/** Decode common HTML entities */
function decode(str) {
  if (!str) return null;
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}