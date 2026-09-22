import {createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {Link,NavLink,Route,Routes,useNavigate,useParams} from "react-router-dom";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {TransformControls} from "three/addons/controls/TransformControls.js";

const LANG={es:"ES",en:"EN",sv:"SV",de:"DE",fr:"FR"};
const TXT={
es:{explore:"Explorar",create:"Crear",developer:"Developer",account:"Cuenta",login:"Iniciar sesión",register:"Crear cuenta",logout:"Cerrar sesión",delete:"Borrar cuenta",publish:"Publicar",save:"Guardar",missions:"Misiones",wallet:"F¢",settings:"Ajustes",projects:"Proyectos",play:"Jugar",like:"Me gusta",back:"Volver",objects:"OBJETOS",properties:"PROPIEDADES",search:"Buscar juegos…",newGame:"Nuevo juego",language:"Idioma",name:"Nombre",description:"Descripción",published:"Publicado"},
en:{explore:"Explore",create:"Create",developer:"Developer",account:"Account",login:"Log in",register:"Create account",logout:"Log out",delete:"Delete account",publish:"Publish",save:"Save",missions:"Missions",wallet:"F¢",settings:"Settings",projects:"Projects",play:"Play",like:"Like",back:"Back",objects:"OBJECTS",properties:"PROPERTIES",search:"Search games…",newGame:"New game",language:"Language",name:"Name",description:"Description",published:"Published"},
sv:{explore:"Utforska",create:"Skapa",developer:"Utvecklare",account:"Konto",login:"Logga in",register:"Skapa konto",logout:"Logga ut",delete:"Ta bort konto",publish:"Publicera",save:"Spara",missions:"Uppdrag",wallet:"F¢",settings:"Inställningar",projects:"Projekt",play:"Spela",like:"Gilla",back:"Tillbaka",objects:"OBJEKT",properties:"EGENSKAPER",search:"Sök spel…",newGame:"Nytt spel",language:"Språk",name:"Namn",description:"Beskrivning",published:"Publicerad"},
de:{explore:"Entdecken",create:"Erstellen",developer:"Entwickler",account:"Konto",login:"Anmelden",register:"Konto erstellen",logout:"Abmelden",delete:"Konto löschen",publish:"Veröffentlichen",save:"Speichern",missions:"Missionen",wallet:"F¢",settings:"Einstellungen",projects:"Projekte",play:"Spielen",like:"Gefällt mir",back:"Zurück",objects:"OBJEKTE",properties:"EIGENSCHAFTEN",search:"Spiele suchen…",newGame:"Neues Spiel",language:"Sprache",name:"Name",description:"Beschreibung",published:"Veröffentlicht"},
fr:{explore:"Explorer",create:"Créer",developer:"Développeur",account:"Compte",login:"Connexion",register:"Créer un compte",logout:"Déconnexion",delete:"Supprimer le compte",publish:"Publier",save:"Enregistrer",missions:"Missions",wallet:"F¢",settings:"Réglages",projects:"Projets",play:"Jouer",like:"J'aime",back:"Retour",objects:"OBJETS",properties:"PROPRIÉTÉS",search:"Rechercher des jeux…",newGame:"Nouveau jeu",language:"Langue",name:"Nom",description:"Description",published:"Publié"}};
const seed=[];
const CATALOG_VERSION="2026-09-22-clean";
const reservedCompanies=[
"keplerians","roblox","roblox corporation","dvloper","granny","evil nun","ice scream","mr meat","datavaseloper",
"apple","microsoft","google","alphabet","amazon","meta","facebook","instagram","whatsapp","x corp","twitter",
"tiktok","bytedance","sony","playstation","nintendo","xbox","valve","steam","epic games","unity","unreal engine",
"godot","minecraft","mojang","discord","openai","chatgpt","gemini","anthropic","nvidia","samsung","xiaomi",
"spotify","netflix","youtube","telegram","snapchat","ea","electronic arts","ubisoft","activision","blizzard",
"take two","rockstar games","bandai namco","sega","capcom","square enix","konami","supercell","riot games",
"cd projekt red","bethesda","zynga","fortnite","valorant","league of legends"
];
const confusableMap={"а":"a","е":"e","о":"o","р":"p","с":"c","х":"x","у":"y","к":"k","м":"m","н":"h","т":"t","і":"i","һ":"h","@":"a","$":"s","0":"o","1":"i","3":"e","4":"a","5":"s","7":"t","8":"b","9":"g"};
const normalizeIdentity=v=>String(v||"").normalize("NFKD").toLowerCase().replace(/[\u0300-\u036f]/g,"").split("").map(c=>confusableMap[c]||c).join("").replace(/[^a-z0-9]/g,"");
const blockedIdentity=name=>{
 const n=normalizeIdentity(name);
 return reservedCompanies.some(company=>{
   const c=normalizeIdentity(company);
   if(!c)return false;
   return n===c || n.includes(c);
 });
};
const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}};
const save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

