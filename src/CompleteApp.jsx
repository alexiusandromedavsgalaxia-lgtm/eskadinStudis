import {createContext,useContext,useEffect,useMemo,useRef,useState} from "react";
import {Link,NavLink,Route,Routes,useLocation,useNavigate,useParams} from "react-router-dom";
import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {TransformControls} from "three/addons/controls/TransformControls.js";

const LANG={es:"ES",en:"EN",sv:"SV",de:"DE",fr:"FR"};
const TXT={
es:{homeLead:"Crea experiencias 3D, publícalas y juega sin anuncios ni compras con dinero real.",studioTitle:"Una pequeña plataforma de creación que realmente hace cosas.",studioDesc:"Editor, proyectos, publicación, perfiles, misiones F¢, analíticas y previsualizaciones jugables.",sceneEditor:"Editor de escenas",sceneEditorDesc:"Objetos, jerarquía, transformaciones, duplicar, borrar, guardar y previsualizar.",community:"Comunidad",communityDesc:"Publica experiencias, explora juegos, dales Me gusta y juega.",economy:"Economía F¢",economyDesc:"Consigue moneda de la plataforma mediante misiones. Nunca se compra con dinero real.",statisticsShort:"Estadísticas",openEditor:"Abrir editor",languageStored:"El idioma se guarda localmente en este dispositivo.",explore:"Explorar",create:"Crear",developer:"Desarrollador",account:"Cuenta",login:"Iniciar sesión",register:"Crear cuenta",logout:"Cerrar sesión",delete:"Borrar cuenta",publish:"Publicar",save:"Guardar",missions:"Misiones",wallet:"F¢",settings:"Ajustes",projects:"Proyectos",play:"Jugar",like:"Me gusta",back:"Volver",objects:"OBJETOS",properties:"PROPIEDADES",search:"Buscar juegos…",newGame:"Nuevo juego",language:"Idioma",name:"Nombre",description:"Descripción",published:"Publicado",liked:"Me gusta",communityGames:"Juegos de la comunidad",yourStudio:"Tu estudio.",statistics:"Estadísticas",yourProjects:"Tus proyectos.",buildPreview:"Construye y previsualiza.",manageProjects:"Gestiona tus proyectos.",releaseGame:"Publica un juego.",visitsLikesSessions:"Visitas, likes y sesiones.",build:"Construye y previsualiza.",localCatalog:"Tu juego está ahora en el catálogo local.",reservedName:"Nombre de desarrollador o juego reservado.",public:"Público",private:"Privado",selectObject:"Selecciona un objeto.",noProjects:"No hay proyectos guardados.",saveSceneHint:"Guarda una escena desde el editor y aparecerá aquí.",localStats:"Las estadísticas se basan en actividad real registrada en este dispositivo.",developerRequired:"Cuenta de desarrollador requerida",developerRequiredText:"Tu cuenta personal sirve para jugar. Para publicar necesitas una cuenta de desarrollador separada.",createDeveloper:"Crear cuenta de desarrollador",platformCurrency:"Moneda de la plataforma",earnedOnly:"F¢ solo se puede conseguir mediante misiones de juego. No se puede comprar, retirar ni convertir en dinero real."},
en:{homeLead:"Create 3D experiences, publish them and play without ads or real-money purchases.",studioTitle:"A small creator platform that actually does things.",studioDesc:"Editor, projects, publishing, profiles, F¢ missions, analytics and playable previews.",sceneEditor:"Scene editor",sceneEditorDesc:"Objects, hierarchy, transforms, duplicate, delete, save and preview.",community:"Community",communityDesc:"Publish experiences, explore games, like them and play.",economy:"F¢ economy",economyDesc:"Earn platform currency through missions. It is never bought with real money.",statisticsShort:"Statistics",openEditor:"Open editor",languageStored:"Language is stored locally on this device.",explore:"Explore",create:"Create",developer:"Desarrollador",account:"Account",login:"Log in",register:"Create account",logout:"Log out",delete:"Delete account",publish:"Publish",save:"Save",missions:"Missions",wallet:"F¢",settings:"Settings",projects:"Projects",play:"Play",like:"Like",back:"Back",objects:"OBJECTS",properties:"PROPERTIES",search:"Search games…",newGame:"New game",language:"Language",name:"Name",description:"Description",published:"Published",liked:"Liked",communityGames:"Community games",yourStudio:"Your studio.",statistics:"Statistics",yourProjects:"Your projects.",buildPreview:"Build and preview.",manageProjects:"Manage your projects.",releaseGame:"Release a game.",visitsLikesSessions:"Visits, likes and sessions.",build:"Build and preview.",localCatalog:"Your game is now in the local catalog.",reservedName:"Reserved developer or game name.",public:"Public",private:"Private",selectObject:"Select an object.",noProjects:"No saved projects.",saveSceneHint:"Save a scene from the editor and it will appear here.",localStats:"Statistics are based on real activity recorded on this device.",developerRequired:"Developer account required",developerRequiredText:"Your personal account is for playing. You need a separate developer account to publish.",createDeveloper:"Create developer account",platformCurrency:"Platform currency",earnedOnly:"F¢ can only be earned through gameplay missions. It cannot be purchased, withdrawn or converted to real money."},
sv:{transform:"TRANSFORM",color:"Färg",roughness:"Grovhet",metalness:"Metalliskhet",homeLead:"Skapa 3D-upplevelser, publicera dem och spela utan annonser eller köp med riktiga pengar.",studioTitle:"En liten plattform för skapare som faktiskt gör saker.",studioDesc:"Editor, projekt, publicering, profiler, F¢-uppdrag, analys och spelbara förhandsvisningar.",sceneEditor:"Sceneditor",sceneEditorDesc:"Objekt, hierarki, transformeringar, duplicera, ta bort, spara och förhandsvisa.",community:"Gemenskap",communityDesc:"Publicera upplevelser, bläddra bland spel, gilla och spela.",economy:"F¢-ekonomi",economyDesc:"Tjäna plattformsvaluta genom uppdrag. Köp den aldrig med riktiga pengar.",statisticsShort:"Statistik",openEditor:"Öppna editor",languageStored:"Språket sparas lokalt på den här enheten.",explore:"Utforska",create:"Skapa",developer:"Utvecklare",account:"Konto",login:"Logga in",register:"Skapa konto",logout:"Logga ut",delete:"Ta bort konto",publish:"Publicera",save:"Spara",missions:"Uppdrag",wallet:"F¢",settings:"Inställningar",projects:"Projekt",play:"Spela",like:"Gilla",back:"Tillbaka",objects:"OBJEKT",properties:"EGENSKAPER",search:"Sök spel…",newGame:"Nytt spel",language:"Språk",name:"Namn",description:"Beskrivning",published:"Publicerad",liked:"Gillad",communityGames:"Spel från communityn",yourStudio:"Din studio.",statistics:"Statistik",yourProjects:"Dina projekt.",buildPreview:"Bygg och förhandsvisa.",manageProjects:"Hantera dina projekt.",releaseGame:"Publicera ett spel.",visitsLikesSessions:"Besök, gilla-markeringar och sessioner.",build:"Bygg och förhandsvisa.",localCatalog:"Ditt spel finns nu i den lokala katalogen.",reservedName:"Reserverat utvecklar- eller spelnamn.",public:"Offentlig",private:"Privat",selectObject:"Välj ett objekt.",noProjects:"Inga sparade projekt.",saveSceneHint:"Spara en scen i editorn så visas den här.",localStats:"Statistiken baseras på verklig aktivitet på den här enheten.",developerRequired:"Utvecklarkonto krävs",developerRequiredText:"Ditt personliga konto används för att spela. Du behöver ett separat utvecklarkonto för att publicera.",createDeveloper:"Skapa utvecklarkonto",platformCurrency:"Plattformsvaluta",earnedOnly:"F¢ kan bara tjänas genom speluppdrag. Det kan inte köpas, tas ut eller växlas till riktiga pengar."},
de:{transform:"TRANSFORM",color:"Farbe",roughness:"Rauheit",metalness:"Metallizität",homeLead:"Erstelle 3D-Erlebnisse, veröffentliche sie und spiele ohne Werbung oder Käufe mit echtem Geld.",studioTitle:"Eine kleine Creator-Plattform, die tatsächlich etwas kann.",studioDesc:"Editor, Projekte, Veröffentlichung, Profile, F¢-Missionen, Analysen und spielbare Vorschauen.",sceneEditor:"Szenen-Editor",sceneEditorDesc:"Objekte, Hierarchie, Transformationen, Duplizieren, Löschen, Speichern und Vorschau.",community:"Community",communityDesc:"Erlebnisse veröffentlichen, Spiele durchsuchen, liken und spielen.",economy:"F¢-Wirtschaft",economyDesc:"Verdiene Plattformwährung durch Missionen. Kaufe sie niemals mit echtem Geld.",statisticsShort:"Statistiken",openEditor:"Editor öffnen",languageStored:"Die Sprache wird lokal auf diesem Gerät gespeichert.",explore:"Entdecken",create:"Erstellen",developer:"Entwickler",account:"Konto",login:"Anmelden",register:"Konto erstellen",logout:"Abmelden",delete:"Konto löschen",publish:"Veröffentlichen",save:"Speichern",missions:"Missionen",wallet:"F¢",settings:"Einstellungen",projects:"Projekte",play:"Spielen",like:"Gefällt mir",back:"Zurück",objects:"OBJEKTE",properties:"EIGENSCHAFTEN",search:"Spiele suchen…",newGame:"Neues Spiel",language:"Sprache",name:"Name",description:"Beschreibung",published:"Veröffentlicht",liked:"Gefällt mir",communityGames:"Community-Spiele",yourStudio:"Dein Studio.",statistics:"Statistiken",yourProjects:"Deine Projekte.",buildPreview:"Erstellen und Vorschau.",manageProjects:"Verwalte deine Projekte.",releaseGame:"Spiel veröffentlichen.",visitsLikesSessions:"Besuche, Likes und Sitzungen.",build:"Erstellen und Vorschau.",localCatalog:"Dein Spiel ist jetzt im lokalen Katalog.",reservedName:"Reservierter Entwickler- oder Spielname.",public:"Öffentlich",private:"Privat",selectObject:"Objekt auswählen.",noProjects:"Keine gespeicherten Projekte.",saveSceneHint:"Speichere eine Szene im Editor, damit sie hier erscheint.",localStats:"Die Statistiken basieren auf echter Aktivität auf diesem Gerät.",developerRequired:"Entwicklerkonto erforderlich",developerRequiredText:"Dein persönliches Konto ist zum Spielen. Zum Veröffentlichen brauchst du ein separates Entwicklerkonto.",createDeveloper:"Entwicklerkonto erstellen",platformCurrency:"Plattformwährung",earnedOnly:"F¢ kann nur durch Spielmissionen verdient werden. Es kann nicht gekauft, ausgezahlt oder in echtes Geld umgewandelt werden."},
fr:{transform:"TRANSFORM",color:"Couleur",roughness:"Rugosité",metalness:"Métallique",homeLead:"Crée des expériences 3D, publie-les et joue sans publicités ni achats avec de l’argent réel.",studioTitle:"Une petite plateforme de création qui fait vraiment des choses.",studioDesc:"Éditeur, projets, publication, profils, missions F¢, statistiques et aperçus jouables.",sceneEditor:"Éditeur de scènes",sceneEditorDesc:"Objets, hiérarchie, transformations, duplication, suppression, sauvegarde et aperçu.",community:"Communauté",communityDesc:"Publie des expériences, découvre des jeux, aime-les et joue.",economy:"Économie F¢",economyDesc:"Gagne de la monnaie de plateforme grâce aux missions. Aucun achat avec de l’argent réel.",statisticsShort:"Statistiques",openEditor:"Ouvrir l’éditeur",languageStored:"La langue est enregistrée localement sur cet appareil.",explore:"Explorer",create:"Créer",developer:"Développeur",account:"Compte",login:"Connexion",register:"Créer un compte",logout:"Déconnexion",delete:"Supprimer le compte",publish:"Publier",save:"Enregistrer",missions:"Missions",wallet:"F¢",settings:"Réglages",projects:"Projets",play:"Jouer",like:"J'aime",back:"Retour",objects:"OBJETS",properties:"PROPRIÉTÉS",search:"Rechercher des jeux…",newGame:"Nouveau jeu",language:"Langue",name:"Nom",description:"Description",published:"Publié",liked:"Aimé",communityGames:"Jeux de la communauté",yourStudio:"Ton studio.",statistics:"Statistiques",yourProjects:"Tes projets.",buildPreview:"Créer et prévisualiser.",manageProjects:"Gérer tes projets.",releaseGame:"Publier un jeu.",visitsLikesSessions:"Visites, likes et sessions.",build:"Créer et prévisualiser.",localCatalog:"Ton jeu est maintenant dans le catalogue local.",reservedName:"Nom de développeur ou de jeu réservé.",public:"Public",private:"Privé",selectObject:"Sélectionne un objet.",noProjects:"Aucun projet enregistré.",saveSceneHint:"Enregistre une scène dans l’éditeur pour qu’elle apparaisse ici.",localStats:"Les statistiques reposent sur l’activité réelle enregistrée sur cet appareil.",developerRequired:"Compte développeur requis",developerRequiredText:"Ton compte personnel sert à jouer. Pour publier, tu as besoin d’un compte développeur séparé.",createDeveloper:"Créer un compte développeur",platformCurrency:"Monnaie de la plateforme",earnedOnly:"Les F¢ ne peuvent être gagnés que via les missions de jeu. Ils ne peuvent pas être achetés, retirés ou convertis en argent réel."}};
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

