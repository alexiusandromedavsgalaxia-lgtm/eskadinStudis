export async function onRequestGet({ request, env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  const key = request.headers.get("X-Eskadin-Key");
  if (!key) return Response.json({ error: "Missing key" }, { status: 400 });
  const row = await env.DB.prepare("SELECT projects FROM user_projects WHERE user_key = ?1").bind(key).first();
  return Response.json({ projects: row?.projects ? JSON.parse(row.projects) : [] });
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return Response.json({ error: "DB binding missing" }, { status: 503 });
  const key = request.headers.get("X-Eskadin-Key");
  const body = await request.json().catch(() => null);
  const projects = body?.projects;
  if (!key || !Array.isArray(projects)) return Response.json({ error: "Invalid payload" }, { status: 400 });
  if (JSON.stringify(projects).length > 900000) return Response.json({ error: "Projects data too large" }, { status: 413 });
  await env.DB.prepare(
    "INSERT INTO user_projects (user_key, projects, updated_at) VALUES (?1, ?2, datetime('now')) ON CONFLICT(user_key) DO UPDATE SET projects = excluded.projects, updated_at = datetime('now')"
  ).bind(key, JSON.stringify(projects)).run();
  return Response.json({ ok: true });
}