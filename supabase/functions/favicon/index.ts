const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

const FETCH_HEADERS = {
  "User-Agent": "Mozilla/5.0 (compatible; favicon-proxy/1.0)",
  Accept: "text/html,*/*",
};

async function tryFetch(url: string, timeoutMs = 4000): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: FETCH_HEADERS, redirect: "follow", signal: AbortSignal.timeout(timeoutMs) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

function imageResponse(res: Response): Response {
  return new Response(res.body, {
    headers: {
      ...CORS,
      "Content-Type": res.headers.get("Content-Type") ?? "image/x-icon",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const { searchParams } = new URL(req.url);
  const site = searchParams.get("url");
  if (!site) return new Response("missing url", { status: 400, headers: CORS });

  let origin: string;
  try {
    origin = new URL(site).origin;
  } catch {
    return new Response("invalid url", { status: 400, headers: CORS });
  }

  // 1. Try /favicon.ico directly — fast, works for most sites
  const icoRes = await tryFetch(`${origin}/favicon.ico`);
  if (icoRes) return imageResponse(icoRes);

  // 2. Fetch page HTML and parse <link rel="icon"> tags
  const pageRes = await tryFetch(site, 5000);
  if (pageRes) {
    const html = await pageRes.text();
    const candidates: { href: string; score: number }[] = [];
    const linkRe = /<link[^>]+>/gi;

    for (const tag of html.matchAll(linkRe)) {
      const rel = /rel=["']([^"']+)["']/i.exec(tag[0])?.[1]?.toLowerCase() ?? "";
      if (!/(icon|shortcut)/.test(rel)) continue;
      const href = /href=["']([^"']+)["']/i.exec(tag[0])?.[1];
      if (!href) continue;
      const size = parseInt(/sizes=["'](\d+)x/i.exec(tag[0])?.[1] ?? "0");
      candidates.push({ href, score: (rel.includes("apple") ? 100 : 0) + size });
    }

    candidates.sort((a, b) => b.score - a.score);

    for (const { href } of candidates) {
      const iconUrl = href.startsWith("http") ? href : `${origin}${href.startsWith("/") ? "" : "/"}${href}`;
      const iconRes = await tryFetch(iconUrl);
      if (iconRes) return imageResponse(iconRes);
    }
  }

  return new Response(null, { status: 404, headers: CORS });
});