function useLang(){const{lang,setLang}=useContext(LangContext);return[lang,{...TXT[lang],...EXTRA_T[lang]}]}
const EXTRA_T={es:{transform:"TRANSFORM",color:"Color",roughness:"Rugosidad",metalness:"Metalidad",add:"Añadir",hierarchy:"Jerarquía",assets:"Recursos",scene:"Escena",selectTool:"Seleccionar",move:"Mover",rotate:"Rotar",scale:"Escalar",grid:"Cuadrícula",snap:"Ajuste",wireframe:"Estructura",axes:"Ejes",duplicate:"Duplicar",deleteObject:"Borrar",reset:"Restablecer",fullscreen:"Pantalla completa",inspector:"Inspector",primitives:"PRIMITIVAS",sceneObjects:"OBJETOS DE ESCENA",material:"MATERIAL",quickActions:"ACCIONES RÁPIDAS",resetTransform:"Restablecer transformación",deleteObjectFull:"Borrar objeto",createTab:"CREAR",sceneTab:"ESCENA",view:"VISTA",local:"LOCAL",objectsCount:"OBJETOS",viewport:"VISTA 3D · WEBGL",orbit:"Orbitar: arrastrar · Zoom: rueda/pellizcar · Gizmo: transformar",webgl:"WebGL 2",shadows:"Sombras",touch:"Táctil",solid:"Sólido",wire:"Estructura",snapOn:"Ajuste ACTIVADO",snapOff:"Ajuste DESACTIVADO",sceneStats:"ESCÅDIN 3D STUDIO · {n} objetos · proyecto local",shortcuts:"Ctrl+S Guardar · Q Seleccionar · W Mover · E Rotar · R Escalar · Supr Borrar"},en:{transform:"TRANSFORM",color:"Color",roughness:"Roughness",metalness:"Metalness",add:"Add",hierarchy:"Hierarchy",assets:"Assets",scene:"Scene",selectTool:"Select",move:"Move",rotate:"Rotate",scale:"Scale",grid:"Grid",snap:"Snap",wireframe:"Wireframe",axes:"Axes",duplicate:"Duplicate",deleteObject:"Delete",reset:"Reset",fullscreen:"Fullscreen",inspector:"Inspector",primitives:"PRIMITIVES",sceneObjects:"SCENE OBJECTS",material:"MATERIAL",quickActions:"QUICK ACTIONS",resetTransform:"Reset transform",deleteObjectFull:"Delete object",createTab:"CREATE",sceneTab:"SCENE",view:"VIEW",local:"LOCAL",objectsCount:"OBJECTS",viewport:"3D VIEWPORT · WEBGL",orbit:"Orbit: drag · Zoom: wheel/pinch · Gizmo: transform",webgl:"WebGL 2",shadows:"Shadows",touch:"Touch",solid:"Solid",wire:"Wireframe",snapOn:"Snap ON",snapOff:"Snap OFF",sceneStats:"ESCÅDIN 3D STUDIO · {n} objects · local project",shortcuts:"Ctrl+S Save · Q Select · W Move · E Rotate · R Scale · Del Delete"},sv:{add:"Lägg till",hierarchy:"Hierarki",assets:"Resurser",scene:"Scen",selectTool:"Välj",move:"Flytta",rotate:"Rotera",scale:"Skala",grid:"Rutnät",snap:"Fäst",wireframe:"Trådram",axes:"Axlar",duplicate:"Duplicera",deleteObject:"Ta bort",reset:"Återställ",fullscreen:"Helskärm",inspector:"Inspektör",primitives:"PRIMITIVER",sceneObjects:"SCENOBJEKT",material:"MATERIAL",quickActions:"SNABBÅTGÄRDER",resetTransform:"Återställ transform",deleteObjectFull:"Ta bort objekt",createTab:"SKAPA",sceneTab:"SCEN",view:"VY",local:"LOKALT",objectsCount:"OBJEKT",viewport:"3D-VY · WEBGL",orbit:"Rotera: dra · Zooma: hjul/nyp · Gizmo: transformera",webgl:"WebGL 2",shadows:"Skuggor",touch:"Pekskärm",solid:"Solid",wire:"Trådram",snapOn:"Fäst PÅ",snapOff:"Fäst AV",sceneStats:"ESCÅDIN 3D STUDIO · {n} objekt · lokalt projekt",shortcuts:"Ctrl+S Spara · Q Välj · W Flytta · E Rotera · R Skala · Del Ta bort"},de:{add:"Hinzufügen",hierarchy:"Hierarchie",assets:"Assets",scene:"Szene",selectTool:"Auswählen",move:"Verschieben",rotate:"Drehen",scale:"Skalieren",grid:"Raster",snap:"Einrasten",wireframe:"Drahtmodell",axes:"Achsen",duplicate:"Duplizieren",deleteObject:"Löschen",reset:"Zurücksetzen",fullscreen:"Vollbild",inspector:"Inspektor",primitives:"PRIMITIVEN",sceneObjects:"SZENENOBJEKTE",material:"MATERIAL",quickActions:"SCHNELLAKTIONEN",resetTransform:"Transformation zurücksetzen",deleteObjectFull:"Objekt löschen",createTab:"ERSTELLEN",sceneTab:"SZENE",view:"ANSICHT",local:"LOKAL",objectsCount:"OBJEKTE",viewport:"3D-ANSICHT · WEBGL",orbit:"Orbit: ziehen · Zoom: Rad/Pinch · Gizmo: transformieren",webgl:"WebGL 2",shadows:"Schatten",touch:"Touch",solid:"Voll",wire:"Drahtmodell",snapOn:"Einrasten AN",snapOff:"Einrasten AUS",sceneStats:"ESCÅDIN 3D STUDIO · {n} Objekte · lokales Projekt",shortcuts:"Strg+S Speichern · Q Auswählen · W Verschieben · E Drehen · R Skalieren · Entf Löschen"},fr:{add:"Ajouter",hierarchy:"Hiérarchie",assets:"Ressources",scene:"Scène",selectTool:"Sélectionner",move:"Déplacer",rotate:"Tourner",scale:"Échelle",grid:"Grille",snap:"Accrochage",wireframe:"Fil de fer",axes:"Axes",duplicate:"Dupliquer",deleteObject:"Supprimer",reset:"Réinitialiser",fullscreen:"Plein écran",inspector:"Inspecteur",primitives:"PRIMITIVES",sceneObjects:"OBJETS DE SCÈNE",material:"MATÉRIAU",quickActions:"ACTIONS RAPIDES",resetTransform:"Réinitialiser la transformation",deleteObjectFull:"Supprimer l’objet",createTab:"CRÉER",sceneTab:"SCÈNE",view:"VUE",local:"LOCAL",objectsCount:"OBJETS",viewport:"VUE 3D · WEBGL",orbit:"Orbite : glisser · Zoom : molette/pincer · Gizmo : transformer",webgl:"WebGL 2",shadows:"Ombres",touch:"Tactile",solid:"Solide",wire:"Fil de fer",snapOn:"Accrochage ACTIVÉ",snapOff:"Accrochage DÉSACTIVÉ",sceneStats:"ESCÅDIN 3D STUDIO · {n} objets · projet local",shortcuts:"Ctrl+S Enregistrer · Q Sélectionner · W Déplacer · E Tourner · R Échelle · Suppr Supprimer"}};
const LangContext=createContext(null);
function LangProvider({children}){const[lang,setLangState]=useState(()=>localStorage.getItem("eskadin-lang")||"es");const setLang=v=>{setLangState(v);localStorage.setItem("eskadin-lang",v)};return <LangContext.Provider value={{lang,setLang}}>{children}</LangContext.Provider>}
const AuthContext=createContext(null);
function useUser(){return useContext(AuthContext)}
function AuthProvider({children}){const[user,setUser]=useState(()=>read("eskadin-user",null));const[developer,setDeveloper]=useState(()=>read("eskadin-developer",null));const login=u=>{setUser(u);save("eskadin-user",u)};const logout=()=>{setUser(null);localStorage.removeItem("eskadin-user")};const devLogin=u=>{setDeveloper(u);save("eskadin-developer",u)};const devLogout=()=>{setDeveloper(null);localStorage.removeItem("eskadin-developer")};return <AuthContext.Provider value={{user,developer,login,logout,devLogin,devLogout}}>{children}</AuthContext.Provider>}
function useGames(){const[games,setGames]=useState(()=>{if(localStorage.getItem("eskadin-games-version")!==CATALOG_VERSION){localStorage.setItem("eskadin-games-version",CATALOG_VERSION);localStorage.removeItem("eskadin-games");return seed}return read("eskadin-games",seed)});useEffect(()=>save("eskadin-games",games),[games]);return[games,setGames]}