function useLang(){const{lang,setLang}=useContext(LangContext);return[lang,TXT[lang]]}
const LangContext=createContext(null);
function LangProvider({children}){const[lang,setLangState]=useState(()=>localStorage.getItem("eskadin-lang")||"es");const setLang=v=>{setLangState(v);localStorage.setItem("eskadin-lang",v)};return <LangContext.Provider value={{lang,setLang}}>{children}</LangContext.Provider>}
const AuthContext=createContext(null);
function useUser(){return useContext(AuthContext)}
function AuthProvider({children}){const[user,setUser]=useState(()=>read("eskadin-user",null));const[developer,setDeveloper]=useState(()=>read("eskadin-developer",null));const login=u=>{setUser(u);save("eskadin-user",u)};const logout=()=>{setUser(null);localStorage.removeItem("eskadin-user")};const devLogin=u=>{setDeveloper(u);save("eskadin-developer",u)};const devLogout=()=>{setDeveloper(null);localStorage.removeItem("eskadin-developer")};return <AuthContext.Provider value={{user,developer,login,logout,devLogin,devLogout}}>{children}</AuthContext.Provider>}
function useGames(){const[games,setGames]=useState(()=>{if(localStorage.getItem("eskadin-games-version")!==CATALOG_VERSION){localStorage.setItem("eskadin-games-version",CATALOG_VERSION);localStorage.removeItem("eskadin-games");return seed}return read("eskadin-games",seed)});useEffect(()=>save("eskadin-games",games),[games]);return[games,setGames]}

