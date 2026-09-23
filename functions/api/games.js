export async function onRequestGet({ request, env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  const key = new URL(request.url).searchParams.get("key");
  if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
  const row = await env.DB.prepare("SELECT games FROM user_games WHERE user_key = ?1").bind(key).first();
  return Response.json({ games: row?.games ? JSON.parse(row.games) : [] });
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  const body = await request.json().catch(() => null);
  const key = body?.key;
  const games = body?.games;
  if (!key || !Array.isArray(games)) return Response.json({ error: "Invalid payload" }, { status: 400 });
  if (JSON.stringify(games).length > 900000) return Response.json({ error: "Games data too large" }, { status: 413 });
  await env.DB.prepare(
    "INSERT INTO user_games (user_key, games, updated_at) VALUES (?1, ?2, datetime('now')) ON CONFLICT(user_key) DO UPDATE SET games = excluded.games, updated_at = datetime('now')"
  ).bind(key, JSON.stringify(games)).run();
  return Response.json({ ok: true });
}