function Shell({children}){const[lang,setLang]=useLang();const t=TXT[lang];const{user,developer}=useUser();const location=useLocation();const[menuOpen,setMenuOpen]=useState(false);useEffect(()=>setMenuOpen(false),[location.pathname]);if(location.pathname==="/editor")return <div className="app-shell studio-app">{children}</div>;return <div className="app-shell"><div className="wrap"><header className="nav"><Link className="brand" to="/">Esk<span>å</span>din St<span>ü</span>dis<sup>®</sup></Link><button type="button" className="global-menu-button" aria-label="Menu" aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?"×":"☰"}</button></header>{menuOpen&&<button type="button" className="global-sidebar-backdrop" aria-label="Close menu" onClick={()=>setMenuOpen(false)}/>}<aside className={"global-sidebar "+(menuOpen?"open":"")} aria-hidden={!menuOpen}><nav className="global-sidebar-links"><NavLink to="/games" onClick={()=>setMenuOpen(false)}>{t.explore}</NavLink><NavLink to="/editor" onClick={()=>setMenuOpen(false)}>{t.create}</NavLink><NavLink to="/missions" onClick={()=>setMenuOpen(false)}>{t.missions}</NavLink><NavLink to="/developer" onClick={()=>setMenuOpen(false)}>{t.developer}</NavLink></nav><div className="global-sidebar-section">{t.language}</div><select className="lang global-sidebar-lang" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><div className="global-sidebar-account">{developer?<Link className="avatar-link dev-avatar" to="/developer/account" onClick={()=>setMenuOpen(false)}>DEV</Link>:user?<Link className="account-menu-link" to="/account" onClick={()=>setMenuOpen(false)}>{user.name.slice(0,2).toUpperCase()} · {user.name}</Link>:<><Link className="button button-ghost small" to="/register" onClick={()=>setMenuOpen(false)}>{t.register}</Link><Link className="button button-primary small" to="/login" onClick={()=>setMenuOpen(false)}>{t.login}</Link></>}</div></aside>{children}<footer className="footer"><span>© 2026 Eskådin Stüdis®</span><span>0 ads · 0 real-money purchases · F¢ gameplay-only</span></footer></div></div>}
function Home(){const[,t]=useLang();return <main><section className="hero"><div className="hero-grid"><div className="hero-copy"><div className="pill">ESKÅDIN STÜDIS® · CREATOR PLATFORM</div><h1><span>{t.create}.</span><span className="gradient">{t.publish}.</span><span>{t.play}.</span></h1><p className="lead">{t.homeLead}</p><div className="actions"><Link className="button button-primary" to="/editor">{t.create}</Link><Link className="button button-ghost" to="/games">{t.explore}</Link></div></div><div className="hero-device"><div className="device-top"><b>eskadin://studio</b><span>LIVE</span></div><div className="device-scene"><div className="scene-orb"/><div className="scene-building"/><div className="scene-floor"/></div><div className="device-bottom"><span>SCENE</span><span>OBJECTS · 3</span><span>PREVIEW</span></div></div></div></section><section className="section"><div className="section-head"><div className="eyebrow">STUDIO</div><h2>{t.studioTitle}</h2><p>{t.studioDesc}</p></div><div className="feature-grid"><article className="card"><div className="icon">01</div><h3>{t.sceneEditor}</h3><p>{t.sceneEditorDesc}</p></article><article className="card"><div className="icon">02</div><h3>{t.community}</h3><p>{t.communityDesc}</p></article><article className="card"><div className="icon">03</div><h3>{t.economy}</h3><p>{t.economyDesc}</p></article></div></section></main>}

function Games(){const[,t]=useLang();const[games]=useGames();const[q,setQ]=useState("");const filtered=useMemo(()=>games.filter(g=>(g.title+" "+g.genre+" "+g.author).toLowerCase().includes(q.toLowerCase())),[games,q]);return <main className="page"><div className="page-head"><div><div className="eyebrow">{t.explore}</div><h1 className="page-title">{t.communityGames}</h1></div><Link className="button button-primary" to="/editor">{t.newGame}</Link></div><div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><div className="games-grid">{filtered.map(g=><Link className="game-card" to={"/games/"+g.id} key={g.id}><div className={"game-cover "+g.color}><span>{g.tag}</span></div><div className="game-info"><h3>{g.title}</h3><p>{g.genre} · {g.author}</p><b>♥ {g.likes.toLocaleString()} · {g.players.toLocaleString()} online</b></div></Link>)}</div></main>}

function Game(){const[,t]=useLang();const{id}=useParams();const[games,setGames]=useGames();const game=games.find(g=>String(g.id)===id)||null;const[liked,setLiked]=useState(false);useEffect(()=>{if(game){const viewKey="eskadin-viewed-"+game.id;if(!sessionStorage.getItem(viewKey)){sessionStorage.setItem(viewKey,"1");localStorage.setItem("eskadin-stat-views",String(Number(localStorage.getItem("eskadin-stat-views")||0)+1))}const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.explore){p.explore=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+12))}}},[id]);if(!game)return <main className="page narrow"><Link className="back" to="/games">← {t.back}</Link><div className="form-card"><h2>No hay juegos publicados todavía.</h2><p className="muted">Publica una experiencia desde una cuenta de desarrollador para poder explorarla.</p><Link className="button button-primary" to="/developer/register">{t.createDeveloper}</Link></div></main>;const toggleLike=()=>{if(liked){setLiked(false);setGames(gs=>gs.map(g=>String(g.id)===String(game.id)?{...g,likes:Math.max(0,Number(g.likes||0)-1)}:g));return}setLiked(true);setGames(gs=>gs.map(g=>String(g.id)===String(game.id)?{...g,likes:Number(g.likes||0)+1}:g));const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.like){p.like=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+5))}};return <main className="page"><Link className="back" to="/games">← {t.back}</Link><div className="game-hero"><div className={"game-cover big "+game.color}><span>{game.title}</span></div><div><div className="eyebrow">{game.tag} · {game.author}</div><h1 className="page-title">{game.title}</h1><p>{game.description}</p><p className="muted">{game.genre} · {game.players.toLocaleString()} playing · {Number(game.likes||0).toLocaleString()} likes</p><div className="actions"><Link className="button button-primary" to={"/games/"+game.id+"/play"}>▶ {t.play}</Link><button className="button button-ghost" onClick={toggleLike}>{liked?"♥":"♡"} {liked?t.liked:t.like}</button></div></div></div></main>}
function GameRuntime({game,onExit,onRestart}){
 const hostRef=useRef(null);
 const runtimeRef=useRef(null);
 const stickRef=useRef(null);
 const knobRef=useRef(null);
 const keysRef=useRef({});
 const touchRef=useRef({x:0,z:0,active:false,id:null});
 const lookRef=useRef({active:false,id:null,lastX:0,lastY:0});
 const jumpRef=useRef(false);
 const pausedRef=useRef(false);
 useEffect(()=>{
  const host=hostRef.current;if(!host)return;
  const runtime=runtimeRef.current;
  const scene3=new THREE.Scene();
  scene3.background=new THREE.Color(0x101722);
  scene3.fog=new THREE.Fog(0x101722,18,70);
  const camera=new THREE.PerspectiveCamera(70,1,.05,120);
  const renderer=new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText="width:100%;height:100%;display:block;touch-action:none";
  host.replaceChildren(renderer.domElement);

  scene3.add(new THREE.HemisphereLight(0xd9ecff,0x17202e,1.8));
  const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(8,14,6);sun.castShadow=true;scene3.add(sun);

  const project=read("eskadin-project",null);
  const source=Array.isArray(project?.scene)&&project.scene.length?project.scene:[];
  const world=[];
  source.forEach(o=>{const m=meshFor(o);m.userData.runtimeType=o.type;scene3.add(m);world.push(m)});
  // The Studio viewport has a ground plane exactly at Y=0. Keep the gameplay floor on the same coordinate.
  const runtimeGround=new THREE.Mesh(
   new THREE.BoxGeometry(36,.2,36),
   new THREE.MeshStandardMaterial({color:0x273242,roughness:.9})
  );
  runtimeGround.position.y=-.1;
  runtimeGround.receiveShadow=true;
  runtimeGround.userData.runtimeType="runtime-ground";
  scene3.add(runtimeGround);
  world.push(runtimeGround);
  if(!source.length){
   for(let i=0;i<8;i++){
    const box=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshStandardMaterial({color:0x53657d,roughness:.7}));
    box.position.set((i%4)*4-6,1,Math.floor(i/4)*-4-5);box.castShadow=true;box.receiveShadow=true;scene3.add(box);world.push(box);
   }
  }
  const playerRadius=.32;
  const playerHeight=1.9;
  const stepHeight=.42;
  const colliders=world.filter(m=>!["light","camera","spawn","sound","text"].includes(m.userData.runtimeType));
  const colliderBoxes=colliders.map(m=>{const box=new THREE.Box3().setFromObject(m);return {mesh:m,box}});
  let floorY=0;
  for(const c of colliderBoxes){
   const type=c.mesh.userData.runtimeType;
   if(type==="floor"||type==="plane"||type==="runtime-ground"){
    floorY=Math.max(floorY,c.box.max.y);
   }
  }
  const fallbackFloor=source.length?0:0;

  const player=new THREE.Group();
  const body=new THREE.Mesh(new THREE.CapsuleGeometry(playerRadius,playerHeight-2*playerRadius,10,18),new THREE.MeshStandardMaterial({color:0xb8ff5a,roughness:.6}));
  body.position.y=playerHeight*.5;body.castShadow=true;player.add(body);
  player.position.set(0,floorY,4);scene3.add(player);

  const velocity=new THREE.Vector3();
  const playerBox=new THREE.Box3();
  const testBox=new THREE.Box3();
  const horizontalCollides=(x,z,y)=>{
   const halfHeight=playerHeight*.5;
   testBox.min.set(x-playerRadius,y,testBox.min.z);
   testBox.max.set(x+playerRadius,y+playerHeight,testBox.max.z);
   for(const c of colliderBoxes){
    const b=c.box;
    if(b.max.y<=y+.02||b.min.y>=y+playerHeight-.02)continue;
    const closestX=Math.max(b.min.x,Math.min(x,b.max.x));
    const closestZ=Math.max(b.min.z,Math.min(z,b.max.z));
    const dx=x-closestX,dz=z-closestZ;
    if(dx*dx+dz*dz<playerRadius*playerRadius)return true;
   }
   return false;
  };
  const resolveHorizontal=(nextX,nextZ)=>{
   let x=player.position.x,z=player.position.z;
   let stepped=false;
   const baseY=player.position.y;
   if(!horizontalCollides(nextX,z,baseY))x=nextX;
   else if(velocity.y<=.05&&
           !horizontalCollides(nextX,z,baseY+stepHeight)){
    x=nextX;
    player.position.y=baseY+stepHeight;
    stepped=true;
   }
   if(!horizontalCollides(x,nextZ,player.position.y))z=nextZ;
   else if(!stepped&&velocity.y<=.05&&
           !horizontalCollides(x,nextZ,baseY+stepHeight)){
    z=nextZ;
    player.position.y=baseY+stepHeight;
   }
   return {x,z};
  };
  const forward=new THREE.Vector3(),right=new THREE.Vector3(),move=new THREE.Vector3();
  let yaw=0,pitch=-.18,last=performance.now(),raf=0;
  const keydown=e=>{if(["INPUT","TEXTAREA","SELECT"].includes(e.target?.tagName))return;keysRef.current[e.code]=true;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault()};
  const keyup=e=>{keysRef.current[e.code]=false};
  window.addEventListener("keydown",keydown);window.addEventListener("keyup",keyup);

  const pointerDown=e=>{if(e.pointerType==="mouse"){lookRef.current={active:true,id:e.pointerId,lastX:e.clientX,lastY:e.clientY};renderer.domElement.setPointerCapture?.(e.pointerId)}};
  const pointerMove=e=>{
   if(!lookRef.current.active||e.pointerId!==lookRef.current.id)return;
   const dx=e.clientX-lookRef.current.lastX,dy=e.clientY-lookRef.current.lastY;
   lookRef.current.lastX=e.clientX;lookRef.current.lastY=e.clientY;
   yaw-=dx*.004;pitch=Math.max(-1.2,Math.min(.65,pitch-dy*.003));
  };
  const pointerUp=e=>{if(e.pointerType==="mouse")lookRef.current.active=false};
  renderer.domElement.addEventListener("pointerdown",pointerDown);
  renderer.domElement.addEventListener("pointermove",pointerMove);
  renderer.domElement.addEventListener("pointerup",pointerUp);
  renderer.domElement.addEventListener("pointercancel",pointerUp);

  const updateStick=e=>{
   const base=stickRef.current;if(!base)return;
   const r=base.getBoundingClientRect();
   const radius=Math.min(r.width,r.height)*.5;
   const max=radius*.62;
   const dx=e.clientX-(r.left+r.width*.5),dy=e.clientY-(r.top+r.height*.5);
   const len=Math.hypot(dx,dy),scale=len>max?max/len:1;
   const x=dx*scale/max,z=dy*scale/max;
   touchRef.current.x=Math.max(-1,Math.min(1,x));
   touchRef.current.z=Math.max(-1,Math.min(1,z));
   if(knobRef.current)knobRef.current.style.transform=`translate3d(${dx*scale}px,${dy*scale}px,0)`;
  };
  const resetStick=()=>{
   touchRef.current.x=0;touchRef.current.z=0;touchRef.current.active=false;touchRef.current.id=null;
   if(knobRef.current)knobRef.current.style.transform="translate3d(0,0,0)";
  };
  const stickDown=e=>{
   if(e.pointerType==="mouse")return;
   e.preventDefault();touchRef.current.active=true;touchRef.current.id=e.pointerId;
   stickRef.current?.setPointerCapture?.(e.pointerId);updateStick(e);
  };
  const stickMove=e=>{if(touchRef.current.active&&e.pointerId===touchRef.current.id){e.preventDefault();updateStick(e)}};
  const stickUp=e=>{if(e.pointerId===touchRef.current.id)resetStick()};
  stickRef.current?.addEventListener("pointerdown",stickDown);
  stickRef.current?.addEventListener("pointermove",stickMove);
  stickRef.current?.addEventListener("pointerup",stickUp);
  stickRef.current?.addEventListener("pointercancel",stickUp);

  const lookZone=runtime?.querySelector("[data-look]");
  const lookDown=e=>{
   if(e.pointerType==="mouse")return;
   e.preventDefault();lookRef.current={active:true,id:e.pointerId,lastX:e.clientX,lastY:e.clientY};
   lookZone?.setPointerCapture?.(e.pointerId);
  };
  const lookMove=e=>{
   if(!lookRef.current.active||e.pointerId!==lookRef.current.id)return;
   e.preventDefault();
   const dx=e.clientX-lookRef.current.lastX,dy=e.clientY-lookRef.current.lastY;
   lookRef.current.lastX=e.clientX;lookRef.current.lastY=e.clientY;
   yaw-=dx*.006;pitch=Math.max(-1.2,Math.min(.65,pitch-dy*.004));
  };
  const lookUp=e=>{if(e.pointerId===lookRef.current.id)lookRef.current.active=false};
  lookZone?.addEventListener("pointerdown",lookDown);
  lookZone?.addEventListener("pointermove",lookMove);
  lookZone?.addEventListener("pointerup",lookUp);
  lookZone?.addEventListener("pointercancel",lookUp);

  const onJump=e=>{e.preventDefault();jumpRef.current=true};
  const jumpButton=runtime?.querySelector("[data-jump]");
  jumpButton?.addEventListener("pointerdown",onJump);

  const resize=()=>{const w=Math.max(320,host.clientWidth),h=Math.max(320,host.clientHeight);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};
  const ro=new ResizeObserver(resize);ro.observe(host);resize();

  const animate=now=>{
   raf=requestAnimationFrame(animate);
   const dt=Math.min(.033,(now-last)/1000);last=now;
   if(pausedRef.current){renderer.render(scene3,camera);return}
   const k=keysRef.current;
   const mx=Math.max(-1,Math.min(1,(k.KeyD?1:0)-(k.KeyA?1:0)+touchRef.current.x));
   const mz=Math.max(-1,Math.min(1,(k.KeyS?1:0)-(k.KeyW?1:0)+touchRef.current.z));
   move.set(mx,0,mz);if(move.lengthSq()>1)move.normalize();
   forward.set(Math.sin(yaw),0,Math.cos(yaw));right.set(Math.cos(yaw),0,-Math.sin(yaw));
   const dir=new THREE.Vector3().addScaledVector(right,move.x).addScaledVector(forward,move.z);
   const speed=k.ShiftLeft||k.ShiftRight?6.5:4.2;
   const nextX=player.position.x+dir.x*speed*dt;
   const nextZ=player.position.z+dir.z*speed*dt;
   const resolved=resolveHorizontal(nextX,nextZ);
   player.position.x=resolved.x;player.position.z=resolved.z;

   velocity.y-=22*dt;
   const previousY=player.position.y;
   player.position.y+=velocity.y*dt;

   let supportY=floorY;
   const feet=player.position.y;
   for(const c of colliderBoxes){
    const b=c.box;
    const type=c.mesh.userData.runtimeType;
    if(type==="light"||type==="camera"||type==="spawn"||type==="sound"||type==="text")continue;
    const insideX=player.position.x>=b.min.x-playerRadius&&player.position.x<=b.max.x+playerRadius;
    const insideZ=player.position.z>=b.min.z-playerRadius&&player.position.z<=b.max.z+playerRadius;
    if(insideX&&insideZ&&previousY>=b.max.y-playerHeight-.08&&feet<=b.max.y+.15){
     supportY=Math.max(supportY,b.max.y);
    }
   }
   const grounded=player.position.y<=supportY+.015&&velocity.y<=0;
   if(grounded){player.position.y=supportY;velocity.y=0}
   if((k.Space||k.KeyZ||jumpRef.current)&&grounded){velocity.y=7.2;jumpRef.current=false}
   player.rotation.y=yaw;
   camera.position.set(player.position.x,player.position.y+1.62,player.position.z);
   camera.rotation.order="YXZ";camera.rotation.y=yaw;camera.rotation.x=pitch;
   renderer.render(scene3,camera);
  };
  raf=requestAnimationFrame(animate);
  return()=>{
   cancelAnimationFrame(raf);ro.disconnect();window.removeEventListener("keydown",keydown);window.removeEventListener("keyup",keyup);
   renderer.domElement.removeEventListener("pointerdown",pointerDown);renderer.domElement.removeEventListener("pointermove",pointerMove);renderer.domElement.removeEventListener("pointerup",pointerUp);renderer.domElement.removeEventListener("pointercancel",pointerUp);
   stickRef.current?.removeEventListener("pointerdown",stickDown);stickRef.current?.removeEventListener("pointermove",stickMove);stickRef.current?.removeEventListener("pointerup",stickUp);stickRef.current?.removeEventListener("pointercancel",stickUp);
   lookZone?.removeEventListener("pointerdown",lookDown);lookZone?.removeEventListener("pointermove",lookMove);lookZone?.removeEventListener("pointerup",lookUp);lookZone?.removeEventListener("pointercancel",lookUp);
   jumpButton?.removeEventListener("pointerdown",onJump);renderer.dispose();scene3.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});
  };
 },[]);
 const[menuOpen,setMenuOpen]=useState(false);
 const toggleMenu=()=>{setMenuOpen(v=>{const next=!v;pausedRef.current=next;return next})};
 const continueGame=()=>{pausedRef.current=false;setMenuOpen(false)};
 return <div ref={runtimeRef} className="game-runtime">
  <div ref={hostRef} className="game-runtime-canvas"/>
  <div className="touch-look-zone" data-look aria-hidden="true"/>
  <div ref={stickRef} className="touch-stick" aria-label="Joystick"><div ref={knobRef} className="touch-stick-knob"/><span>MOVE</span></div>
  <button type="button" className="touch-jump" data-jump>JUMP</button>
  <button type="button" className="runtime-menu-button" aria-label="Eskådin Stüdis menu" aria-expanded={menuOpen} onClick={toggleMenu}><span className="runtime-logo-mark">E</span></button>
  {menuOpen&&<div className="runtime-pause-menu" role="dialog" aria-label="Game menu">
   <button type="button" onClick={continueGame}>Continuar</button>
   <button type="button" onClick={onRestart}>Reiniciar</button>
   <button type="button" onClick={onExit}>Salir</button>
  </div>}
 </div>
}
function Play(){
 const[,t]=useLang();const{id}=useParams();const[games]=useGames();const game=games.find(g=>String(g.id)===id)||null;
 const[started,setStarted]=useState(false);
 const[gameRunKey,setGameRunKey]=useState(0);
 useEffect(()=>{if(started){localStorage.setItem("eskadin-stat-sessions",String(Number(localStorage.getItem("eskadin-stat-sessions")||0)+1));const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.play){p.play=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+8))}}},[started]);
 if(!game)return <main className="page narrow"><Link className="back" to="/games">← {t.back}</Link><div className="form-card"><h2>No hay ningún juego para jugar.</h2><Link className="button button-primary" to="/games">{t.explore}</Link></div></main>;
 const launch=async()=>{try{const el=document.documentElement;if(!document.fullscreenElement){if(el.requestFullscreen)await el.requestFullscreen({navigationUI:"hide"});else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen()}}catch{}setStarted(true)};
 const exit=async()=>{try{if(document.fullscreenElement&&document.exitFullscreen)await document.exitFullscreen()}catch{}setStarted(false)};
 if(started)return <div className="play-full"><GameRuntime key={gameRunKey} game={game} onExit={exit} onRestart={()=>setGameRunKey(k=>k+1)}/></div>;
 return <main className="page play"><div className="playbar"><Link to={"/games/"+game.id}>← {t.back}</Link><b>{game.title}</b><span>READY</span></div><div className="game-viewport"><div className="launch-card"><span>PLAYABLE GAME</span><h2>{game.title}</h2><p>{game.description}</p><button className="button button-primary" onClick={launch}>▶ {t.play} · FULLSCREEN</button></div></div></main>
}