function Shell({children}){const[lang,setLang]=useLang();const t=TXT[lang];const{user,developer}=useUser();return <div className="app-shell"><div className="wrap"><nav className="nav"><Link className="brand" to="/">Esk<span>å</span>din St<span>ü</span>dis<sup>®</sup></Link><div className="nav-links"><NavLink to="/games">{t.explore}</NavLink><NavLink to="/editor">{t.create}</NavLink><NavLink to="/missions">{t.missions}</NavLink><NavLink to="/developer">{t.developer}</NavLink></div><div className="nav-actions"><select className="lang" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>{developer?<Link className="avatar-link dev-avatar" to="/developer/account">DEV</Link>:user?<Link className="avatar-link" to="/account">{user.name.slice(0,2).toUpperCase()}</Link>:<><Link className="button button-ghost small" to="/register">{t.register}</Link><Link className="button button-primary small" to="/login">{t.login}</Link></>}</div></nav>{children}<footer className="footer"><span>© 2026 Eskådin Stüdis®</span><span>0 ads · 0 real-money purchases · F¢ gameplay-only</span></footer></div></div>}
function Home(){const[,t]=useLang();return <main><section className="hero"><div className="hero-grid"><div className="hero-copy"><div className="pill">ESKÅDIN STÜDIS® · CREATOR PLATFORM</div><h1><span>{t.create}.</span><span className="gradient">{t.publish}.</span><span>{t.play}.</span></h1><p className="lead">Create 3D experiences, publish them and play them without ads or real-money purchases.</p><div className="actions"><Link className="button button-primary" to="/editor">{t.create}</Link><Link className="button button-ghost" to="/games">{t.explore}</Link></div></div><div className="hero-device"><div className="device-top"><b>eskadin://studio</b><span>LIVE</span></div><div className="device-scene"><div className="scene-orb"/><div className="scene-building"/><div className="scene-floor"/></div><div className="device-bottom"><span>SCENE</span><span>OBJECTS · 3</span><span>PREVIEW</span></div></div></div></section><section className="section"><div className="section-head"><div className="eyebrow">STUDIO</div><h2>A small creator platform that actually does things.</h2><p>Editor, projects, publishing, profiles, F¢ missions, analytics and playable previews.</p></div><div className="feature-grid"><article className="card"><div className="icon">01</div><h3>Scene editor</h3><p>Objects, hierarchy, transforms, duplicate, delete, save and preview.</p></article><article className="card"><div className="icon">02</div><h3>Community</h3><p>Publish experiences, browse games, like them and play them.</p></article><article className="card"><div className="icon">03</div><h3>F¢ economy</h3><p>Earn platform currency through missions. Never buy it with real money.</p></article></div></section></main>}

function Games(){const[,t]=useLang();const[games]=useGames();const[q,setQ]=useState("");const filtered=useMemo(()=>games.filter(g=>(g.title+" "+g.genre+" "+g.author).toLowerCase().includes(q.toLowerCase())),[games,q]);return <main className="page"><div className="page-head"><div><div className="eyebrow">{t.explore}</div><h1 className="page-title">Community games</h1></div><Link className="button button-primary" to="/editor">{t.newGame}</Link></div><div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><div className="games-grid">{filtered.map(g=><Link className="game-card" to={"/games/"+g.id} key={g.id}><div className={"game-cover "+g.color}><span>{g.tag}</span></div><div className="game-info"><h3>{g.title}</h3><p>{g.genre} · {g.author}</p><b>♥ {g.likes.toLocaleString()} · {g.players.toLocaleString()} online</b></div></Link>)}</div></main>}

function Game(){const[,t]=useLang();const{id}=useParams();const[games]=useGames();const game=games.find(g=>String(g.id)===id)||null;const[liked,setLiked]=useState(false);useEffect(()=>{if(game){const viewKey="eskadin-viewed-"+game.id;if(!sessionStorage.getItem(viewKey)){sessionStorage.setItem(viewKey,"1");localStorage.setItem("eskadin-stat-views",String(Number(localStorage.getItem("eskadin-stat-views")||0)+1))}const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.explore){p.explore=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+12))}}},[id]);if(!game)return <main className="page narrow"><Link className="back" to="/games">← {t.back}</Link><div className="form-card"><h2>No hay juegos publicados todavía.</h2><p className="muted">Publica una experiencia desde una cuenta de desarrollador para poder explorarla.</p><Link className="button button-primary" to="/developer/register">Crear cuenta de desarrollador</Link></div></main>;return <main className="page"><Link className="back" to="/games">← {t.back}</Link><div className="game-hero"><div className={"game-cover big "+game.color}><span>{game.title}</span></div><div><div className="eyebrow">{game.tag} · {game.author}</div><h1 className="page-title">{game.title}</h1><p>{game.description}</p><p className="muted">{game.genre} · {game.players.toLocaleString()} playing · {(game.likes+(liked?1:0)).toLocaleString()} likes</p><div className="actions"><Link className="button button-primary" to={"/games/"+game.id+"/play"}>▶ {t.play}</Link><button className="button button-ghost" onClick={()=>{if(!liked){const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.like){p.like=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+5))}}setLiked(!liked)}}>{liked?"♥":"♡"} {liked?"Liked":t.like}</button></div></div></div></main>}

function Play(){const[,t]=useLang();const{id}=useParams();const[games]=useGames();const game=games.find(g=>String(g.id)===id)||null;const[started,setStarted]=useState(false);useEffect(()=>{if(started){localStorage.setItem("eskadin-stat-sessions",String(Number(localStorage.getItem("eskadin-stat-sessions")||0)+1));const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.play){p.play=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+8))}}},[started]);if(!game)return <main className="page narrow"><Link className="back" to="/games">← {t.back}</Link><div className="form-card"><h2>No hay ningún juego para jugar.</h2><Link className="button button-primary" to="/games">{t.explore}</Link></div></main>;return <main className="page play"><div className="playbar"><Link to={"/games/"+game.id}>← {t.back}</Link><b>{game.title}</b><span>{started?"LIVE":"READY"}</span></div><div className="game-viewport">{started?<div className="play-message"><strong>ESKÅDIN RUNTIME</strong><small>Scene loaded · session active</small></div>:<div className="launch-card"><span>PLAYABLE PREVIEW</span><h2>{game.title}</h2><p>{game.description}</p><button className="button button-primary" onClick={()=>setStarted(true)}>▶ {t.play}</button></div>}</div></main>}

const sceneSeed=[{id:1,type:"wall",name:"Wall 01",x:0,y:0,z:0,rx:0,ry:0,rz:0,s:1},{id:2,type:"cube",name:"Cube 02",x:2,y:0,z:0,rx:0,ry:0,rz:0,s:1},{id:3,type:"light",name:"Light 03",x:0,y:3,z:2,rx:0,ry:0,rz:0,s:1}];

