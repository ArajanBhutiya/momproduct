/* Cloudflare Pages Function — total visitor counter.
   GET  /api/visits  -> { count }            (read)
   POST /api/visits  -> { count }            (count one visit, then return the total)
   Needs a KV namespace bound as VISITS (Pages project -> Settings -> Functions -> KV namespace bindings).
   Stores a single number. No IP addresses, cookies or personal data are stored.
   KV is eventually consistent, so under heavy simultaneous traffic the count is approximate. */

const KEY = "total";
const BOT = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|axios|node-fetch/i;
const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });

export async function onRequest({ request, env }) {
  if (!env.VISITS) return json({ error: "VISITS KV binding is not configured" }, 503);

  const read = async () => parseInt((await env.VISITS.get(KEY)) || "0", 10) || 0;

  if (request.method === "GET") return json({ count: await read() });

  if (request.method === "POST") {
    // Same-origin only, and ignore obvious bots so the number stays meaningful.
    const origin = request.headers.get("Origin");
    if (origin && new URL(origin).host !== new URL(request.url).host) return json({ error: "forbidden" }, 403);
    if (BOT.test(request.headers.get("User-Agent") || "")) return json({ count: await read(), counted: false });

    const next = (await read()) + 1;
    await env.VISITS.put(KEY, String(next));
    return json({ count: next, counted: true });
  }

  return json({ error: "method not allowed" }, 405);
}