const sceneSeed=[{id:1,type:"wall",name:"Wall 01",x:0,y:0,z:0,rx:0,ry:0,rz:0,s:1},{id:2,type:"cube",name:"Cube 02",x:2,y:0,z:0,rx:0,ry:0,rz:0,s:1},{id:3,type:"light",name:"Light 03",x:0,y:3,z:2,rx:0,ry:0,rz:0,s:1}];

function meshFor(o){
 const colors={light:0xffd54a,spawn:0x6aa7ff,camera:0xa78bfa,sound:0xff62b5,text:0xf2f4f8,wall:0x71809a,sphere:0x6fd3ff,cylinder:0x8de08b,cone:0xff9f68,torus:0xd99cff,plane:0x8f9aaa,capsule:0xff7eb6};
 const material=new THREE.MeshStandardMaterial({color:o.color||colors[o.type]||0x71809a,roughness:o.roughness??.55,metalness:o.metalness??.2});
 let geometry;
 if(o.type==="wall") geometry=new THREE.BoxGeometry(4,2,.35);
 else if(o.type==="light") geometry=new THREE.SphereGeometry(.42,24,16);
 else if(o.type==="spawn") geometry=new THREE.ConeGeometry(.55,1.2,4);
 else if(o.type==="camera") geometry=new THREE.BoxGeometry(1.1,.7,1.5);
 else if(o.type==="sound") geometry=new THREE.TorusGeometry(.55,.13,12,32);
 else if(o.type==="text") geometry=new THREE.PlaneGeometry(1.8,1);
 else if(o.type==="sphere") geometry=new THREE.SphereGeometry(.75,32,20);
 else if(o.type==="cylinder") geometry=new THREE.CylinderGeometry(.65,.65,1.5,32);
 else if(o.type==="cone") geometry=new THREE.ConeGeometry(.7,1.5,32);
 else if(o.type==="torus") geometry=new THREE.TorusGeometry(.65,.22,18,40);
 else if(o.type==="plane") geometry=new THREE.PlaneGeometry(1.8,1.8);
 else if(o.type==="capsule") geometry=new THREE.CapsuleGeometry(.45,.9,8,16);
 else if(o.type==="floor") geometry=new THREE.PlaneGeometry(8,8);
 else geometry=new THREE.BoxGeometry(1,1,1);
 const mesh=new THREE.Mesh(geometry,material);
 mesh.position.set(o.x,o.y,o.z);
 mesh.rotation.set(THREE.MathUtils.degToRad(o.rx),THREE.MathUtils.degToRad(o.ry),THREE.MathUtils.degToRad(o.rz));
 if(o.type==="floor")mesh.rotation.x=-Math.PI/2;
 mesh.scale.setScalar(o.s);
 mesh.userData.objectId=o.id;
 mesh.castShadow=true;
 mesh.receiveShadow=true;
 return mesh;
}