function meshFor(o){
 const material=new THREE.MeshStandardMaterial({color:o.type==="light"?0xffd54a:o.type==="spawn"?0x6aa7ff:o.type==="camera"?0xa78bfa:o.type==="sound"?0xff62b5:0x71809a,roughness:.62,metalness:.18});
 let geometry;
 if(o.type==="wall") geometry=new THREE.BoxGeometry(4,2,.35);
 else if(o.type==="light") geometry=new THREE.SphereGeometry(.42,24,16);
 else if(o.type==="spawn") geometry=new THREE.ConeGeometry(.55,1.2,4);
 else if(o.type==="camera") geometry=new THREE.BoxGeometry(1.1,.7,1.5);
 else if(o.type==="sound") geometry=new THREE.TorusGeometry(.55,.13,12,32);
 else if(o.type==="text") geometry=new THREE.PlaneGeometry(1.8,1);
 else geometry=new THREE.BoxGeometry(1,1,1);
 const mesh=new THREE.Mesh(geometry,material);
 mesh.position.set(o.x,o.y,o.z);
 mesh.rotation.set(THREE.MathUtils.degToRad(o.rx),THREE.MathUtils.degToRad(o.ry),THREE.MathUtils.degToRad(o.rz));
 mesh.scale.setScalar(o.s);
 mesh.userData.objectId=o.id;
 mesh.castShadow=true;
 mesh.receiveShadow=true;
 return mesh;
}

function ThreeViewport({scene,selected,setSelected,tool,grid,upd}){
 const hostRef=useRef(null);
 const selectedRef=useRef(selected);
 const toolRef=useRef(tool);
 const sceneRef=useRef(scene); const transformRef=useRef(null); const objectMapRef=useRef(new Map());
 useEffect(()=>{selectedRef.current=selected},[selected]);
 useEffect(()=>{toolRef.current=tool},[tool]);
 useEffect(()=>{sceneRef.current=scene},[scene]);
 useEffect(()=>{
   const host=hostRef.current;
   if(!host)return;
   const scene3=new THREE.Scene();
   scene3.background=new THREE.Color(0x080b11);
   const camera=new THREE.PerspectiveCamera(55,1,.1,1000);
   camera.position.set(7,6,9);
   const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
   renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
   renderer.shadowMap.enabled=true;
   renderer.shadowMap.type=THREE.PCFSoftShadowMap;
   host.replaceChildren(renderer.domElement);
   renderer.domElement.style.width="100%";
   renderer.domElement.style.height="100%";
   renderer.domElement.style.display="block";
   renderer.domElement.style.touchAction="none";
   const orbit=new OrbitControls(camera,renderer.domElement);
   orbit.enableDamping=true;
   orbit.dampingFactor=.08;
   orbit.target.set(0,0,0);
   orbit.minDistance=2;
   orbit.maxDistance=40;
   const transform=new TransformControls(camera,renderer.domElement); transformRef.current=transform;
   transform.setSize(1.05);
   scene3.add(transform.getHelper());
   const ambient=new THREE.HemisphereLight(0xcfe4ff,0x182030,1.8);
   scene3.add(ambient);
   const sun=new THREE.DirectionalLight(0xffffff,2.2);
   sun.position.set(5,9,6);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene3.add(sun);
   const gridHelper=new THREE.GridHelper(24,24,0x445066,0x202838);
   gridHelper.visible=grid;scene3.add(gridHelper);
   const axes=new THREE.AxesHelper(3.5);scene3.add(axes);
   const ground=new THREE.Mesh(new THREE.PlaneGeometry(24,24),new THREE.MeshStandardMaterial({color:0x0e141d,roughness:1,metalness:0}));
   ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene3.add(ground);
   const objects=[];
   const objectMap=new Map();
   sceneRef.current.forEach(o=>{const m=meshFor(o);scene3.add(m);objects.push(m);objectMap.set(o.id,m)});
   objectMapRef.current=objectMap;
   const raycaster=new THREE.Raycaster();
   const pointer=new THREE.Vector2();
   const pick=(e)=>{
     if(transform.dragging)return;
     const rect=renderer.domElement.getBoundingClientRect();
     pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
     pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
     raycaster.setFromCamera(pointer,camera);
     const hit=raycaster.intersectObjects(objects,false)[0];
     if(hit?.object?.userData?.objectId!=null){setSelected(hit.object.userData.objectId);transform.attach(hit.object)}
   };
   renderer.domElement.addEventListener("pointerdown",pick);
   const sync=()=>{
     const id=transform.object?.userData?.objectId;
     if(id==null)return;
     const m=transform.object;
     upd(id,{x:Number(m.position.x.toFixed(3)),y:Number(m.position.y.toFixed(3)),z:Number(m.position.z.toFixed(3)),rx:Number(THREE.MathUtils.radToDeg(m.rotation.x).toFixed(2)),ry:Number(THREE.MathUtils.radToDeg(m.rotation.y).toFixed(2)),rz:Number(THREE.MathUtils.radToDeg(m.rotation.z).toFixed(2)),s:Number(m.scale.x.toFixed(3))});
   };
   transform.addEventListener("objectChange",sync);
   const selectedObject=objectMap.get(selectedRef.current); if(selectedObject) transform.attach(selectedObject);
   transform.addEventListener("dragging-changed",e=>{orbit.enabled=!e.value});
   const resize=()=>{
     const w=Math.max(host.clientWidth,320),h=Math.max(host.clientHeight,460);
     renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
   };
   const ro=new ResizeObserver(resize);ro.observe(host);resize();
   let raf;
   const animate=()=>{raf=requestAnimationFrame(animate);orbit.update();renderer.render(scene3,camera)};
   animate();
   return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener("pointerdown",pick);transform.removeEventListener("objectChange",sync);transform.dispose();orbit.dispose();renderer.dispose();scene3.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})};
 },[scene.length,grid]);
 useEffect(()=>{const t=transformRef.current;if(t){t.setMode(tool==="rotate"?"rotate":tool==="scale"?"scale":"translate");}},[tool]); useEffect(()=>{scene.forEach(o=>{const m=objectMapRef.current.get(o.id);if(m){m.position.set(o.x,o.y,o.z);m.rotation.set(THREE.MathUtils.degToRad(o.rx),THREE.MathUtils.degToRad(o.ry),THREE.MathUtils.degToRad(o.rz));m.scale.setScalar(o.s)}})},[scene]);
 useEffect(()=>{const t=transformRef.current;if(t){const o=objectMapRef.current.get(selected);if(o)t.attach(o);else t.detach();}},[selected]);
 useEffect(()=>{const c=hostRef.current;if(c){const el=c.querySelector("canvas");if(el)el.style.touchAction="none";}},[grid]);
 useEffect(()=>{
   const canvas=hostRef.current?.querySelector("canvas");
   if(!canvas)return;
   canvas.style.touchAction="none";
 },[]);
 return <div ref={hostRef} className="three-editor-viewport"/>;
}

