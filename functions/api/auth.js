async function hashPassword(password,salt){const enc=new TextEncoder();const key=await crypto.subtle.importKey("raw",enc.encode(password),"PBKDF2",false,["deriveBits"]);const bits=await crypto.subtle.deriveBits({name:"PBKDF2",salt:enc.encode(salt),iterations:120000,hash:"SHA-256"},key,256);return [...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function token(){return crypto.randomUUID()+"."+crypto.randomUUID()}
function json(data,status=200,extra={}){return new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store, no-cache, must-revalidate",...extra}})}
async function ensureSchema(db){
  await db.prepare("CREATE TABLE IF NOT EXISTS accounts(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,email TEXT UNIQUE,password_hash TEXT NOT NULL,salt TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP)").run();
  await db.prepare("CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,account_id TEXT NOT NULL,expires_at TEXT NOT NULL)").run();
  const cols=await db.prepare("PRAGMA table_info(accounts)").all();
  const emailCol=(cols.results||[]).find(c=>c.name==="email");
  if(emailCol?.notnull){
    await db.prepare("BEGIN").run();
    try{
      await db.prepare("ALTER TABLE accounts RENAME TO accounts_legacy").run();
      await db.prepare("CREATE TABLE accounts(id TEXT PRIMARY KEY,name TEXT NOT NULL UNIQUE,email TEXT UNIQUE,password_hash TEXT NOT NULL,salt TEXT NOT NULL,created_at TEXT DEFAULT CURRENT_TIMESTAMP)").run();
      await db.prepare("INSERT INTO accounts(id,name,email,password_hash,salt,created_at) SELECT id,name,email,password_hash,salt,created_at FROM accounts_legacy").run();
      await db.prepare("DROP TABLE accounts_legacy").run();
      await db.prepare("COMMIT").run();
    }catch(e){try{await db.prepare("ROLLBACK").run()}catch{};throw e}
  }
}
export async function onRequestPost({request,env}){
  if(!env?.DB)return json({error:"DB not configured"},503);
  try{
    const b=await request.json();
    if(!b?.name||!b?.password)return json({error:"username and password required"},400);
    await ensureSchema(env.DB);
    if(b.action==="register"){
      const salt=crypto.randomUUID();const password_hash=await hashPassword(b.password,salt);const id=crypto.randomUUID();
      try{
        await env.DB.prepare("INSERT INTO accounts(id,name,email,password_hash,salt) VALUES(?,?,?,?,?)").bind(id,String(b.name).trim(),b.email?String(b.email).trim().toLowerCase():null,password_hash,salt).run();
      }catch(e){
        const message=String(e?.message||e);
        if(message.toLowerCase().includes("unique")||message.toLowerCase().includes("constraint"))return json({error:"Username or email already registered"},409);
        return json({error:"Could not create account",detail:message},500);
      }
      const t=token();await env.DB.prepare("INSERT INTO sessions(token,account_id,expires_at) VALUES(?,?,datetime('now','+30 day'))").bind(t,id).run();
      return json({user:{id,name:String(b.name).trim(),email:b.email?String(b.email).trim().toLowerCase():""}},200,{"set-cookie":"session="+t+"; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000"});
    }
    if(b.action==="login"){
      const row=await env.DB.prepare("SELECT * FROM accounts WHERE name=?").bind(String(b.name).trim()).first();
      if(!row||await hashPassword(b.password,row.salt)!==row.password_hash)return json({error:"Invalid credentials"},401);
      const t=token();await env.DB.prepare("INSERT INTO sessions(token,account_id,expires_at) VALUES(?,?,datetime('now','+30 day'))").bind(t,row.id).run();
      return json({user:{id:row.id,name:row.name,email:row.email||""}},200,{"set-cookie":"session="+t+"; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000"});
    }
    return json({error:"Unknown action"},400);
  }catch(e){return json({error:"Account operation failed",detail:String(e?.message||e)},500)}
}
export async function onRequestGet({env}){if(!env?.DB)return json({ok:false,error:"DB not configured"},503);try{await env.DB.prepare("SELECT 1").first();return json({ok:true,service:"auth",database:"connected"})}catch(e){return json({ok:false,error:"D1 query failed",detail:String(e?.message||e)},500)}}