function ThreeViewport({scene,selected,setSelected,tool,grid,upd,wireframe=false,showAxes=true,snap=false}){
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
   const axes=new THREE.AxesHelper(3.5);axes.visible=showAxes;scene3.add(axes);
   const ground=new THREE.Mesh(new THREE.PlaneGeometry(24,24),new THREE.MeshStandardMaterial({color:0x0e141d,roughness:1,metalness:0}));
   ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene3.add(ground);
   const objects=[];
   const objectMap=new Map();
   sceneRef.current.forEach(o=>{const m=meshFor(o);if(m.material)m.material.wireframe=wireframe;scene3.add(m);objects.push(m);objectMap.set(o.id,m)});
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
     const q=n=>snap?Math.round(n*2)/2:n;upd(id,{x:q(Number(m.position.x.toFixed(3))),y:q(Number(m.position.y.toFixed(3))),z:q(Number(m.position.z.toFixed(3))),rx:Number(THREE.MathUtils.radToDeg(m.rotation.x).toFixed(2)),ry:Number(THREE.MathUtils.radToDeg(m.rotation.y).toFixed(2)),rz:Number(THREE.MathUtils.radToDeg(m.rotation.z).toFixed(2)),s:Number(m.scale.x.toFixed(3))});
   };
   const clampScale=()=>{
     const m=transform.object;
     if(!m||toolRef.current!=="scale")return;
     const s=THREE.MathUtils.clamp(m.scale.x,.05,10);
     m.scale.setScalar(s);
   };
   const onObjectChange=()=>clampScale();
   const onDraggingChanged=e=>{
     orbit.enabled=!e.value;
     if(e.value) return;
     clampScale();
     sync();
   };
   transform.addEventListener("objectChange",onObjectChange);
   const selectedObject=objectMap.get(selectedRef.current); if(selectedObject) transform.attach(selectedObject);
   transform.addEventListener("dragging-changed",onDraggingChanged);
   const resize=()=>{
     const w=Math.max(host.clientWidth,320),h=Math.max(host.clientHeight,460);
     renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
   };
   const ro=new ResizeObserver(resize);ro.observe(host);resize();
   let raf;
   const animate=()=>{raf=requestAnimationFrame(animate);orbit.update();renderer.render(scene3,camera)};
   animate();
   return()=>{cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener("pointerdown",pick);transform.removeEventListener("objectChange",onObjectChange);transform.removeEventListener("dragging-changed",onDraggingChanged);transform.dispose();orbit.dispose();renderer.dispose();scene3.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})};
 },[scene.length,grid,wireframe,showAxes,snap]);
 useEffect(()=>{const t=transformRef.current;if(t){t.setMode(tool==="rotate"?"rotate":tool==="scale"?"scale":"translate");if(tool==="select")t.detach();else{const o=objectMapRef.current.get(selectedRef.current);if(o)t.attach(o)}}},[tool]); useEffect(()=>{scene.forEach(o=>{const m=objectMapRef.current.get(o.id);if(m){m.position.set(o.x,o.y,o.z);m.rotation.set(THREE.MathUtils.degToRad(o.rx),THREE.MathUtils.degToRad(o.ry),THREE.MathUtils.degToRad(o.rz));if(o.type==="floor")m.rotation.x=-Math.PI/2;m.scale.setScalar(o.s);if(m.material){if(o.color)m.material.color.set(o.color);m.material.roughness=o.roughness??m.material.roughness;m.material.metalness=o.metalness??m.material.metalness}}})},[scene]);
 useEffect(()=>{const t=transformRef.current;if(t){const o=objectMapRef.current.get(selected);if(o)t.attach(o);else t.detach();}},[selected]);
 useEffect(()=>{const c=hostRef.current;if(c){const el=c.querySelector("canvas");if(el)el.style.touchAction="none";}},[grid]);
 useEffect(()=>{
   const canvas=hostRef.current?.querySelector("canvas");
   if(!canvas)return;
   canvas.style.touchAction="none";
 },[]);
 return <div ref={hostRef} className="three-editor-viewport"/>;
}