function Editor(){
 const[,t]=useLang();
 const[scene,setScene]=useState(()=>read("eskadin-scene",sceneSeed));
 const[selected,setSelected]=useState(1);
 const[tool,setTool]=useState("select");
 const[saved,setSaved]=useState(false);
 const[grid,setGrid]=useState(true);
 const obj=scene.find(o=>o.id===selected);
 const upd=(id,patch)=>setScene(s=>s.map(o=>o.id===id?{...o,...patch}:o));
 const add=type=>{const id=Date.now();setScene(s=>[...s,{id,type,name:type+" "+(s.length+1),x:0,y:.5,z:0,rx:0,ry:0,rz:0,s:1}]);setSelected(id)};
 const saveScene=()=>{save("eskadin-scene",scene);save("eskadin-project",{name:"Untitled project",scene,updatedAt:new Date().toISOString()});setSaved(true);setTimeout(()=>setSaved(false),1000)};
 const del=()=>{setScene(s=>s.filter(o=>o.id!==selected));setSelected(null)};
 const dup=()=>obj&&setScene(s=>[...s,{...obj,id:Date.now(),name:obj.name+" copy",x:obj.x+.5,z:obj.z+.5}]);
 return <main className="page editor-page"><div className="page-head"><div><div className="eyebrow">ESKÅDIN CREATOR · WEBGL 3D</div><h1 className="page-title">{t.create}</h1><p>editor 3D real: cámara orbital, selección, gizmos de mover/rotar/escalar, objetos, luces y edición táctil.</p></div><div className="actions"><button className="button button-ghost" onClick={saveScene}>{saved?"✓ "+t.save:t.save}</button><Link className="button button-primary" to="/publish">{t.publish}</Link></div></div>
 <div className="editor-toolbar"><button className={tool==="select"?"active":""} onClick={()=>setTool("select")}>↖ Select</button><button className={tool==="move"?"active":""} onClick={()=>setTool("move")}>✥ Move</button><button className={tool==="rotate"?"active":""} onClick={()=>setTool("rotate")}>↻ Rotate</button><button className={tool==="scale"?"active":""} onClick={()=>setTool("scale")}>⤢ Scale</button><span className="tool-spacer"/><button onClick={()=>setGrid(!grid)}>{grid?"▦ Grid":"□ Grid"}</button><button onClick={dup}>＋ Duplicate</button><button onClick={del}>⌫ Delete</button><button onClick={()=>setScene(sceneSeed)}>↺ Reset</button></div>
 <div className="editor-layout"><aside className="editor-side"><b>{t.objects}</b>{["wall","cube","light","sound","spawn","camera","text"].map(type=><button key={type} onClick={()=>add(type)}>＋ {type}</button>)}<div className="object-list">{scene.map(o=><button className={o.id===selected?"selected":""} onClick={()=>setSelected(o.id)} key={o.id}>{o.name}</button>)}</div></aside>
 <div className="editor-canvas real3d"><div className="viewport-hud"><span>WEBGL VIEWPORT</span><span>one finger = orbit · wheel = zoom · gizmo = transform</span></div><ThreeViewport scene={scene} selected={selected} setSelected={setSelected} tool={tool} grid={grid} upd={upd}/></div>
 <aside className="properties"><b>{t.properties}</b>{obj?<><label>Name<input value={obj.name} onChange={e=>upd(obj.id,{name:e.target.value})}/></label><div className="xyz"><label>X<input type="number" step=".1" value={obj.x} onChange={e=>upd(obj.id,{x:Number(e.target.value)})}/></label><label>Y<input type="number" step=".1" value={obj.y} onChange={e=>upd(obj.id,{y:Number(e.target.value)})}/></label><label>Z<input type="number" step=".1" value={obj.z} onChange={e=>upd(obj.id,{z:Number(e.target.value)})}/></label></div><div className="xyz"><label>RX<input type="number" value={obj.rx} onChange={e=>upd(obj.id,{rx:Number(e.target.value)})}/></label><label>RY<input type="number" value={obj.ry} onChange={e=>upd(obj.id,{ry:Number(e.target.value)})}/></label><label>RZ<input type="number" value={obj.rz} onChange={e=>upd(obj.id,{rz:Number(e.target.value})}/></label></div><label>Scale<input type="number" step=".1" min=".1" value={obj.s} onChange={e=>upd(obj.id,{s:Number(e.target.value)})}/></label></>:<span className="muted">Select an object.</span>}</aside></div><div className="editor-bottom"><span>{scene.length} objects · WebGL · touch/mouse · saved locally</span><Link className="button button-ghost" to="/publish">{t.publish}</Link></div></main>}
function Developer(){const[,t]=useLang();return <main className="page"><div className="eyebrow">{t.developer}</div><h1 className="page-title">Your studio.</h1><div className="dashboard-grid"><Link to="/editor" className="dash"><b>🧱 {t.create}</b><span>Build and preview.</span></Link><Link to="/projects" className="dash"><b>🗂 {t.projects}</b><span>Manage projects.</span></Link><Link to="/publish" className="dash"><b>📤 {t.publish}</b><span>Release a game.</span></Link><Link to="/statistics" className="dash"><b>📊 Statistics</b><span>Visits, likes and sessions.</span></Link></div></main>}

function Publish(){const[,t]=useLang();const[games,setGames]=useGames();const{developer}=useUser();const nav=useNavigate();const[name,setName]=useState("My new game");const[desc,setDesc]=useState("A new Eskådin Stüdis experience.");const[done,setDone]=useState(false);const blocked=blockedIdentity(name);const go=()=>{if(blocked)return;setGames(g=>[...g,{id:Date.now(),title:name,genre:"3D Experience",tag:"New",color:"violet",players:0,likes:0,author:developer?.name||"Eskådin Studio",description:desc}]);setDone(true)};if(!developer)return <main className="page narrow"><div className="form-card"><div className="eyebrow">DEVELOPER</div><h1 className="page-title">Cuenta de desarrollador requerida</h1><p className="muted">Tu cuenta personal sirve para jugar. Para publicar necesitas una cuenta de desarrollador separada.</p><button className="button button-primary" onClick={()=>nav("/developer/register")}>Crear cuenta de desarrollador</button></div></main>;return <main className="page narrow"><div className="eyebrow">{t.publish}</div><h1 className="page-title">{done?t.published:t.publish}</h1>{done?<div className="success-card"><b>✓ {t.publish}</b><p>Your game is now in the local catalog.</p><Link className="button button-primary" to="/games">{t.explore}</Link></div>:<div className="form-card"><label>{t.name}<input value={name} onChange={e=>setName(e.target.value)}/></label>{blocked&&<p className="error">Reserved developer or game name.</p>}<label>{t.description}<textarea value={desc} onChange={e=>setDesc(e.target.value)}/></label><label>Visibility<select><option>Public</option><option>Private</option></select></label><button className="button button-primary" disabled={blocked} onClick={go}>{t.publish} · 0€</button><p className="muted">Real-money payments are blocked. F¢ cannot be purchased or withdrawn.</p></div>}</main>}

function Missions(){const[,t]=useLang();const[balance,setBalance]=useState(()=>Number(localStorage.getItem("eskadin-fc")||0));const[progress,setProgress]=useState(()=>read("eskadin-mission-progress",{play:false,explore:false,like:false}));const ms=[["play","Play an experience",8],["explore","Open an experience page",12],["like","Like an experience",5]];useEffect(()=>{const sync=()=>{setProgress(read("eskadin-mission-progress",{play:false,explore:false,like:false}));setBalance(Number(localStorage.getItem("eskadin-fc")||0))};sync();const id=setInterval(sync,400);return()=>clearInterval(id)},[]);return <main className="page"><div className="eyebrow">{t.missions}</div><h1 className="page-title">F¢ missions</h1><div className="wallet-banner"><b>{balance} F¢</b><span>Earn platform currency by playing.</span><Link to="/wallet">{t.wallet}</Link></div><div className="mission-grid">{ms.map(([id,title,n])=><div className="mission-card" key={id}><span>MISSION</span><h3>{title}</h3><strong>+{n} F¢</strong><Link className="button button-primary" to="/games">{progress[id]?"✓ Completed":"Go do it →"}</Link></div>)}</div></main>}

function Wallet(){const[,t]=useLang();const balance=Number(localStorage.getItem("eskadin-fc")||0);return <main className="page narrow"><div className="eyebrow">{t.wallet}</div><h1 className="page-title">{balance} F¢</h1><div className="form-card"><h2>Platform currency</h2><p className="muted">F¢ can only be earned through platform gameplay missions. It cannot be purchased, withdrawn or converted to real money.</p><Link className="button button-primary" to="/missions">{t.missions}</Link></div></main>}

function Projects(){const project=read("eskadin-project",null);return <main className="page"><div className="eyebrow">PROJECTS</div><h1 className="page-title">Your projects.</h1>{project?<div className="dashboard-grid"><Link className="dash" to="/editor"><b>{project.name}</b><span>Local editable scene · {project.scene?.length||0} objects · {new Date(project.updatedAt).toLocaleString()}</span></Link></div>:<div className="form-card"><h2>No hay proyectos guardados.</h2><p className="muted">Guarda una escena desde el editor y aparecerá aquí.</p><Link className="button button-primary" to="/editor">Abrir editor</Link></div>}</main>}

function Statistics(){const[games]=useGames();const views=Number(localStorage.getItem("eskadin-stat-views")||0);const sessions=Number(localStorage.getItem("eskadin-stat-sessions")||0);const likes=games.reduce((n,g)=>n+Number(g.likes||0),0);return <main className="page"><div className="eyebrow">ANALYTICS</div><h1 className="page-title">Studio analytics.</h1><div className="stats-grid"><div><b>{views.toLocaleString()}</b><span>Game page views</span></div><div><b>{likes.toLocaleString()}</b><span>Likes</span></div><div><b>{sessions.toLocaleString()}</b><span>Play sessions</span></div><div><b>{games.length.toLocaleString()}</b><span>Published games</span></div></div><div className="form-card"><p className="muted">Las estadísticas se basan en actividad real registrada en este dispositivo.</p></div></main>}

function Account(){const[,t]=useLang();const{user,logout}=useUser();return <main className="page narrow"><div className="eyebrow">{t.account}</div><h1 className="page-title">{user?.name||"Eskådin Player"}</h1><div className="form-card"><div className="account-avatar">{(user?.name||"ES").slice(0,2).toUpperCase()}</div><p className="muted">0 published games · 0 sessions · {Number(localStorage.getItem("eskadin-fc")||0)} F¢</p><div className="account-actions"><Link className="button button-ghost" to="/editor">{t.create}</Link><Link className="button button-ghost" to="/wallet">{t.wallet}</Link><Link className="button button-ghost" to="/settings">{t.settings}</Link><Link className="button danger-button" to="/account/delete">{t.delete}</Link></div><button className="button button-ghost" onClick={logout}>{t.logout}</button></div></main>}

function Settings(){const[lang,setLang]=useLang();const t=TXT[lang];return <main className="page narrow"><div className="eyebrow">{t.settings}</div><h1 className="page-title">{t.settings}</h1><div className="form-card"><label>{t.language}<select value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><p className="muted">Language is stored locally on this device.</p></div></main>}

function Login(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.login}</h1><p className="muted">Cuenta personal para jugar, guardar progreso y ganar F¢.</p><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Display name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><button className="button button-primary" onClick={()=>{login({name:name||"Eskådin Player"});nav("/account")}}>{t.login}</button><Link className="muted" to="/register">{t.register}</Link><Link className="muted" to="/developer/register">Crear cuenta de desarrollador →</Link></div></main>}
function Register(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.register}</h1><p className="muted">Cuenta personal. No es una cuenta de desarrollador.</p><label>Username<input value={name} onChange={e=>setName(e.target.value)} placeholder="Player name"/></label><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Confirm password<input type="password"/></label><button className="button button-primary" onClick={()=>{login({name:name||"Eskådin Player"});nav("/account")}}>{t.register}</button><Link className="muted" to="/login">{t.login}</Link><Link className="muted" to="/developer/register">¿Quieres publicar juegos? Crear cuenta de desarrollador →</Link></div></main>}
function DeveloperRegister(){const{devLogin}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">DEVELOPER</div><h1>Crear cuenta de desarrollador</h1><p className="muted">Cuenta separada para crear, publicar y consultar estadísticas. No sustituye tu cuenta personal.</p><label>Nombre del estudio<input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del estudio"/></label><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Confirm password<input type="password"/></label><button className="button button-primary" onClick={()=>{devLogin({name:name||"Eskådin Studio"});nav("/developer/account")}}>Crear cuenta de desarrollador</button><Link className="muted" to="/register">Crear cuenta personal →</Link></div></main>}
function DeveloperAccount(){const{developer,devLogout}=useUser();return <main className="page narrow"><div className="eyebrow">DEVELOPER ACCOUNT</div><h1 className="page-title">{developer?.name||"Eskådin Studio"}</h1><div className="form-card"><p className="muted">Cuenta de creador separada de la cuenta personal.</p><div className="account-actions"><Link className="button button-primary" to="/editor">Abrir editor</Link><Link className="button button-ghost" to="/publish">Publicar</Link><Link className="button button-ghost" to="/statistics">Estadísticas</Link><button className="button danger-button" onClick={()=>{devLogout();location.href="/"}}>Cerrar cuenta de desarrollador</button></div></div></main>}
function DeleteAccount(){const[,t]=useLang();const{logout}=useUser();const nav=useNavigate();const[c,setC]=useState("");return <main className="page narrow auth-page"><div className="form-card danger-card"><div className="eyebrow danger">DANGER ZONE</div><h1>{t.delete}</h1><p className="muted">This clears the local account and session on this device.</p><input value={c} onChange={e=>setC(e.target.value)} placeholder="DELETE"/><button className="button danger-button" disabled={c!=="DELETE"} onClick={()=>{logout();localStorage.removeItem("eskadin-fc");nav("/")}}>{t.delete}</button></div></main>}

function NotFound(){return <main className="page notfound"><h1>404</h1><p>This page escaped the editor.</p><Link className="button button-primary" to="/">Home</Link></main>}

export default function CompleteApp(){return <LangProvider><AuthProvider><Shell><Routes><Route path="/" element={<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:id" element={<Game/>}/><Route path="/games/:id/play" element={<Play/>}/><Route path="/editor" element={<Editor/>}/><Route path="/developer" element={<Developer/>}/><Route path="/projects" element={<Projects/>}/><Route path="/publish" element={<Publish/>}/><Route path="/missions" element={<Missions/>}/><Route path="/wallet" element={<Wallet/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/account" element={<Account/>}/><Route path="/settings" element={<Settings/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/developer/register" element={<DeveloperRegister/>}/><Route path="/developer/account" element={<DeveloperAccount/>}/><Route path="/account/delete" element={<DeleteAccount/>}/><Route path="*" element={<NotFound/>}/></Routes></Shell></AuthProvider></LangProvider>}
