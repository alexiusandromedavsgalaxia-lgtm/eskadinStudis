export async function onRequestGet({ env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS public_games (id TEXT PRIMARY KEY, game TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))").run();
  let rows = await env.DB.prepare("SELECT game FROM public_games ORDER BY updated_at DESC").all();
  if (!rows.results?.length) {
    const legacy = await env.DB.prepare("SELECT games FROM user_games").all().catch(() => ({ results: [] }));
    const migrated = new Map();
    for (const row of legacy.results || []) {
      try {
        const games = JSON.parse(row.games || "[]");
        for (const game of Array.isArray(games) ? games : []) {
          if (game?.id != null) migrated.set(String(game.id), game);
        }
      } catch {}
    }
    if (migrated.size) {
      const stmt = env.DB.prepare("INSERT OR REPLACE INTO public_games (id, game, updated_at) VALUES (?1, ?2, datetime('now'))");
      await env.DB.batch([...migrated.values()].map(game => stmt.bind(String(game.id), JSON.stringify(game))));
      rows = await env.DB.prepare("SELECT game FROM public_games ORDER BY updated_at DESC").all();
    }
  }
  const games = (rows.results || []).map(row => { try { return JSON.parse(row.game) } catch { return null } }).filter(Boolean);
  return Response.json({ games });
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  const key = request.headers.get("X-Eskadin-Key");
  const body = await request.json().catch(() => null);
  const games = body?.games;
  if (!key || !Array.isArray(games)) return Response.json({ error: "Invalid payload" }, { status: 400 });
  const valid = games.filter(game => game && game.id != null && typeof game === "object");
  if (!valid.length) return Response.json({ error: "No valid games" }, { status: 400 });
  const totalSize = valid.reduce((n, game) => n + JSON.stringify(game).length, 0);
  if (totalSize > 900000) return Response.json({ error: "Games data too large" }, { status: 413 });
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS public_games (id TEXT PRIMARY KEY, game TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))").run();
  const stmt = env.DB.prepare("INSERT INTO public_games (id, game, updated_at) VALUES (?1, ?2, datetime('now')) ON CONFLICT(id) DO UPDATE SET game = excluded.game, updated_at = datetime('now')");
  await env.DB.batch(valid.map(game => stmt.bind(String(game.id), JSON.stringify(game))));
  return Response.json({ ok: true, count: valid.length });
}