function useStudioFullscreenLock(){
 useEffect(()=>{
  const prevent=(e)=>{if(document.fullscreenElement)e.preventDefault()};
  const onTouch=(e)=>{
   if(!document.fullscreenElement)return;
   const t=e.touches?.[0];
   if(t&&t.clientY<70)e.preventDefault();
  };
  document.addEventListener("touchmove",prevent,{passive:false});
  document.addEventListener("wheel",prevent,{passive:false});
  document.addEventListener("gesturestart",prevent,{passive:false});
  return()=>{document.removeEventListener("touchmove",prevent);document.removeEventListener("wheel",prevent);document.removeEventListener("gesturestart",prevent)};
 },[]);
}
function Editor(){useStudioFullscreenLock();
 const[lang,t]=useLang();
 const[sidebarOpen,setSidebarOpen]=useState(false);
 const[scene,setScene]=useState(()=>read("eskadin-scene",sceneSeed));
 const[selected,setSelected]=useState(1);
 const[tool,setTool]=useState("select");
 const[saved,setSaved]=useState(false);
 const[grid,setGrid]=useState(true);
 const[snap,setSnap]=useState(false);
 const[wireframe,setWireframe]=useState(false);
 const[showAxes,setShowAxes]=useState(true);
 const[panel,setPanel]=useState("create");
 const[obj,setObj]=useState(null);
 useEffect(()=>setObj(scene.find(o=>o.id===selected)||null),[scene,selected]);

 const upd=(id,patch)=>setScene(s=>s.map(o=>o.id===id?{...o,...patch}:o));
 const add=type=>{const id=Date.now();const defaults={wall:[0,1,0],cube:[0,.5,0],sphere:[0,.75,0],cylinder:[0,.75,0],cone:[0,.75,0],torus:[0,.75,0],capsule:[0,.7,0],plane:[0,0,0],light:[2,3,2],sound:[0,1,2],spawn:[-2,.6,0],camera:[3,2,4],text:[0,1,0],floor:[0,0,0]};const p=defaults[type]||[0,.5,0];const item={id,type,name:type.charAt(0).toUpperCase()+type.slice(1)+" "+(scene.length+1),x:p[0],y:p[1],z:p[2],rx:0,ry:0,rz:0,s:1,color:null,roughness:.55,metalness:.2};setScene(s=>[...s,item]);setSelected(id)};
 const saveScene=()=>{save("eskadin-scene",scene);save("eskadin-project",{name:"Untitled project",scene,updatedAt:new Date().toISOString()});setSaved(true);setTimeout(()=>setSaved(false),1000)};
 const del=()=>{if(selected==null)return;setScene(s=>s.filter(o=>o.id!==selected));setSelected(null)};
 const dup=()=>{const o=scene.find(x=>x.id===selected);if(o){const id=Date.now();setScene(s=>[...s,{...o,id,name:o.name+" copy",x:o.x+.6,z:o.z+.6}]);setSelected(id)}};
 const reset=()=>{setScene(sceneSeed);setSelected(sceneSeed[0]?.id||null)};
 const toggleFullscreen=async()=>{
 try{
  if(!document.fullscreenElement){
   const el=document.documentElement;
   if(el.requestFullscreen) await el.requestFullscreen({navigationUI:"hide"});
   else if(el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }else{
   await document.exitFullscreen();
  }
 }catch{}
};
 useEffect(()=>{const onKey=e=>{if(e.ctrlKey&&e.key.toLowerCase()==="s"){e.preventDefault();saveScene()}if(e.key==="Delete"||e.key==="Backspace"){if(document.activeElement?.tagName!=="INPUT"&&document.activeElement?.tagName!=="TEXTAREA")del()}if(e.key.toLowerCase()==="w")setTool("move");if(e.key.toLowerCase()==="e")setTool("rotate");if(e.key.toLowerCase()==="r")setTool("scale");if(e.key.toLowerCase()==="q")setTool("select");if(e.ctrlKey&&e.key.toLowerCase()==="d"){e.preventDefault();dup()}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)},[selected,scene]);
 const groups={create:[["cube","Cube"],["wall","Wall"],["sphere","Sphere"],["cylinder","Cylinder"],["cone","Cone"],["torus","Torus"],["capsule","Capsule"],["plane","Plane"],["floor","Floor"]],scene:[["light","Light"],["sound","Sound"],["spawn","Spawn"],["camera","Camera"],["text","Text"]]};
 return <main className="page editor-page">
  <button type="button" className="studio-menu-button" title={sidebarOpen?"Close Studio menu":"Open Studio menu"} aria-label={t.add} onClick={()=>setSidebarOpen(v=>!v)}>{sidebarOpen?"×":"☰"}</button>
  {sidebarOpen&&<button type="button" className="studio-sidebar-backdrop" aria-label="Close menu" onClick={()=>setSidebarOpen(false)}/>} 
  <div className={"editor-shell "+(sidebarOpen?"sidebar-open":"")}>

   <aside className="studio-sidebar" aria-hidden={!sidebarOpen}>
    <div className="studio-sidebar-head"><div className="studio-sidebar-brand">Eskådin<br/><span>Stüdis</span></div><strong className="studio-project-side">{t.newGame}</strong></div><div className="studio-sidebar-actions studio-nav-actions"><Link title={t.back} to="/">⌂ {t.back}</Link><Link title={t.explore} to="/games">▶ {t.explore}</Link></div><div className="studio-sidebar-section">{t.language}</div><select className="studio-language" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
    <div className="studio-sidebar-actions">
     <button title={t.add} onClick={()=>setPanel("create")}>＋ {t.add}</button><button title={t.hierarchy} onClick={()=>setPanel("scene")}>☷ {t.hierarchy}</button><button title={t.assets} onClick={()=>setPanel("create")}>▣ {t.assets}</button><button title={t.scene} onClick={()=>setPanel("scene")}>◉ {t.scene}</button>
    </div>
    <div className="studio-sidebar-section">{t.selectTool}</div>
    <div className="studio-tool-grid">
     <button title={`${t.selectTool} (Q)`} className={tool==="select"?"active":""} onClick={()=>setTool("select")}>↖<span>{t.selectTool}</span><kbd>Q</kbd></button>
     <button title={`${t.move} (W)`} className={tool==="move"?"active":""} onClick={()=>setTool("move")}>✥<span>{t.move}</span><kbd>W</kbd></button>
     <button title={`${t.rotate} (E)`} className={tool==="rotate"?"active":""} onClick={()=>setTool("rotate")}>↻<span>{t.rotate}</span><kbd>E</kbd></button>
     <button title={`${t.scale} (R)`} className={tool==="scale"?"active":""} onClick={()=>setTool("scale")}>⤢<span>{t.scale}</span><kbd>R</kbd></button>
    </div>
    <div className="studio-sidebar-section">{t.view}</div>
    <div className="studio-sidebar-actions">
     <button title={t.grid} className={grid?"active":""} onClick={()=>setGrid(!grid)}>▦ {t.grid}</button><button title={t.snap} className={snap?"active":""} onClick={()=>setSnap(!snap)}>⌗ {t.snap}</button><button title={t.wireframe} className={wireframe?"active":""} onClick={()=>setWireframe(!wireframe)}>◇ {t.wireframe}</button><button title={t.axes} className={showAxes?"active":""} onClick={()=>setShowAxes(!showAxes)}>XYZ {t.axes}</button>
    </div>
    <div className="studio-sidebar-section">{t.quickActions}</div>
    <div className="studio-sidebar-actions">
     <button title={t.duplicate} onClick={dup}>＋ {t.duplicate}</button><button title={t.deleteObject} onClick={del}>⌫ {t.deleteObject}</button><button title={t.reset} onClick={reset}>↺ {t.reset}</button>
    </div>
    <div className="studio-panel-preview">{panel==="create"&&<><strong>{t.add}</strong><div className="studio-object-grid">{groups.create.map(([type,label])=><button key={type} title={label} onClick={()=>add(type)}>{label}</button>)}{groups.scene.map(([type,label])=><button key={type} title={label} onClick={()=>add(type)}>{label}</button>)}</div></>}{panel==="scene"&&<><strong>{t.hierarchy}</strong><div className="studio-scene-list">{scene.map(o=><button key={o.id} title={o.name} className={selected===o.id?"active":""} onClick={()=>setSelected(o.id)}>{o.name}</button>)}</div></>}</div><div className="studio-sidebar-spacer"/>
    <div className="studio-sidebar-actions bottom-actions">
     <button title={t.fullscreen} onClick={toggleFullscreen}>⛶ {t.fullscreen}</button><button title={t.save} onClick={saveScene}>✓ {saved?t.save:t.save}</button><Link title={t.publish} className="studio-publish" to="/publish">↗ {t.publish}</Link>
    </div>
   </aside>
   <div className="editor-main" onClick={()=>sidebarOpen&&setSidebarOpen(false)}>
    <div className="editor-workspace">
     <section className="editor-center">
      <div className="viewport-project"><strong>{t.newGame}</strong><span>● {t.local} · {scene.length} {t.objectsCount}</span></div>
      <div className="viewport-hud"><span>{t.viewport}</span><span>{t.orbit}</span></div>
      <ThreeViewport scene={scene} selected={selected} setSelected={setSelected} tool={tool} grid={grid} upd={upd} wireframe={wireframe} showAxes={showAxes} snap={snap}/>
      <div className="viewport-badges"><span>{t.webgl}</span><span>{t.shadows}</span><span>{t.touch}</span><span>{wireframe?t.wire:t.solid}</span><span>{snap?t.snapOn:t.snapOff}</span></div>
     </section>
     <aside className="editor-dock right-dock">
      <div className="dock-heading"><span>{t.inspector}</span><span>{obj?.type||"—"}</span></div>
      {obj?<><label>{t.name}<input value={obj.name} onChange={e=>upd(obj.id,{name:e.target.value})}/></label><div className="inspector-group"><b>{t.transform}</b><div className="xyz"><label>X<input type="number" step=".1" value={obj.x} onChange={e=>upd(obj.id,{x:Number(e.target.value)})}/></label><label>Y<input type="number" step=".1" value={obj.y} onChange={e=>upd(obj.id,{y:Number(e.target.value)})}/></label><label>Z<input type="number" step=".1" value={obj.z} onChange={e=>upd(obj.id,{z:Number(e.target.value)})}/></label></div><div className="xyz"><label>RX<input type="number" step="1" value={obj.rx} onChange={e=>upd(obj.id,{rx:Number(e.target.value)})}/></label><label>RY<input type="number" step="1" value={obj.ry} onChange={e=>upd(obj.id,{ry:Number(e.target.value)})}/></label><label>RZ<input type="number" step="1" value={obj.rz} onChange={e=>upd(obj.id,{rz:Number(e.target.value)})}/></label></div><label>{t.scale}<input type="number" step=".1" min=".1" value={obj.s} onChange={e=>upd(obj.id,{s:Number(e.target.value)})}/></label></div><div className="inspector-group"><b>{t.material}</b><label>{t.color}<input type="color" value={obj.color||"#71809a"} onChange={e=>upd(obj.id,{color:e.target.value})}/></label><label>{t.roughness}<input type="range" min="0" max="1" step=".01" value={obj.roughness??.55} onChange={e=>upd(obj.id,{roughness:Number(e.target.value)})}/></label><label>{t.metalness}<input type="range" min="0" max="1" step=".01" value={obj.metalness??.2} onChange={e=>upd(obj.id,{metalness:Number(e.target.value)})}/></label></div><div className="inspector-group"><b>{t.quickActions}</b><div className="inspector-actions"><button title={t.duplicate} onClick={dup}>{t.duplicate}</button><button onClick={()=>upd(obj.id,{x:0,y:.5,z:0,rx:0,ry:0,rz:0,s:1})}>{t.resetTransform}</button><button className="danger-mini" onClick={del}>{t.deleteObjectFull}</button></div></div></>:<div className="empty-inspector">{t.selectObject}</div>}
      <div className="inspector-group editor-stats"><b>{t.scene}</b><span>{scene.length} {t.objects}</span><span>{t.grid} {grid?"ON":"OFF"}</span><span>{t.snap} {snap?"ON":"OFF"}</span><span>WebGL realtime preview</span></div>
     </aside>
    </div>
    <div className="editor-control-footer"><button title={t.selectTool} onClick={()=>setTool("select")}>{t.selectTool}</button><button title={t.move} onClick={()=>setTool("move")}>{t.move}</button><button title={t.rotate} onClick={()=>setTool("rotate")}>{t.rotate}</button><button title={t.scale} onClick={()=>setTool("scale")}>{t.scale}</button><button onClick={dup}>{t.duplicate}</button><button title={t.deleteObject} onClick={del}>{t.deleteObject}</button><button title={t.save} onClick={saveScene}>{t.save}</button></div>
    <div className="editor-statusbar"><span>{t.sceneStats.replace("{n}",scene.length)}</span><span>{t.shortcuts}</span></div>
   </div>
  </div>
 </main>
 }

function Developer(){const[,t]=useLang();return <main className="page"><div className="eyebrow">{t.developer}</div><h1 className="page-title">{t.yourStudio}</h1><div className="dashboard-grid"><Link to="/editor" className="dash"><b>🧱 {t.create}</b><span>{t.buildPreview}</span></Link><Link to="/projects" className="dash"><b>🗂 {t.projects}</b><span>{t.manageProjects}</span></Link><Link to="/publish" className="dash"><b>📤 {t.publish}</b><span>{t.releaseGame}</span></Link><Link to="/statistics" className="dash"><b>📊 {t.statisticsShort}</b><span>{t.visitsLikesSessions}</span></Link></div></main>}

function Publish(){const[,t]=useLang();const[games,setGames]=useGames();const{developer}=useUser();const nav=useNavigate();const[name,setName]=useState("My new game");const[desc,setDesc]=useState("A new Eskådin Stüdis experience.");const[done,setDone]=useState(false);const blocked=blockedIdentity(name);const go=()=>{if(blocked)return;setGames(g=>[...g,{id:Date.now(),title:name,genre:"3D Experience",tag:"New",color:"violet",players:0,likes:0,author:developer?.name||"Eskådin Studio",description:desc}]);setDone(true)};if(!developer)return <main className="page narrow"><div className="form-card"><div className="eyebrow">{t.developer}</div><h1 className="page-title">{t.developerRequired}</h1><p className="muted">{t.developerRequiredText}</p><button className="button button-primary" onClick={()=>nav("/developer/register")}>{t.createDeveloper}</button></div></main>;return <main className="page narrow"><div className="eyebrow">{t.publish}</div><h1 className="page-title">{done?t.published:t.publish}</h1>{done?<div className="success-card"><b>✓ {t.publish}</b><p>{t.localCatalog}</p><Link className="button button-primary" to="/games">{t.explore}</Link></div>:<div className="form-card"><label>{t.name}<input value={name} onChange={e=>setName(e.target.value)}/></label>{blocked&&<p className="error">{t.reservedName}</p>}<label>{t.description}<textarea value={desc} onChange={e=>setDesc(e.target.value)}/></label><label>{t.settings}<select><option>{t.public}</option><option>{t.private}</option></select></label><button className="button button-primary" disabled={blocked} onClick={go}>{t.publish} · 0€</button><p className="muted">{t.earnedOnly}</p></div>}</main>}

function Missions(){const[,t]=useLang();const[balance,setBalance]=useState(()=>Number(localStorage.getItem("eskadin-fc")||0));const[progress,setProgress]=useState(()=>read("eskadin-mission-progress",{play:false,explore:false,like:false}));const ms=[["play","Play an experience",8],["explore","Open an experience page",12],["like","Like an experience",5]];useEffect(()=>{const sync=()=>{setProgress(read("eskadin-mission-progress",{play:false,explore:false,like:false}));setBalance(Number(localStorage.getItem("eskadin-fc")||0))};sync();const id=setInterval(sync,400);return()=>clearInterval(id)},[]);return <main className="page"><div className="eyebrow">{t.missions}</div><h1 className="page-title">F¢ missions</h1><div className="wallet-banner"><b>{balance} F¢</b><span>Earn platform currency by playing.</span><Link to="/wallet">{t.wallet}</Link></div><div className="mission-grid">{ms.map(([id,title,n])=><div className="mission-card" key={id}><span>MISSION</span><h3>{title}</h3><strong>+{n} F¢</strong><Link className="button button-primary" to="/games">{progress[id]?"✓ Completed":"Go do it →"}</Link></div>)}</div></main>}

function Wallet(){const[,t]=useLang();const balance=Number(localStorage.getItem("eskadin-fc")||0);return <main className="page narrow"><div className="eyebrow">{t.wallet}</div><h1 className="page-title">{balance} F¢</h1><div className="form-card"><h2>Platform currency</h2><p className="muted">F¢ can only be earned through platform gameplay missions. It cannot be purchased, withdrawn or converted to real money.</p><Link className="button button-primary" to="/missions">{t.missions}</Link></div></main>}

function Projects(){const[,t]=useLang();const project=read("eskadin-project",null);return <main className="page"><div className="eyebrow">{t.projects}</div><h1 className="page-title">{t.yourProjects}</h1>{project?<div className="dashboard-grid"><Link className="dash" to="/editor"><b>{project.name}</b><span>Local editable scene · {project.scene?.length||0} objects · {new Date(project.updatedAt).toLocaleString()}</span></Link></div>:<div className="form-card"><h2>{t.noProjects}</h2><p className="muted">{t.saveSceneHint}</p><Link className="button button-primary" to="/editor">Abrir editor</Link></div>}</main>}

function Statistics(){const[,t]=useLang();const[games]=useGames();const views=Number(localStorage.getItem("eskadin-stat-views")||0);const sessions=Number(localStorage.getItem("eskadin-stat-sessions")||0);const likes=games.reduce((n,g)=>n+Number(g.likes||0),0);return <main className="page"><div className="eyebrow">{t.statistics}</div><h1 className="page-title">{t.statistics}</h1><div className="stats-grid"><div><b>{views.toLocaleString()}</b><span>Game page views</span></div><div><b>{likes.toLocaleString()}</b><span>Likes</span></div><div><b>{sessions.toLocaleString()}</b><span>Play sessions</span></div><div><b>{games.length.toLocaleString()}</b><span>Published games</span></div></div><div className="form-card"><p className="muted">{t.localStats}</p></div></main>}

function Account(){const[,t]=useLang();const{user,logout}=useUser();return <main className="page narrow"><div className="eyebrow">{t.account}</div><h1 className="page-title">{user?.name||"Eskådin Player"}</h1><div className="form-card"><div className="account-avatar">{(user?.name||"ES").slice(0,2).toUpperCase()}</div><p className="muted">0 published games · 0 sessions · {Number(localStorage.getItem("eskadin-fc")||0)} F¢</p><div className="account-actions"><Link className="button button-ghost" to="/editor">{t.create}</Link><Link className="button button-ghost" to="/wallet">{t.wallet}</Link><Link className="button button-ghost" to="/settings">{t.settings}</Link><Link className="button danger-button" to="/account/delete">{t.delete}</Link></div><button className="button button-ghost" onClick={logout}>{t.logout}</button></div></main>}

function Settings(){const[lang,setLang]=useLang();const t=TXT[lang];return <main className="page narrow"><div className="eyebrow">{t.settings}</div><h1 className="page-title">{t.settings}</h1><div className="form-card"><label>{t.language}<select value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><p className="muted">{t.languageStored}</p></div></main>}

function Login(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.login}</h1><p className="muted">Cuenta personal para jugar, guardar progreso y ganar F¢.</p><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Display name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><button className="button button-primary" onClick={()=>{login({name:name||"Eskådin Player"});nav("/account")}}>{t.login}</button><Link className="muted" to="/register">{t.register}</Link><Link className="muted" to="/developer/register">Crear cuenta de desarrollador →</Link></div></main>}
function Register(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.register}</h1><p className="muted">Cuenta personal. No es una cuenta de desarrollador.</p><label>Username<input value={name} onChange={e=>setName(e.target.value)} placeholder="Player name"/></label><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Confirm password<input type="password"/></label><button className="button button-primary" onClick={()=>{login({name:name||"Eskådin Player"});nav("/account")}}>{t.register}</button><Link className="muted" to="/login">{t.login}</Link><Link className="muted" to="/developer/register">¿Quieres publicar juegos? Crear cuenta de desarrollador →</Link></div></main>}
function DeveloperRegister(){const{devLogin}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">DEVELOPER</div><h1>Crear cuenta de desarrollador</h1><p className="muted">Cuenta separada para crear, publicar y consultar estadísticas. No sustituye tu cuenta personal.</p><label>Nombre del estudio<input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del estudio"/></label><label>Email<input type="email"/></label><label>Password<input type="password"/></label><label>Confirm password<input type="password"/></label><button className="button button-primary" onClick={()=>{devLogin({name:name||"Eskådin Studio"});nav("/developer/account")}}>Crear cuenta de desarrollador</button><Link className="muted" to="/register">Crear cuenta personal →</Link></div></main>}
function DeveloperAccount(){const{developer,devLogout}=useUser();return <main className="page narrow"><div className="eyebrow">DEVELOPER ACCOUNT</div><h1 className="page-title">{developer?.name||"Eskådin Studio"}</h1><div className="form-card"><p className="muted">Cuenta de creador separada de la cuenta personal.</p><div className="account-actions"><Link className="button button-primary" to="/editor">Abrir editor</Link><Link className="button button-ghost" to="/publish">Publicar</Link><Link className="button button-ghost" to="/statistics">Estadísticas</Link><button className="button danger-button" onClick={()=>{devLogout();location.href="/"}}>Cerrar cuenta de desarrollador</button></div></div></main>}
function DeleteAccount(){const[,t]=useLang();const{logout}=useUser();const nav=useNavigate();const[c,setC]=useState("");return <main className="page narrow auth-page"><div className="form-card danger-card"><div className="eyebrow danger">DANGER ZONE</div><h1>{t.delete}</h1><p className="muted">This clears the local account and session on this device.</p><input value={c} onChange={e=>setC(e.target.value)} placeholder="DELETE"/><button className="button danger-button" disabled={c!=="DELETE"} onClick={()=>{logout();localStorage.removeItem("eskadin-fc");nav("/")}}>{t.delete}</button></div></main>}

function NotFound(){return <main className="page notfound"><h1>404</h1><p>This page escaped the editor.</p><Link className="button button-primary" to="/">Home</Link></main>}

export default function CompleteApp(){return <LangProvider><AuthProvider><Shell><Routes><Route path="/" element={<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:id" element={<Game/>}/><Route path="/games/:id/play" element={<Play/>}/><Route path="/editor" element={<Editor/>}/><Route path="/developer" element={<Developer/>}/><Route path="/projects" element={<Projects/>}/><Route path="/publish" element={<Publish/>}/><Route path="/missions" element={<Missions/>}/><Route path="/wallet" element={<Wallet/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/account" element={<Account/>}/><Route path="/settings" element={<Settings/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/developer/register" element={<DeveloperRegister/>}/><Route path="/developer/account" element={<DeveloperAccount/>}/><Route path="/account/delete" element={<DeleteAccount/>}/><Route path="*" element={<NotFound/>}/></Routes></Shell></AuthProvider></LangProvider>}
