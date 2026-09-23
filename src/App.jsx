import { useEffect, useMemo, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import Marketplace from "./pages/Marketplace.jsx";
import AccountEdit from "./pages/AccountEdit.jsx";

const games = [
  { id: 1, title: "Neon District", genre: "Action · 3D", tag: "Featured", color: "violet", players: 1240, likes: 3820, description: "A neon playground where every corner can become part of your story." },
  { id: 2, title: "Blockline", genre: "Building", tag: "Popular", color: "lime", players: 842, likes: 2140, description: "Build compact worlds with simple pieces and fast iteration." },
  { id: 3, title: "Night Shift", genre: "Horror", tag: "Trending", color: "blue", players: 3400, likes: 8910, description: "A tense night job where the building is never quite empty." },
  { id: 4, title: "Worlds Apart", genre: "Adventure", tag: "New", color: "pink", players: 621, likes: 1702, description: "Explore connected places and decide which world gets remembered." }
];

const copy = {
  es: { explore:"Explorar", create:"Crear", developer:"Developer", account:"Cuenta", start:"Empezar", hero:"Crea. Publica. Juega.", sub:"Un espacio para crear juegos 3D, publicarlos y jugar sin anuncios ni compras dentro de las experiencias.", make:"Crear un juego", discover:"Explorar juegos", editorKicker:"CREAR SIN PELEARTE CON EL EDITOR", editorTitle:"Tu idea primero. El código, después.", editorText:"Coloca objetos, luces, sonidos y lógica desde una interfaz hecha para construir rápido.", catalog:"CATÁLOGO", catalogTitle:"Juegos de la comunidad", catalogText:"Descubre experiencias, juega y guarda tus favoritas.", newGame:"Nuevo juego", play:"Jugar", like:"Me gusta", liked:"Te gusta", back:"Volver", publish:"Publicar", stats:"Estadísticas", save:"Guardar", language:"Idioma", objects:"OBJETOS", properties:"PROPIEDADES", wall:"Pared", block:"Bloque", light:"Luz", sound:"Sonido", spawn:"Spawn", objectName:"Nombre", position:"Posición", scale:"Escala", drag:"Arrastra objetos aquí", free:"Publicar gratis", public:"Público", private:"Privado", noMoney:"Sin pagos reales", footer:"Creado para crear. Diseñado para jugar.", login:"Iniciar sesión", register:"Crear cuenta" },
  en: { explore:"Explore", create:"Create", developer:"Developer", account:"Account", start:"Start", hero:"Create. Publish. Play.", sub:"A place to create 3D games, publish them and play without ads or in-game purchases.", make:"Create a game", discover:"Explore games", editorKicker:"CREATE WITHOUT FIGHTING THE EDITOR", editorTitle:"Your idea first. Code later.", editorText:"Place objects, lights, sounds and logic through an interface built for fast creation.", catalog:"CATALOG", catalogTitle:"Community games", catalogText:"Discover experiences, play and save your favorites.", newGame:"New game", play:"Play", like:"Like", liked:"Liked", back:"Back", publish:"Publish", stats:"Statistics", save:"Save", language:"Language", objects:"OBJECTS", properties:"PROPERTIES", wall:"Wall", block:"Block", light:"Light", sound:"Sound", spawn:"Spawn", objectName:"Name", position:"Position", scale:"Scale", drag:"Drag objects here", free:"Publish free", public:"Public", private:"Private", noMoney:"No real-money payments", footer:"Built to create. Designed to play.", login:"Log in", register:"Create account" },
  sv: { explore:"Utforska", create:"Skapa", developer:"Utvecklare", account:"Konto", start:"Börja", hero:"Skapa. Publicera. Spela.", sub:"En plats för att skapa 3D-spel, publicera dem och spela utan reklam eller köp i spelen.", make:"Skapa ett spel", discover:"Utforska spel", editorKicker:"SKAPA UTAN ATT KRIGA MED EDITORN", editorTitle:"Din idé först. Kod senare.", editorText:"Placera objekt, ljus, ljud och logik i ett gränssnitt byggt för snabb skapning.", catalog:"KATALOG", catalogTitle:"Spel från communityn", catalogText:"Upptäck upplevelser, spela och spara dina favoriter.", newGame:"Nytt spel", play:"Spela", like:"Gilla", liked:"Gillat", back:"Tillbaka", publish:"Publicera", stats:"Statistik", save:"Spara", language:"Språk", objects:"OBJEKT", properties:"EGENSKAPER", wall:"Vägg", block:"Block", light:"Ljus", sound:"Ljud", spawn:"Spawn", objectName:"Namn", position:"Position", scale:"Skala", drag:"Dra objekt hit", free:"Publicera gratis", public:"Offentligt", private:"Privat", noMoney:"Inga riktiga betalningar", footer:"Bygg för att skapa. Designat för att spela.", login:"Logga in", register:"Skapa konto" },
  de: { explore:"Entdecken", create:"Erstellen", developer:"Entwickler", account:"Konto", start:"Starten", hero:"Erstellen. Veröffentlichen. Spielen.", sub:"Ein Ort für 3D-Spiele, Veröffentlichung und Spielen ohne Werbung oder In-Game-Käufe.", make:"Spiel erstellen", discover:"Spiele entdecken", editorKicker:"ERSTELLEN OHNE KAMPF MIT DEM EDITOR", editorTitle:"Deine Idee zuerst. Code später.", editorText:"Platziere Objekte, Licht, Sounds und Logik über eine Oberfläche für schnelles Erstellen.", catalog:"KATALOG", catalogTitle:"Spiele der Community", catalogText:"Entdecke Erlebnisse, spiele und speichere deine Favoriten.", newGame:"Neues Spiel", play:"Spielen", like:"Gefällt mir", liked:"Gefällt mir", back:"Zurück", publish:"Veröffentlichen", stats:"Statistiken", save:"Speichern", language:"Sprache", objects:"OBJEKTE", properties:"EIGENSCHAFTEN", wall:"Wand", block:"Block", light:"Licht", sound:"Sound", spawn:"Spawn", objectName:"Name", position:"Position", scale:"Skalierung", drag:"Objekte hierher ziehen", free:"Kostenlos veröffentlichen", public:"Öffentlich", private:"Privat", noMoney:"Keine Echtgeldzahlungen", footer:"Zum Erstellen gebaut. Zum Spielen gemacht.", login:"Anmelden", register:"Konto erstellen" },
  fr: { explore:"Explorer", create:"Créer", developer:"Développeur", account:"Compte", start:"Commencer", hero:"Crée. Publie. Joue.", sub:"Un espace pour créer des jeux 3D, les publier et jouer sans pubs ni achats intégrés.", make:"Créer un jeu", discover:"Explorer les jeux", editorKicker:"CRÉER SANS SE BATTRE AVEC L'ÉDITEUR", editorTitle:"Ton idée d'abord. Le code ensuite.", editorText:"Place objets, lumières, sons et logique dans une interface pensée pour créer vite.", catalog:"CATALOGUE", catalogTitle:"Jeux de la communauté", catalogText:"Découvre des expériences, joue et garde tes préférées.", newGame:"Nouveau jeu", play:"Jouer", like:"J'aime", liked:"Aimé", back:"Retour", publish:"Publier", stats:"Statistiques", save:"Enregistrer", language:"Langue", objects:"OBJETS", properties:"PROPRIÉTÉS", wall:"Mur", block:"Bloc", light:"Lumière", sound:"Son", spawn:"Spawn", objectName:"Nom", position:"Position", scale:"Échelle", drag:"Glisse les objets ici", free:"Publier gratuitement", public:"Public", private:"Privé", noMoney:"Aucun paiement réel", footer:"Conçu pour créer. Pensé pour jouer.", login:"Se connecter", register:"Créer un compte" }
};

function Layout({children}){
  const [lang,setLang]=useState(()=>localStorage.getItem("eskadin-lang")||"es");
  const t=copy[lang];
  useEffect(()=>localStorage.setItem("eskadin-lang",lang),[lang]);
  return <div className="app-shell">
    <div className="wrap">
      <nav className="nav">
        <Link className="brand" to="/">Esk<span>å</span>din St<span>ü</span>dis<sup>®</sup></Link>
        <div className="nav-links">
          <NavLink to="/games">{t.explore}</NavLink>
          <NavLink to="/editor">{t.create}</NavLink>
          <NavLink to="/developer">{t.developer}</NavLink>
          <NavLink to="/account">{t.account}</NavLink>
        </div>
        <div className="nav-actions">
          <select className="lang" aria-label={t.language} value={lang} onChange={e=>{setLang(e.target.value);window.dispatchEvent(new CustomEvent("eskadin-lang",{detail:e.target.value}))}}>
            <option value="es">ES</option><option value="en">EN</option><option value="sv">SV</option><option value="de">DE</option><option value="fr">FR</option>
          </select>
          <Link className="button button-primary small" to="/editor">{t.start}</Link>
        </div>
      </nav>
      {children}
      <footer className="footer"><span>© 2026 Eskådin Stüdis®</span><span>{t.footer}</span></footer>
    </div>
  </div>
}

function useTranslation(){
  const [lang,setLang]=useState(()=>localStorage.getItem("eskadin-lang")||"es");
  useEffect(()=>{ const f=e=>setLang(e.detail); window.addEventListener("eskadin-lang",f); return()=>window.removeEventListener("eskadin-lang",f)},[]);
  return copy[lang];
}

function Home(){
 const t=useTranslation();
 return <main>
  <section className="hero">
   <div className="hero-grid">
    <div className="hero-copy">
     <div className="pill">ESKÅDIN STÜDIS® · 2026</div>
     <h1><span>{t.hero.split(" ")[0]}</span><span className="gradient">{t.hero.split(" ")[1]}</span><span>{t.hero.split(" ")[2]}</span></h1>
     <p className="lead">{t.sub}</p>
     <div className="actions"><Link className="button button-primary" to="/editor">{t.make}</Link><Link className="button button-ghost" to="/games">{t.discover}</Link></div>
     <div className="proof"><span><b>∞</b> publicación</span><span><b>0€</b> anuncios</span><span><b>F¢</b> moneda jugable</span></div>
    </div>
    <div className="hero-device">
      <div className="device-top"><span>● ● ●</span><b>eskadin://editor</b><span>•••</span></div>
      <div className="device-scene"><div className="scene-orb"/><div className="scene-building"/><div className="scene-floor"/></div>
      <div className="device-bottom"><span>SCENE</span><span>3 objects</span><span>LIVE PREVIEW</span></div>
    </div>
   </div>
  </section>
  <section className="section">
   <div className="section-head"><div className="eyebrow">{t.editorKicker}</div><h2>{t.editorTitle}</h2><p>{t.editorText}</p></div>
   <div className="feature-grid">
    <article className="card"><div className="icon">01</div><h3>Visual building</h3><p>Drag a wall, place a light, move a spawn. The scene updates immediately.</p></article>
    <article className="card"><div className="icon">02</div><h3>Publish once</h3><p>Prepare a version, set visibility and send it to your game page.</p></article>
    <article className="card"><div className="icon">03</div><h3>Play without clutter</h3><p>No ads and no real-money purchases inside community experiences.</p></article>
   </div>
  </section>
  <section className="section"><div className="section-head"><div className="eyebrow">{t.catalog}</div><h2>{t.catalogTitle}</h2><p>{t.catalogText}</p></div>
   <div className="featured-row">{games.map(g=><Link to={"/games/"+g.id} className={"featured "+g.color} key={g.id}><span>{g.tag}</span><strong>{g.title}</strong><small>{g.genre} · {g.players.toLocaleString()} players</small></Link>)}</div>
  </section>
  <section className="section"><div className="cta"><div className="eyebrow">F¢ · ESKÅDIN STÜDIS®</div><h2>Make something people can play.</h2><p>Build it, test it, publish it, then watch people discover it.</p><div className="actions"><Link className="button button-primary" to="/editor">{t.start}</Link><Link className="button button-ghost" to="/developer">{t.developer}</Link></div></div></section>
 </main>
}

function Games(){
 const t=useTranslation(); const [query,setQuery]=useState(""); const [sort,setSort]=useState("popular");
 const filtered=useMemo(()=>games.filter(g=>(g.title+" "+g.genre).toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==="likes"?b.likes-a.likes:b.players-a.players),[query,sort]);
 return <main className="page"><div className="page-head"><div><div className="eyebrow">{t.catalog}</div><h1 className="page-title">{t.catalogTitle}</h1><p>{t.catalogText}</p></div><Link className="button button-primary" to="/editor">{t.newGame}</Link></div>
  <div className="toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search / Buscar / Sök / Suchen / Rechercher…"/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="popular">Popular</option><option value="likes">Likes</option></select></div>
  <div className="games-grid">{filtered.map(g=><Link className="game-card" to={"/games/"+g.id} key={g.id}><div className={"game-cover "+g.color}><span>{g.tag}</span></div><div className="game-info"><h3>{g.title}</h3><p>{g.genre}</p><b>♥ {g.likes.toLocaleString()} · {g.players.toLocaleString()} online</b></div></Link>)}</div>
 </main>
}

function Game(){
 const t=useTranslation(); const {id}=useParams(); const game=games.find(g=>String(g.id)===id)||games[0]; const [liked,setLiked]=useState(false);
 return <main className="page"><Link className="back" to="/games">← {t.back}</Link><div className="game-hero"><div className={"game-cover big "+game.color}><span>{game.title}</span></div><div><div className="eyebrow">{game.tag} · #{game.id}</div><h1 className="page-title">{game.title}</h1><p>{game.description}</p><p className="muted">{game.genre} · {game.players.toLocaleString()} playing now · {(game.likes+(liked?1:0)).toLocaleString()} likes</p><div className="actions"><Link className="button button-primary" to={"/games/"+game.id+"/play"}>▶ {t.play}</Link><button className="button button-ghost" onClick={()=>setLiked(!liked)}>{liked?"♥":"♡"} {liked?t.liked:t.like}</button></div></div></div></main>
}

function Play(){
 const {id}=useParams(); const game=games.find(g=>String(g.id)===id)||games[0]; const [started,setStarted]=useState(false);
 return <main className="page play"><div className="playbar"><Link to={"/games/"+game.id}>← Exit</Link><b>{game.title}</b><span>{started?"LIVE":"READY"}</span></div><div className="game-viewport"><div className="crosshair">+</div>{started?<div className="play-message"><strong>RUNTIME ONLINE</strong><small>Scene loaded · input enabled · session active</small></div>:<div className="launch-card"><span>ESKÅDIN RUNTIME</span><h2>{game.title}</h2><p>Playable preview for this experience.</p><button className="button button-primary" onClick={()=>setStarted(true)}>▶ Launch</button></div>}</div></main>
}

function Editor(){
 const t=useTranslation(); const [objects,setObjects]=useState([{type:"wall",name:"Wall 01",x:0,y:0,z:0}]); const [selected,setSelected]=useState(0); const [saved,setSaved]=useState(false);
 const add=type=>{setObjects(o=>[...o,{type,name:type+" "+String(o.length+1).padStart(2,"0"),x:0,y:0,z:0}]);setSelected(objects.length)};
 const obj=objects[selected];
 return <main className="page"><div className="page-head"><div><div className="eyebrow">ESKÅDIN CREATOR</div><h1 className="page-title">Editor</h1><p>{t.editorText}</p></div><div className="actions"><button className="button button-ghost" onClick={()=>setSaved(true)}>{saved?"✓ Saved":t.save}</button><Link className="button button-primary" to="/publish">{t.publish}</Link></div></div>
 <div className="editor-layout"><aside className="editor-side"><b>{t.objects}</b><button onClick={()=>add("wall")}>▣ {t.wall}</button><button onClick={()=>add("block")}>◆ {t.block}</button><button onClick={()=>add("light")}>◉ {t.light}</button><button onClick={()=>add("sound")}>♫ {t.sound}</button><button onClick={()=>add("spawn")}>⌁ {t.spawn}</button><div className="object-list">{objects.map((o,i)=><button className={i===selected?"selected":""} onClick={()=>setSelected(i)} key={i}>{o.name}</button>)}</div></aside><div className="editor-canvas"><div className="scene-grid"><div className="scene-object-list">{objects.map((o,i)=><button key={i} className={"scene-object "+o.type+(i===selected?" selected":"")} onClick={()=>setSelected(i)}>{o.name}</button>)}</div><span>{t.drag}</span></div></div><aside className="properties"><b>{t.properties}</b>{obj&&<><label>{t.objectName}<input value={obj.name} onChange={e=>setObjects(os=>os.map((x,i)=>i===selected?{...x,name:e.target.value}:x))}/></label><label>{t.position}<input value={[obj.x,obj.y,obj.z].join(", ")} onChange={e=>{const v=e.target.value.split(",").map(Number);setObjects(os=>os.map((x,i)=>i===selected?{...x,x:v[0]||0,y:v[1]||0,z:v[2]||0}:x))}}/></label><label>{t.scale}<input defaultValue="1, 1, 1"/></label></>}</aside></div></main>
}

function Developer(){const t=useTranslation();return <main className="page"><div className="eyebrow">DEVELOPER HUB</div><h1 className="page-title">Your studio dashboard.</h1><div className="dashboard-grid"><Link to="/editor" className="dash"><b>🧱 {t.create}</b><span>Build and test scenes.</span></Link><Link to="/publish" className="dash"><b>📤 {t.publish}</b><span>Prepare a public release.</span></Link><Link to="/statistics" className="dash"><b>📊 {t.stats}</b><span>Visits, likes and sessions.</span></Link><Link to="/account" className="dash"><b>👤 {t.account}</b><span>Profile and settings.</span></Link></div></main>}

function Publish(){const t=useTranslation();const [done,setDone]=useState(false);return <main className="page narrow"><div className="eyebrow">PUBLISHING</div><h1 className="page-title">{t.publish}</h1>{done?<div className="success-card"><b>✓ Published</b><p>Your experience is now visible in the catalog.</p><Link className="button button-primary" to="/games">{t.explore}</Link></div>:<div className="form-card"><label>{t.objectName}<input placeholder="My game"/></label><label>Description<textarea placeholder="What makes it fun?"/></label><label>Visibility<select><option>{t.public}</option><option>{t.private}</option></select></label><button className="button button-primary" onClick={()=>setDone(true)}>{t.free}</button><p className="muted">{t.noMoney}. F¢ cannot be purchased or converted to real money.</p></div>}</main>}

function Statistics(){const t=useTranslation();return <main className="page"><div className="eyebrow">ANALYTICS</div><h1 className="page-title">{t.stats}</h1><div className="stats-grid"><div><b>12.4K</b><span>Visits</span></div><div><b>1.8K</b><span>Likes</span></div><div><b>3.2K</b><span>Sessions</span></div><div><b>48h</b><span>Playtime</span></div></div><div className="chart"><div className="chart-title">Weekly activity</div>{[42,61,48,78,69,92,74].map((h,i)=><i style={{height:h+"%"}} key={i}/>)}</div></main>}

function Account(){const t=useTranslation();const [profile,setProfile]=useState(()=>{try{return JSON.parse(localStorage.getItem("eskadin-profile"))||{username:"Eskådin Player",displayName:"Eskådin Player",bio:"",avatar:"ES"}}catch{return {username:"Eskådin Player",displayName:"Eskådin Player",bio:"",avatar:"ES"}}});return <main className="page narrow"><div className="eyebrow">{t.account}</div><h1 className="page-title">Player profile.</h1><div className="form-card"><div className="account-avatar">{profile.avatar||"ES"}</div><h2>{profile.displayName||profile.username}</h2><p className="muted">@{profile.username}</p>{profile.bio&&<p>{profile.bio}</p>}<p className="muted">0 published games · 0 sessions · 0 F¢</p><div className="account-actions"><Link className="button button-primary" to="/account/edit">Edit profile</Link><Link className="button button-ghost" to="/marketplace">Marketplace</Link><Link className="button button-ghost" to="/editor">{t.create}</Link><Link className="button button-ghost" to="/statistics">{t.stats}</Link><Link className="button danger-button" to="/account/delete">Delete account</Link></div><Link className="muted" to="/">{t.back}</Link></div></main>}
function Login(){const t=useTranslation();return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.login}</h1><p className="muted">Sign in to continue creating and playing.</p><label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><button className="button button-primary">{t.login}</button><Link className="muted" to="/register">{t.register}</Link></div></main>}
function Register(){const t=useTranslation();return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.register}</h1><label>Username<input placeholder="Your creator name"/></label><label>Email<input type="email" placeholder="you@example.com"/></label><label>Password<input type="password" placeholder="••••••••"/></label><label>Confirm password<input type="password" placeholder="••••••••"/></label><button className="button button-primary">{t.register}</button><Link className="muted" to="/login">{t.login}</Link></div></main>}
function DeleteAccount(){const navigate=useNavigate();const [confirm,setConfirm]=useState("");return <main className="page narrow auth-page"><div className="form-card danger-card"><div className="eyebrow danger">DANGER ZONE</div><h1>Delete account</h1><p className="muted">This demo action represents permanent account deletion. Type DELETE to confirm.</p><input value={confirm} onChange={e=>setConfirm(e.target.value)} placeholder="DELETE"/><button className="button danger-button" disabled={confirm!=="DELETE"} onClick={()=>navigate("/")}>Delete account</button></div></main>}
function NotFound(){return <main className="page notfound"><h1>404</h1><p>This page escaped the editor.</p><Link className="button button-primary" to="/">Home</Link></main>}

export default function App(){return <Layout><Routes><Route path="/" element={<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:id" element={<Game/>}/><Route path="/games/:id/play" element={<Play/>}/><Route path="/editor" element={<Editor/>}/><Route path="/developer" element={<Developer/>}/><Route path="/publish" element={<Publish/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/account" element={<Account/>}/><Route path="/account/edit" element={<AccountEdit/>}/><Route path="/marketplace" element={<Marketplace/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/account/delete" element={<DeleteAccount/>}/><Route path="*" element={<NotFound/>}/></Routes></Layout>}
