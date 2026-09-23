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

function useLang(){const{lang}=useContext(LangContext);return[lang,{...TXT[lang],...EXTRA_T[lang],...UI_T[lang],...UI_T_EXTRA[lang]}]}
const EXTRA_T={es:{transform:"TRANSFORM",color:"Color",roughness:"Rugosidad",metalness:"Metalidad",add:"Añadir",hierarchy:"Jerarquía",assets:"Recursos",scene:"Escena",selectTool:"Seleccionar",move:"Mover",rotate:"Rotar",scale:"Escalar",grid:"Cuadrícula",snap:"Ajuste",wireframe:"Estructura",axes:"Ejes",duplicate:"Duplicar",deleteObject:"Borrar",reset:"Restablecer",fullscreen:"Pantalla completa",inspector:"Inspector",primitives:"PRIMITIVAS",sceneObjects:"OBJETOS DE ESCENA",material:"MATERIAL",quickActions:"ACCIONES RÁPIDAS",resetTransform:"Restablecer transformación",deleteObjectFull:"Borrar objeto",createTab:"CREAR",sceneTab:"ESCENA",view:"VISTA",local:"LOCAL",objectsCount:"OBJETOS",viewport:"VISTA 3D · WEBGL",orbit:"Orbitar: arrastrar · Zoom: rueda/pellizcar · Gizmo: transformar",webgl:"WebGL 2",shadows:"Sombras",touch:"Táctil",solid:"Sólido",wire:"Estructura",snapOn:"Ajuste ACTIVADO",snapOff:"Ajuste DESACTIVADO",sceneStats:"ESCÅDIN 3D STUDIO · {n} objetos · proyecto local",shortcuts:"Ctrl+S Guardar · Q Seleccionar · W Mover · E Rotar · R Escalar · Supr Borrar"},en:{transform:"TRANSFORM",color:"Color",roughness:"Roughness",metalness:"Metalness",add:"Add",hierarchy:"Hierarchy",assets:"Assets",scene:"Scene",selectTool:"Select",move:"Move",rotate:"Rotate",scale:"Scale",grid:"Grid",snap:"Snap",wireframe:"Wireframe",axes:"Axes",duplicate:"Duplicate",deleteObject:"Delete",reset:"Reset",fullscreen:"Fullscreen",inspector:"Inspector",primitives:"PRIMITIVES",sceneObjects:"SCENE OBJECTS",material:"MATERIAL",quickActions:"QUICK ACTIONS",resetTransform:"Reset transform",deleteObjectFull:"Delete object",createTab:"CREATE",sceneTab:"SCENE",view:"VIEW",local:"LOCAL",objectsCount:"OBJECTS",viewport:"3D VIEWPORT · WEBGL",orbit:"Orbit: drag · Zoom: wheel/pinch · Gizmo: transform",webgl:"WebGL 2",shadows:"Shadows",touch:"Touch",solid:"Solid",wire:"Wireframe",snapOn:"Snap ON",snapOff:"Snap OFF",sceneStats:"ESCÅDIN 3D STUDIO · {n} objects · local project",shortcuts:"Ctrl+S Save · Q Select · W Move · E Rotate · R Scale · Del Delete"},sv:{add:"Lägg till",hierarchy:"Hierarki",assets:"Resurser",scene:"Scen",selectTool:"Välj",move:"Flytta",rotate:"Rotera",scale:"Skala",grid:"Rutnät",snap:"Fäst",wireframe:"Trådram",axes:"Axlar",duplicate:"Duplicera",deleteObject:"Ta bort",reset:"Återställ",fullscreen:"Helskärm",inspector:"Inspektör",primitives:"PRIMITIVER",sceneObjects:"SCENOBJEKT",material:"MATERIAL",quickActions:"SNABBÅTGÄRDER",resetTransform:"Återställ transform",deleteObjectFull:"Ta bort objekt",createTab:"SKAPA",sceneTab:"SCEN",view:"VY",local:"LOKALT",objectsCount:"OBJEKT",viewport:"3D-VY · WEBGL",orbit:"Rotera: dra · Zooma: hjul/nyp · Gizmo: transformera",webgl:"WebGL 2",shadows:"Skuggor",touch:"Pekskärm",solid:"Solid",wire:"Trådram",snapOn:"Fäst PÅ",snapOff:"Fäst AV",sceneStats:"ESCÅDIN 3D STUDIO · {n} objekt · lokalt projekt",shortcuts:"Ctrl+S Spara · Q Välj · W Flytta · E Rotera · R Skala · Del Ta bort"},de:{add:"Hinzufügen",hierarchy:"Hierarchie",assets:"Assets",scene:"Szene",selectTool:"Auswählen",move:"Verschieben",rotate:"Drehen",scale:"Skalieren",grid:"Raster",snap:"Einrasten",wireframe:"Drahtmodell",axes:"Achsen",duplicate:"Duplizieren",deleteObject:"Löschen",reset:"Zurücksetzen",fullscreen:"Vollbild",inspector:"Inspektor",primitives:"PRIMITIVEN",sceneObjects:"SZENENOBJEKTE",material:"MATERIAL",quickActions:"SCHNELLAKTIONEN",resetTransform:"Transformation zurücksetzen",deleteObjectFull:"Objekt löschen",createTab:"ERSTELLEN",sceneTab:"SZENE",view:"ANSICHT",local:"LOKAL",objectsCount:"OBJEKTE",viewport:"3D-ANSICHT · WEBGL",orbit:"Orbit: ziehen · Zoom: Rad/Pinch · Gizmo: transformieren",webgl:"WebGL 2",shadows:"Schatten",touch:"Touch",solid:"Voll",wire:"Drahtmodell",snapOn:"Einrasten AN",snapOff:"Einrasten AUS",sceneStats:"ESCÅDIN 3D STUDIO · {n} Objekte · lokales Projekt",shortcuts:"Strg+S Speichern · Q Auswählen · W Verschieben · E Drehen · R Skalieren · Entf Löschen"},fr:{add:"Ajouter",hierarchy:"Hiérarchie",assets:"Ressources",scene:"Scène",selectTool:"Sélectionner",move:"Déplacer",rotate:"Tourner",scale:"Échelle",grid:"Grille",snap:"Accrochage",wireframe:"Fil de fer",axes:"Axes",duplicate:"Dupliquer",deleteObject:"Supprimer",reset:"Réinitialiser",fullscreen:"Plein écran",inspector:"Inspecteur",primitives:"PRIMITIVES",sceneObjects:"OBJETS DE SCÈNE",material:"MATÉRIAU",quickActions:"ACTIONS RAPIDES",resetTransform:"Réinitialiser la transformation",deleteObjectFull:"Supprimer l’objet",createTab:"CRÉER",sceneTab:"SCÈNE",view:"VUE",local:"LOCAL",objectsCount:"OBJETS",viewport:"VUE 3D · WEBGL",orbit:"Orbite : glisser · Zoom : molette/pincer · Gizmo : transformer",webgl:"WebGL 2",shadows:"Ombres",touch:"Tactile",solid:"Solide",wire:"Fil de fer",snapOn:"Accrochage ACTIVÉ",snapOff:"Accrochage DÉSACTIVÉ",sceneStats:"ESCÅDIN 3D STUDIO · {n} objets · projet local",shortcuts:"Ctrl+S Enregistrer · Q Sélectionner · W Déplacer · E Tourner · R Échelle · Suppr Supprimer"}};
const UI_T_EXTRA={es:{developerAccount:"CUENTA DE DESARROLLADOR"},en:{developerAccount:"DEVELOPER ACCOUNT"},sv:{developerAccount:"UTVECKLARKONTO"},de:{developerAccount:"ENTWICKLERKONTO"},fr:{developerAccount:"COMPTE DÉVELOPPEUR"}};
const UI_T={"es":{"chat":"Chat","menu":"Menú","communityTitle":"Eskådin Comunidad","online":"En línea","beKind":"sé amable con la gente y diviértete ✨","send":"Enviar","continueGame":"Continuar","restart":"Reiniciar","exit":"Salir","ready":"LISTO","playableGame":"JUEGO JUGABLE","noGame":"No hay ningún juego para jugar.","email":"Correo electrónico","password":"Contraseña","displayName":"Nombre visible","username":"Nombre de usuario","confirmPassword":"Confirmar contraseña","customizeAvatar":"Personaliza tu avatar","skin":"Piel","shirt":"Camiseta","pants":"Pantalón","accessory":"Accesorio","profile":"PERFIL","aboutMe":"Sobre mí","playerOf":"jugador de Eskådin Stüdis","games":"juegos","sessions":"sesiones","avatar":"Avatar","avatarReady":"tu avatar está listo para jugar.","accountSection":"Cuenta","dangerZone":"ZONA DE PELIGRO","home":"Inicio","pageEscaped":"Esta página se escapó del editor.","gameViews":"Visitas a páginas de juegos","playSessions":"Sesiones de juego","publishedGames":"Juegos publicados","platformCurrencyTitle":"Moneda de la plataforma","earnCurrency":"Consigue moneda de la plataforma jugando."},"en":{"chat":"Chat","menu":"Menu","communityTitle":"Eskådin Community","online":"Online","beKind":"be kind to people and have fun ✨","send":"Send","continueGame":"Continue","restart":"Restart","exit":"Exit","ready":"READY","playableGame":"PLAYABLE GAME","noGame":"There is no game to play.","email":"Email","password":"Password","displayName":"Display name","username":"Username","confirmPassword":"Confirm password","customizeAvatar":"Customize your avatar","skin":"Skin","shirt":"Shirt","pants":"Pants","accessory":"Accessory","profile":"PROFILE","aboutMe":"About me","playerOf":"Eskådin Stüdis player","games":"games","sessions":"sessions","avatar":"Avatar","avatarReady":"your avatar is ready to play.","accountSection":"Account","dangerZone":"DANGER ZONE","home":"Home","pageEscaped":"This page escaped the editor.","gameViews":"Game page views","playSessions":"Play sessions","publishedGames":"Published games","platformCurrencyTitle":"Platform currency","earnCurrency":"Earn platform currency by playing."},"sv":{"chat":"Chatt","menu":"Meny","communityTitle":"Eskådin Community","online":"Online","beKind":"var snäll mot andra och ha kul ✨","send":"Skicka","continueGame":"Fortsätt","restart":"Starta om","exit":"Avsluta","ready":"KLAR","playableGame":"SPELBART SPEL","noGame":"Det finns inget spel att spela.","email":"E-post","password":"Lösenord","displayName":"Visningsnamn","username":"Användarnamn","confirmPassword":"Bekräfta lösenord","customizeAvatar":"Anpassa din avatar","skin":"Hud","shirt":"Tröja","pants":"Byxor","accessory":"Tillbehör","profile":"PROFIL","aboutMe":"Om mig","playerOf":"Eskådin Stüdis-spelare","games":"spel","sessions":"sessioner","avatar":"Avatar","avatarReady":"din avatar är redo att spela.","accountSection":"Konto","dangerZone":"FARLIG ZON","home":"Hem","pageEscaped":"Den här sidan rymde från editorn.","gameViews":"Visningar av spelsidor","playSessions":"Spelsessioner","publishedGames":"Publicerade spel","platformCurrencyTitle":"Plattformsvaluta","earnCurrency":"Tjäna plattformsvaluta genom att spela."},"de":{"chat":"Chat","menu":"Menü","communityTitle":"Eskådin Community","online":"Online","beKind":"sei freundlich und hab Spaß ✨","send":"Senden","continueGame":"Weiter","restart":"Neu starten","exit":"Beenden","ready":"BEREIT","playableGame":"SPIELBARES SPIEL","noGame":"Es gibt kein Spiel zum Spielen.","email":"E-Mail","password":"Passwort","displayName":"Anzeigename","username":"Benutzername","confirmPassword":"Passwort bestätigen","customizeAvatar":"Avatar anpassen","skin":"Haut","shirt":"Shirt","pants":"Hose","accessory":"Accessoire","profile":"PROFIL","aboutMe":"Über mich","playerOf":"Eskådin Stüdis-Spieler","games":"Spiele","sessions":"Sitzungen","avatar":"Avatar","avatarReady":"dein Avatar ist bereit zum Spielen.","accountSection":"Konto","dangerZone":"GEFAHRENZONE","home":"Startseite","pageEscaped":"Diese Seite ist aus dem Editor entkommen.","gameViews":"Aufrufe von Spielseiten","playSessions":"Spielsitzungen","publishedGames":"Veröffentlichte Spiele","platformCurrencyTitle":"Plattformwährung","earnCurrency":"Verdiene Plattformwährung durch Spielen."},"fr":{"chat":"Chat","menu":"Menu","communityTitle":"Communauté Eskådin","online":"En ligne","beKind":"sois gentil avec les autres et amuse-toi ✨","send":"Envoyer","continueGame":"Continuer","restart":"Recommencer","exit":"Quitter","ready":"PRÊT","playableGame":"JEU JOUABLE","noGame":"Il n’y a aucun jeu à jouer.","email":"E-mail","password":"Mot de passe","displayName":"Nom affiché","username":"Nom d’utilisateur","confirmPassword":"Confirmer le mot de passe","customizeAvatar":"Personnalise ton avatar","skin":"Peau","shirt":"T-shirt","pants":"Pantalon","accessory":"Accessoire","profile":"PROFIL","aboutMe":"À propos","playerOf":"joueur d’Eskådin Stüdis","games":"jeux","sessions":"sessions","avatar":"Avatar","avatarReady":"ton avatar est prêt à jouer.","accountSection":"Compte","dangerZone":"ZONE DANGEREUSE","home":"Accueil","pageEscaped":"Cette page s’est échappée de l’éditeur.","gameViews":"Vues des pages de jeux","playSessions":"Sessions de jeu","publishedGames":"Jeux publiés","platformCurrencyTitle":"Monnaie de la plateforme","earnCurrency":"Gagne de la monnaie de la plateforme en jouant."}};
Object.assign(UI_T.es,{jump:"SALTAR",studyAvatar:"CREA TU AVATAR"});Object.assign(UI_T.en,{jump:"JUMP",studyAvatar:"CREATE YOUR AVATAR"});Object.assign(UI_T.sv,{jump:"HOPPA",studyAvatar:"SKAPA DIN AVATAR"});Object.assign(UI_T.de,{jump:"SPRINGEN",studyAvatar:"ERSTELLE DEINEN AVATAR"});Object.assign(UI_T.fr,{jump:"SAUTER",studyAvatar:"CRÉE TON AVATAR"});
const LangContext=createContext(null);
function LangProvider({children}){const[lang,setLangState]=useState(()=>localStorage.getItem("eskadin-lang")||"es");const setLang=v=>{setLangState(v);localStorage.setItem("eskadin-lang",v)};return <LangContext.Provider value={{lang,setLang}}>{children}</LangContext.Provider>}
const AuthContext=createContext(null);
function useUser(){return useContext(AuthContext)}
function AuthProvider({children}){const[user,setUser]=useState(()=>read("eskadin-user",null));const[developer,setDeveloper]=useState(()=>read("eskadin-developer",null));const login=u=>{setUser(u);save("eskadin-user",u)};const logout=()=>{setUser(null);localStorage.removeItem("eskadin-user")};const devLogin=u=>{setDeveloper(u);save("eskadin-developer",u)};const devLogout=()=>{setDeveloper(null);localStorage.removeItem("eskadin-developer")};return <AuthContext.Provider value={{user,developer,login,logout,devLogin,devLogout}}>{children}</AuthContext.Provider>}
function useGames(){const[games,setGames]=useState(()=>{if(localStorage.getItem("eskadin-games-version")!==CATALOG_VERSION){localStorage.setItem("eskadin-games-version",CATALOG_VERSION);localStorage.removeItem("eskadin-games");return seed}return read("eskadin-games",seed)});useEffect(()=>save("eskadin-games",games),[games]);return[games,setGames]}

function RootRoute(){const{user}=useUser();return user?<Games/>:<Register/>}
function Shell({children}){const[lang,t]=useLang();const{setLang}=useContext(LangContext);const{user,developer}=useUser();const location=useLocation();const[menuOpen,setMenuOpen]=useState(false);useEffect(()=>setMenuOpen(false),[location.pathname]);if(location.pathname==="/editor")return <div className="app-shell studio-app">{children}</div>;return <div className="app-shell"><div className="wrap"><header className="nav"><div className="nav-left"><button type="button" className="global-menu-button" aria-label={t.menu} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?"×":"☰"}</button><Link className="global-brand" to={user?"/home":"/"} onClick={()=>setMenuOpen(false)}>Eskådin <span>Stüdis</span><sup>®</sup></Link></div></header>{menuOpen&&<button type="button" className="global-sidebar-backdrop" aria-label="Close menu" onClick={()=>setMenuOpen(false)}/>}<aside className={"global-sidebar "+(menuOpen?"open":"")} aria-hidden={!menuOpen}><div className="global-sidebar-brand"><Link to={user?"/home":"/"} onClick={()=>setMenuOpen(false)}>Eskådin <span>Stüdis</span><sup>®</sup></Link></div><nav className="global-sidebar-links"><NavLink to="/games" onClick={()=>setMenuOpen(false)}>{t.explore}</NavLink><NavLink to="/marketplace" onClick={()=>setMenuOpen(false)}>Mercado</NavLink><NavLink to="/avatar" onClick={()=>setMenuOpen(false)}>Avatar</NavLink><NavLink to="/editor" onClick={()=>setMenuOpen(false)}>{t.create}</NavLink><NavLink to="/projects" onClick={()=>setMenuOpen(false)}>Mis juegos</NavLink><NavLink to="/object-studio" onClick={()=>setMenuOpen(false)}>Object Studio</NavLink><NavLink to="/missions" onClick={()=>setMenuOpen(false)}>{t.missions}</NavLink><NavLink to="/developer" onClick={()=>setMenuOpen(false)}>{t.developer}</NavLink></nav><div className="global-sidebar-section">{t.language}</div><select className="lang global-sidebar-lang" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select><div className="global-sidebar-account">{developer?<Link className="avatar-link dev-avatar" to="/developer/account" onClick={()=>setMenuOpen(false)}>DEV</Link>:user?<Link className="account-menu-link" to="/account" onClick={()=>setMenuOpen(false)}>{user.name.slice(0,2).toUpperCase()} · {user.name}</Link>:<><Link className="button button-ghost small" to="/register" onClick={()=>setMenuOpen(false)}>{t.register}</Link><Link className="button button-primary small" to="/login" onClick={()=>setMenuOpen(false)}>{t.login}</Link></>}</div></aside>{children}<footer className="footer"><span>© 2026 Eskådin Stüdis®</span><span>0 ads · 0 real-money purchases · F¢ gameplay-only</span></footer></div></div>}
function R15AvatarPreview({user,size="md"}){
 const ref=useRef(null);
 useEffect(()=>{
  const host=ref.current;if(!host)return;
  const scene=new THREE.Scene();scene.background=new THREE.Color(0x0b0f16);
  const camera=new THREE.PerspectiveCamera(28,1,.1,100);camera.position.set(4.2,2.6,7.2);camera.lookAt(0,1.45,0);
  const renderer=new THREE.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.replaceChildren(renderer.domElement);renderer.domElement.style.width="100%";renderer.domElement.style.height="100%";
  scene.add(new THREE.HemisphereLight(0xffffff,0x273044,2.1));
  const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(3,6,5);scene.add(key);
  const avatar=createEskadinR15Avatar(user||{});scene.add(avatar);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(2.1,48),new THREE.MeshStandardMaterial({color:0x151b26,roughness:.9}));floor.rotation.x=-Math.PI/2;floor.position.y=.01;scene.add(floor);
  let raf=0;
  const resize=()=>{const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight);camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false)};
  resize();const ro=new ResizeObserver(resize);ro.observe(host);
  const tick=()=>{raf=requestAnimationFrame(tick);avatar.rotation.y+=.004;renderer.render(scene,camera)};tick();
  return()=>{cancelAnimationFrame(raf);ro.disconnect();scene.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){const m=Array.isArray(o.material)?o.material:[o.material];m.forEach(x=>x.dispose())}});renderer.dispose();host.replaceChildren()};
 },[user]);
 return <div className={"avatar-r15-preview avatar-"+size} ref={ref} aria-label={user?.name||"R15 avatar"}/>;
}
function Avatar({user,size="md"}){
 const u=user||{};
 const skin=u.skin||"#f2c7a5",shirt=u.shirt||"#5b7cff",pants=u.pants||"#202638",hair=u.hair||"#241b18",hat=u.hat||"none";
 return <div className={"avatar avatar-"+size} aria-label={u.name||"Avatar"}>
  <div className="avatar-hat">{hat==="cap"&&<span/>}{hat==="crown"&&<span>♛</span>}</div>
  <div className="avatar-head" style={{background:skin}}><i/><i/><b/></div>
  <div className="avatar-body" style={{background:shirt}}><span className="avatar-logo">E</span></div>
  <div className="avatar-arms"><i style={{background:skin}}/><i style={{background:skin}}/></div>
  <div className="avatar-legs"><i style={{background:pants}}/><i style={{background:pants}}/></div>
 </div>
}
function Chat(){
 const{user}=useUser();const[,t]=useLang();const[messages,setMessages]=useState(()=>read("eskadin-chat",[{"id":1,name:"Eskådin",text:"¡bienvenido a la comunidad! 👋"}]));
 const[text,setText]=useState("");
 const send=()=>{const v=text.trim();if(!v)return;const next=[...messages,{id:Date.now(),name:user?.name||"Guest",text:v,avatar:user||null}].slice(-100);setMessages(next);save("eskadin-chat",next);setText("")};
 return <main className="roblox-page chat-page">
  <div className="roblox-titlebar"><div><span className="roblox-kicker">COMMUNITY</span><h1>Chat</h1></div><Link className="roblox-pill" to="/games">{t.explore}</Link></div>
  <div className="chat-layout">
   <section className="chat-card"><div className="chat-head"><b>{t.communityTitle}</b><span>{messages.length} messages</span></div><div className="chat-messages">{messages.map(m=><div className="chat-message" key={m.id}><Avatar user={m.avatar||{name:m.name}} size="xs"/><div><b>{m.name}</b><p>{m.text}</p></div></div>)}</div><div className="chat-compose"><input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}} placeholder="Escribe un mensaje…"/><button onClick={send}>➤</button></div></section>
   <aside className="chat-side"><b>{t.online}</b><div className="online-user"><Avatar user={user||{name:"Guest"}} size="xs"/><span>{user?.name||"Guest"}<small>online</small></span></div><div className="chat-tip">sé amable con la gente y diviértete ✨</div></aside>
  </div>
 </main>
}

function Games(){const[,t]=useLang();const[games]=useGames();const[q,setQ]=useState("");const filtered=useMemo(()=>games.filter(g=>(g.title+" "+g.genre+" "+g.author).toLowerCase().includes(q.toLowerCase())),[games,q]);return <main className="page"><div className="page-head"><div><div className="eyebrow">{t.explore}</div><h1 className="page-title">{t.communityGames}</h1></div><Link className="button button-primary" to="/editor">{t.newGame}</Link></div><div className="toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search}/></div><div className="games-grid">{filtered.map(g=><Link className="game-card" to={"/games/"+g.id} key={g.id}><div className={"game-cover "+g.color}><span>{g.tag}</span></div><div className="game-info"><h3>{g.title}</h3><p>{g.genre} · {g.author}</p><b>♥ {g.likes.toLocaleString()} · {g.players.toLocaleString()} online</b></div></Link>)}</div></main>}

function Game(){const[,t]=useLang();const{id}=useParams();const[games,setGames]=useGames();const game=games.find(g=>String(g.id)===id)||null;const[liked,setLiked]=useState(false);useEffect(()=>{if(game){const viewKey="eskadin-viewed-"+game.id;if(!sessionStorage.getItem(viewKey)){sessionStorage.setItem(viewKey,"1");localStorage.setItem("eskadin-stat-views",String(Number(localStorage.getItem("eskadin-stat-views")||0)+1))}const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.explore){p.explore=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+12))}}},[id]);if(!game)return <main className="page narrow"><Link className="back" to="/games">← {t.back}</Link><div className="form-card"><h2>No hay juegos publicados todavía.</h2><p className="muted">Publica una experiencia desde una cuenta de desarrollador para poder explorarla.</p><Link className="button button-primary" to="/developer/register">{t.createDeveloper}</Link></div></main>;const toggleLike=()=>{if(liked){setLiked(false);setGames(gs=>gs.map(g=>String(g.id)===String(game.id)?{...g,likes:Math.max(0,Number(g.likes||0)-1)}:g));return}setLiked(true);setGames(gs=>gs.map(g=>String(g.id)===String(game.id)?{...g,likes:Number(g.likes||0)+1}:g));const p=read("eskadin-mission-progress",{play:false,explore:false,like:false});if(!p.like){p.like=true;save("eskadin-mission-progress",p);localStorage.setItem("eskadin-fc",String(Number(localStorage.getItem("eskadin-fc")||0)+5))}};return <main className="page"><Link className="back" to="/games">← {t.back}</Link><div className="game-hero"><div className={"game-cover big "+game.color}><span>{game.title}</span></div><div><div className="eyebrow">{game.tag} · {game.author}</div><h1 className="page-title">{game.title}</h1><p>{game.description}</p><p className="muted">{game.genre} · {game.players.toLocaleString()} playing · {Number(game.likes||0).toLocaleString()} likes</p><div className="actions"><Link className="button button-primary" to={"/games/"+game.id+"/play"}>▶ {t.play}</Link><button className="button button-ghost" onClick={toggleLike}>{liked?"♥":"♡"} {liked?t.liked:t.like}</button></div></div></div></main>}
function createEskadinR15Avatar(user={}){
 const root=new THREE.Group();root.name="EskadinR15";
 const hex=v=>{if(typeof v==="number")return v;const n=parseInt(String(v||"").replace("#",""),16);return Number.isFinite(n)?n:0xf2c7a5};
 const skin=new THREE.MeshStandardMaterial({color:hex(user.skin||"#f2c7a5"),roughness:.76,metalness:0});
 const shirt=new THREE.MeshStandardMaterial({color:hex(user.shirt||"#5b7cff"),roughness:.72,metalness:0});
 const pants=new THREE.MeshStandardMaterial({color:hex(user.pants||"#202638"),roughness:.8,metalness:0});
 const hair=new THREE.MeshStandardMaterial({color:hex(user.hairColor||"#241b18"),roughness:.68,metalness:0});
 const accessory=new THREE.MeshStandardMaterial({color:hex(user.accessoryColor||"#e95d6a"),roughness:.62,metalness:.08});
 const bone=(name,x,y,z,parent=root)=>{const g=new THREE.Group();g.name=name;g.position.set(x,y,z);parent.add(g);return g};
 const mesh=(p,name,w,h,d,mat,round=.06)=>{const g=new THREE.Group();g.name=name;const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat.clone());m.castShadow=true;m.receiveShadow=true;g.add(m);p.add(g);return g};
 const scaleX=Math.max(.78,Math.min(1.22,Number(user.bodyWidth)||1));
 const scaleY=Math.max(.88,Math.min(1.14,Number(user.bodyHeight)||1));
 const headScale=Math.max(.85,Math.min(1.18,Number(user.headScale)||1));
 const lowerTorso=bone("LowerTorso",0,1.47*scaleY,0);
 const upperTorso=bone("UpperTorso",0,.55*scaleY,0,lowerTorso);
 const neck=bone("Neck",0,.42*scaleY,0,upperTorso);
 const head=bone("Head",0,.36*scaleY,0,neck);
 const lUL=bone("LeftUpperLeg",-.27*scaleX,-.34*scaleY,0,lowerTorso),lLL=bone("LeftLowerLeg",0,-.59*scaleY,0,lUL),lF=bone("LeftFoot",0,-.56*scaleY,-.12,lLL);
 const rUL=bone("RightUpperLeg",.27*scaleX,-.34*scaleY,0,lowerTorso),rLL=bone("RightLowerLeg",0,-.59*scaleY,0,rUL),rF=bone("RightFoot",0,-.56*scaleY,-.12,rLL);
 const lUA=bone("LeftUpperArm",-.67*scaleX,.27*scaleY,0,upperTorso),lLA=bone("LeftLowerArm",0,-.55*scaleY,0,lUA),lH=bone("LeftHand",0,-.49*scaleY,0,lLA);
 const rUA=bone("RightUpperArm",.67*scaleX,.27*scaleY,0,upperTorso),rLA=bone("RightLowerArm",0,-.55*scaleY,0,rUA),rH=bone("RightHand",0,-.49*scaleY,0,rLA);
 mesh(lowerTorso,"LowerTorsoMesh",.86*scaleX,.50*scaleY,.48,shirt);
 mesh(upperTorso,"UpperTorsoMesh",1.02*scaleX,.68*scaleY,.52,shirt);
 const headMesh=mesh(head,"HeadMesh",.66*headScale,.68*headScale,.66*headScale,skin);
 mesh(lUL,"LeftUpperLegMesh",.44*scaleX,.68*scaleY,.46,pants);mesh(lLL,"LeftLowerLegMesh",.40*scaleX,.62*scaleY,.42,pants);mesh(lF,"LeftFootMesh",.46*scaleX,.22*scaleY,.72,pants);
 mesh(rUL,"RightUpperLegMesh",.44*scaleX,.68*scaleY,.46,pants);mesh(rLL,"RightLowerLegMesh",.40*scaleX,.62*scaleY,.42,pants);mesh(rF,"RightFootMesh",.46*scaleX,.22*scaleY,.72,pants);
 mesh(lUA,"LeftUpperArmMesh",.36*scaleX,.56*scaleY,.40,shirt);mesh(lLA,"LeftLowerArmMesh",.32*scaleX,.52*scaleY,.36,skin);mesh(lH,"LeftHandMesh",.34*scaleX,.28*scaleY,.34,skin);
 mesh(rUA,"RightUpperArmMesh",.36*scaleX,.56*scaleY,.40,shirt);mesh(rLA,"RightLowerArmMesh",.32*scaleX,.52*scaleY,.36,skin);mesh(rH,"RightHandMesh",.34*scaleX,.28*scaleY,.34,skin);
 const hairType=user.hair||"classic";
 if(hairType!=="none"){
  const h=new THREE.Mesh(new THREE.BoxGeometry(.72*headScale,.28*headScale,.70*headScale),hair.clone());h.position.set(0,.31*headScale,.02);h.scale.set(1,.72,1);h.castShadow=true;head.add(h);
 }
 const faceType=user.face||"smile";
 const face=new THREE.Group();face.name="Face";
 const eyeMat=new THREE.MeshBasicMaterial({color:0x151922});
 [-.13,.13].forEach(x=>{const eye=new THREE.Mesh(new THREE.SphereGeometry(.035*headScale,12,8),eyeMat);eye.position.set(x*headScale,.04,.325*headScale);face.add(eye)});
 if(faceType==="cool"){const glasses=new THREE.Mesh(new THREE.BoxGeometry(.42*headScale,.07,.035),new THREE.MeshStandardMaterial({color:0x111827,roughness:.3,metalness:.2}));glasses.position.set(0,.05,.345*headScale);face.add(glasses)}
 head.add(face);
 const hatType=user.hat||"none";
 if(hatType==="cap"){const cap=new THREE.Mesh(new THREE.BoxGeometry(.78*headScale,.16,.74*headScale),accessory.clone());cap.position.set(0,.48*headScale,.02);cap.castShadow=true;head.add(cap)}
 if(hatType==="crown"){const crown=new THREE.Mesh(new THREE.CylinderGeometry(.30*headScale,.38*headScale,.18*headScale,6),new THREE.MeshStandardMaterial({color:0xffd447,metalness:.65,roughness:.28}));crown.position.y=.50*headScale;crown.castShadow=true;head.add(crown)}
 const attachments={};const attach=(name,parent,pos)=>{const a=new THREE.Object3D();a.name=name;a.position.set(...pos);parent.add(a);attachments[name]=a};
 attach("HairAttachment",head,[0,.39*headScale,0]);attach("HatAttachment",head,[0,.44*headScale,0]);attach("FaceFrontAttachment",head,[0,0,.34*headScale]);attach("NeckAttachment",neck,[0,.03,0]);
 attach("RightShoulderAttachment",rUA,[0,.28*scaleY,0]);attach("LeftShoulderAttachment",lUA,[0,.28*scaleY,0]);attach("BodyFrontAttachment",upperTorso,[0,.1*scaleY,.27]);attach("BodyBackAttachment",upperTorso,[0,.1*scaleY,-.27]);attach("WaistCenterAttachment",lowerTorso,[0,-.22*scaleY,0]);
 root.userData.avatarParts=15;root.userData.r15=true;root.userData.height=3.13*scaleY;root.userData.scale={bodyWidth:scaleX,bodyHeight:scaleY,headScale};root.userData.attachments=attachments;
 root.userData.r15Joints=[["LowerTorso","UpperTorso"],["UpperTorso","Neck"],["Neck","Head"],["LowerTorso","LeftUpperLeg"],["LeftUpperLeg","LeftLowerLeg"],["LeftLowerLeg","LeftFoot"],["LowerTorso","RightUpperLeg"],["RightUpperLeg","RightLowerLeg"],["RightLowerLeg","RightFoot"],["UpperTorso","LeftUpperArm"],["LeftUpperArm","LeftLowerArm"],["LeftLowerArm","LeftHand"],["UpperTorso","RightUpperArm"],["RightUpperArm","RightLowerArm"],["RightLowerArm","RightHand"]];
 root.userData.animate=(time,moving,grounded)=>{const w=moving?Math.sin(time*9)*.55:0,idle=Math.sin(time*2.2)*.018;lUL.rotation.x=w;rUL.rotation.x=-w;lLL.rotation.x=Math.max(0,-w)*.45;rLL.rotation.x=Math.max(0,w)*.45;lF.rotation.x=-w*.18;rF.rotation.x=w*.18;lUA.rotation.x=-w*.7;rUA.rotation.x=w*.7;lLA.rotation.x=Math.abs(w)*.18;rLA.rotation.x=Math.abs(w)*.18;upperTorso.rotation.z=idle*.45;neck.rotation.z=idle*.2;if(!grounded){lUL.rotation.x=-.18;rUL.rotation.x=.18;lUA.rotation.x=.28;rUA.rotation.x=-.28}};
 return root;
}
function GameRuntime({game,onExit,onRestart}){const[,t]=useLang();
 const{user}=useUser();
 const[chatOpen,setChatOpen]=useState(false);
 const[chatText,setChatText]=useState("");
 const[chatMessages,setChatMessages]=useState(()=>read(`eskadin-experience-chat-${game?.id||"unknown"}`,[]));
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
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.style.cssText="width:100%;height:100%;display:block;touch-action:none";
  host.replaceChildren(renderer.domElement);

  scene3.add(new THREE.HemisphereLight(0xd9ecff,0x17202e,1.8));
  const sun=new THREE.DirectionalLight(0xffffff,2.5);sun.position.set(8,14,6);sun.castShadow=true;scene3.add(sun);

  const storedProject=game?.projectId?getProject(game.projectId):null;
  const legacyProject=read("eskadin-project",null);
  const project=storedProject||legacyProject;
  const rawScene=Array.isArray(game?.scene)?game.scene:Array.isArray(project?.scene)?project.scene:[];
  const source=rawScene.filter(o=>o&&typeof o==="object"&&typeof o.type==="string");
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
  const stepHeight=.32;
  const colliders=world.filter(m=>!["light","camera","spawn","sound","text"].includes(m.userData.runtimeType));
  const colliderBoxes=colliders.flatMap(m=>{const parts=m.userData.colliderParts||[m];return parts.map(part=>{const box=new THREE.Box3().setFromObject(part);return {mesh:part,box}})});
  let floorY=0;
  for(const c of colliderBoxes){
   const type=c.mesh.userData.runtimeType;
   if(type==="floor"||type==="plane"||type==="runtime-ground"){
    floorY=Math.max(floorY,c.box.max.y);
   }
  }
  const fallbackFloor=source.length?0:0;

  const player=createEskadinR15Avatar(read("eskadin-user",{})||{});
  player.position.set(0,floorY,4);
  player.scale.setScalar(.72);
  scene3.add(player);

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
  let yaw=Math.PI,pitch=-.12,last=performance.now(),raf=0;
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
   player.userData.animate?.(now/1000,move.lengthSq()>0.02,grounded);
   player.rotation.y=yaw;
   camera.position.set(player.position.x,player.position.y+1.52,player.position.z+0.08);
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
  <button type="button" className="runtime-chat-button" aria-label={t.chat} aria-expanded={chatOpen} onClick={()=>{setChatOpen(v=>!v);setMenuOpen(false)}}>💬</button>
  {chatOpen&&<div className="runtime-chat-panel">
   <div className="runtime-chat-head"><b>{t.chat}</b><button type="button" onClick={()=>setChatOpen(false)}>×</button></div>
   <div className="runtime-chat-messages">{chatMessages.slice(-40).map(m=><div className="runtime-chat-message" key={m.id}><b>{m.name}</b><span>{m.text}</span></div>)}</div>
   <form className="runtime-chat-compose" onSubmit={e=>{e.preventDefault();const v=chatText.trim();if(!v)return;const next=[...chatMessages,{id:Date.now(),name:user?.name||"Guest",text:v}].slice(-100);setChatMessages(next);save(`eskadin-experience-chat-${game?.id||"unknown"}`,next);setChatText("")}}>
    <input value={chatText} onChange={e=>setChatText(e.target.value)} placeholder="Escribe…"/>
    <button type="submit">➤</button>
   </form>
  </div>}
  <button type="button" className="runtime-menu-button" aria-label="Eskådin Stüdis menu" aria-expanded={menuOpen} onClick={toggleMenu}><span className="runtime-logo-mark">E</span></button>
  {menuOpen&&<div className="runtime-pause-menu" role="dialog" aria-label={t.menu}>
   <button type="button" onClick={continueGame}>{t.continueGame}</button>
   <button type="button" onClick={onRestart}>{t.restart}</button>
   <button type="button" onClick={onExit}>{t.exit}</button>
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
 const colors={light:0xffd54a,spawn:0x6aa7ff,camera:0xa78bfa,sound:0xff62b5,text:0xf2f4f8,wall:0x71809a,sphere:0x6fd3ff,cylinder:0x8de08b,cone:0xff9f68,torus:0xd99cff,plane:0x8f9aaa,capsule:0xff7eb6,floor:0x59697d,fence:0xc68b5b,stairs:0x8f9aaa};
 const material=new THREE.MeshStandardMaterial({color:o.color||colors[o.type]||0x71809a,roughness:o.roughness??.55,metalness:o.metalness??.2});
 let root;
 if(o.type==="fence"){
  root=new THREE.Group();
  const postMat=material.clone(),railMat=material.clone();
  for(let x of [-1.8,0,1.8]){
   const post=new THREE.Mesh(new THREE.BoxGeometry(.18,1.6,.18),postMat);
   post.position.set(x,.8,0);root.add(post);
  }
  for(const y of [.48,1.12]){
   const rail=new THREE.Mesh(new THREE.BoxGeometry(3.8,.12,.12),railMat);
   rail.position.set(0,y,0);root.add(rail);
  }
 }else if(o.type==="stairs"){
  root=new THREE.Group();
  const steps=8,stepW=3.2,stepD=.52,stepH=.25;
  for(let i=0;i<steps;i++){
   const step=new THREE.Mesh(new THREE.BoxGeometry(stepW,(i+1)*stepH,stepD),material.clone());
   step.position.set(0,(i+1)*stepH*.5,i*stepD);
   root.add(step);
  }
 }else{
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
  root=new THREE.Mesh(geometry,material);
  if(o.type==="floor")root.rotation.x=-Math.PI/2;
 }
 root.position.set(Number.isFinite(Number(o.x))?Number(o.x):0,Number.isFinite(Number(o.y))?Number(o.y):0,Number.isFinite(Number(o.z))?Number(o.z):0);
 root.rotation.set(THREE.MathUtils.degToRad(Number.isFinite(Number(o.rx))?Number(o.rx):0),THREE.MathUtils.degToRad(Number.isFinite(Number(o.ry))?Number(o.ry):0),THREE.MathUtils.degToRad(Number.isFinite(Number(o.rz))?Number(o.rz):0));
 root.scale.setScalar(THREE.MathUtils.clamp(Number.isFinite(Number(o.s))?Number(o.s):1,.05,10));
 root.userData.objectId=o.id;
 root.userData.runtimeType=o.type;
 root.userData.colliderParts=(o.type==="stairs"||o.type==="fence")?[]:null;
 root.traverse(child=>{
  child.userData.objectId=o.id;
  child.userData.runtimeType=o.type==="stairs"?"stair-step":o.type;
  if(child.isMesh){
   child.castShadow=true;child.receiveShadow=true;
   if(root.userData.colliderParts)root.userData.colliderParts.push(child);
  }
 });
 return root;
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
   host.__eskadinZoom=(direction)=>{if(direction>0)orbit.dollyIn(1.2);else orbit.dollyOut(1.2);orbit.update()};
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
   sceneRef.current.forEach(o=>{const m=meshFor(o);m.traverse(child=>{if(child.material)child.material.wireframe=wireframe});scene3.add(m);objects.push(m);objectMap.set(o.id,m)});
   objectMapRef.current=objectMap;
   const raycaster=new THREE.Raycaster();
   const pointer=new THREE.Vector2();
   const pick=(e)=>{
     if(transform.dragging)return;
     const rect=renderer.domElement.getBoundingClientRect();
     pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
     pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
     raycaster.setFromCamera(pointer,camera);
     const hit=raycaster.intersectObjects(objects,true)[0];
     if(hit?.object?.userData?.objectId!=null){const id=hit.object.userData.objectId;const owner=objectMap.get(id);setSelected(id);if(owner)transform.attach(owner)}
   };
   renderer.domElement.addEventListener("pointerdown",pick);
   const sync=()=>{
     const id=transform.object?.userData?.objectId;
     if(id==null)return;
     const m=transform.object;
     const q=n=>snap?Math.round(n*2)/2:n;
     const scale=THREE.MathUtils.clamp(Number.isFinite(m.scale.x)?m.scale.x:1,.05,10);
     upd(id,{x:q(Number(m.position.x.toFixed(3))),y:q(Number(m.position.y.toFixed(3))),z:q(Number(m.position.z.toFixed(3))),rx:Number(THREE.MathUtils.radToDeg(m.rotation.x).toFixed(2)),ry:Number(THREE.MathUtils.radToDeg(m.rotation.y).toFixed(2)),rz:Number(THREE.MathUtils.radToDeg(m.rotation.z).toFixed(2)),s:Number(scale.toFixed(3))});
   };
   const clampScale=()=>{
     const m=transform.object;
     if(!m||toolRef.current!=="scale")return;
     const scale=THREE.MathUtils.clamp(Number.isFinite(m.scale.x)?m.scale.x:1,.05,10);
     m.scale.setScalar(scale);
   };
   const onObjectChange=()=>{if(toolRef.current==="scale"){clampScale();sync();}};
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
   return()=>{delete host.__eskadinZoom;cancelAnimationFrame(raf);ro.disconnect();renderer.domElement.removeEventListener("pointerdown",pick);transform.removeEventListener("objectChange",onObjectChange);transform.removeEventListener("dragging-changed",onDraggingChanged);transform.dispose();orbit.dispose();renderer.dispose();scene3.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})};
 },[scene.length,grid,wireframe,showAxes,snap]);
 useEffect(()=>{const t=transformRef.current;if(t){t.setMode(tool==="rotate"?"rotate":tool==="scale"?"scale":"translate");if(tool==="select")t.detach();else{const o=objectMapRef.current.get(selectedRef.current);if(o)t.attach(o)}}},[tool]); useEffect(()=>{scene.forEach(o=>{const m=objectMapRef.current.get(o.id);if(m){m.position.set(o.x,o.y,o.z);m.rotation.set(THREE.MathUtils.degToRad(o.rx),THREE.MathUtils.degToRad(o.ry),THREE.MathUtils.degToRad(o.rz));m.scale.setScalar(o.s);m.traverse(child=>{if(child.isMesh&&child.material){if(o.color)child.material.color.set(o.color);child.material.roughness=o.roughness??child.material.roughness;child.material.metalness=o.metalness??child.material.metalness}})}})},[scene]);
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
const PROJECTS_KEY="eskadin-projects";
function projectList(){return read(PROJECTS_KEY,[]).filter(p=>p&&p.id&&Array.isArray(p.scene))}
function saveProjectList(list){save(PROJECTS_KEY,list)}
function createProjectRecord(name="Nuevo juego"){const now=Date.now();return{id:"project-"+now,name:name.trim()||"Nuevo juego",description:"",scene:JSON.parse(JSON.stringify(sceneSeed)),createdAt:new Date(now).toISOString(),updatedAt:new Date(now).toISOString(),published:false}}
function getProject(id){return projectList().find(p=>String(p.id)===String(id))||null}
function StudioProjects(){
 const[,t]=useLang();const[projects,setProjects]=useState(()=>projectList());
 const open=id=>{window.location.href="/editor?project="+encodeURIComponent(id)};
 const make=()=>{const p=createProjectRecord("Nuevo juego");const next=[p,...projectList()];saveProjectList(next);setProjects(next);open(p.id)};
 const remove=id=>{const next=projectList().filter(p=>p.id!==id);saveProjectList(next);setProjects(next);};
 return <main className="page studio-projects-page"><div className="page-head"><div><div className="eyebrow">STUDIO</div><h1 className="page-title">Mis juegos</h1><p className="muted">Cada juego tiene su propio slot con nombre, escena y contenido guardado.</p></div><button className="button button-primary" onClick={make}>＋ Nuevo juego</button></div><div className="studio-project-grid">{projects.map(p=><article className="studio-project-card" key={p.id}><div className="studio-project-thumb"><span>3D</span></div><div className="studio-project-card-body"><h2>{p.name}</h2><p>{p.description||"Sin descripción"}</p><small>Actualizado {new Date(p.updatedAt).toLocaleString()}</small><div className="actions"><button className="button button-primary" onClick={()=>open(p.id)}>Abrir Studio</button><button className="button button-ghost" onClick={()=>remove(p.id)}>Eliminar</button></div></div></article>)}</div>{!projects.length&&<div className="form-card"><h2>{t.noProjects}</h2><button className="button button-primary" onClick={make}>＋ Nuevo juego</button></div>}</main>
}
function Editor(){useStudioFullscreenLock();
 const[lang,t]=useLang();const{setLang}=useContext(LangContext);
 const[sidebarOpen,setSidebarOpen]=useState(false);
 const navigate=useNavigate();
 const[projectId,setProjectId]=useState(()=>new URLSearchParams(window.location.search).get("project")||projectList()[0]?.id||null);
 const[projects,setProjects]=useState(()=>projectList());
 const[scene,setScene]=useState(()=>{const id=new URLSearchParams(window.location.search).get("project")||projectList()[0]?.id;return id?(getProject(id)?.scene||sceneSeed):sceneSeed});
 const[currentName,setCurrentName]=useState(()=>getProject(new URLSearchParams(window.location.search).get("project")||projectList()[0]?.id)?.name||"Nuevo juego");
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
 const add=type=>{const id=Date.now();const defaults={wall:[0,1,0],cube:[0,.5,0],sphere:[0,.75,0],cylinder:[0,.75,0],cone:[0,.75,0],torus:[0,.75,0],capsule:[0,.7,0],plane:[0,0,0],floor:[0,0,0],fence:[0,.8,0],stairs:[0,0,0],light:[2,3,2],sound:[0,1,2],spawn:[-2,.6,0],camera:[3,2,4],text:[0,1,0]};const p=defaults[type]||[0,.5,0];const item={id,type,name:type.charAt(0).toUpperCase()+type.slice(1)+" "+(scene.length+1),x:p[0],y:p[1],z:p[2],rx:0,ry:0,rz:0,s:1,color:null,roughness:.55,metalness:.2};setScene(s=>[...s,item]);setSelected(id)};
 const saveScene=()=>{
  const id=projectId||"project-"+Date.now();
  const existing=projectList();
  const record={id,name:currentName.trim()||"Nuevo juego",description:getProject(id)?.description||"",scene,createdAt:getProject(id)?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),published:getProject(id)?.published||false};
  const next=[record,...existing.filter(p=>p.id!==id)];
  saveProjectList(next);save("eskadin-scene",scene);save("eskadin-project",record);
  setProjectId(id);setProjects(next);window.history.replaceState(null,"","/editor?project="+encodeURIComponent(id));
  setSaved(true);setTimeout(()=>setSaved(false),1000);
 };
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
 const objectCatalog={
 es:[["cube","Cubo"],["wall","Pared"],["sphere","Esfera"],["cylinder","Cilindro"],["cone","Cono"],["torus","Toro"],["capsule","Cápsula"],["plane","Plano"],["floor","Suelo"],["fence","Valla"],["stairs","Escaleras"],["light","Luz"],["sound","Sonido"],["spawn","Punto de aparición"],["camera","Cámara"],["text","Texto"]],
 en:[["cube","Cube"],["wall","Wall"],["sphere","Sphere"],["cylinder","Cylinder"],["cone","Cone"],["torus","Torus"],["capsule","Capsule"],["plane","Plane"],["floor","Floor"],["fence","Fence"],["stairs","Stairs"],["light","Light"],["sound","Sound"],["spawn","Spawn"],["camera","Camera"],["text","Text"]],
 sv:[["cube","Kub"],["wall","Vägg"],["sphere","Sfär"],["cylinder","Cylinder"],["cone","Kon"],["torus","Toroid"],["capsule","Kapsel"],["plane","Plan"],["floor","Golv"],["fence","Staket"],["stairs","Trappa"],["light","Ljus"],["sound","Ljud"],["spawn","Startpunkt"],["camera","Kamera"],["text","Text"]],
 de:[["cube","Würfel"],["wall","Wand"],["sphere","Kugel"],["cylinder","Zylinder"],["cone","Kegel"],["torus","Torus"],["capsule","Kapsel"],["plane","Ebene"],["floor","Boden"],["fence","Zaun"],["stairs","Treppe"],["light","Licht"],["sound","Ton"],["spawn","Spawn"],["camera","Kamera"],["text","Text"]],
 fr:[["cube","Cube"],["wall","Mur"],["sphere","Sphère"],["cylinder","Cylindre"],["cone","Cône"],["torus","Tore"],["capsule","Capsule"],["plane","Plan"],["floor","Sol"],["fence","Barrière"],["stairs","Escaliers"],["light","Lumière"],["sound","Son"],["spawn","Apparition"],["camera","Caméra"],["text","Texte"]]
};
const groups=objectCatalog[lang]||objectCatalog.en;
 return <main className="page editor-page">
  <button type="button" className="studio-menu-button" title={sidebarOpen?"Close Studio menu":"Open Studio menu"} aria-label={t.add} onClick={()=>setSidebarOpen(v=>!v)}>{sidebarOpen?"×":"☰"}</button>
  {sidebarOpen&&<button type="button" className="studio-sidebar-backdrop" aria-label="Close menu" onClick={()=>setSidebarOpen(false)}/>} 
  <div className={"editor-shell "+(sidebarOpen?"sidebar-open":"")}>

   <aside className="studio-sidebar" aria-hidden={!sidebarOpen}>
    <div className="studio-sidebar-head"><div className="studio-sidebar-brand">Eskådin<br/><span>Stüdis</span></div><strong className="studio-project-side">{t.newGame}</strong></div><div className="studio-project-manager">
 <select value={projectId||""} onChange={e=>{const id=e.target.value;if(!id)return;const p=getProject(id);if(p){setProjectId(id);setCurrentName(p.name);setScene(p.scene||sceneSeed);window.history.replaceState(null,"","/editor?project="+encodeURIComponent(id));}}}>
  {projects.length===0&&<option value="">Sin proyectos</option>}
  {projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
 </select>
 <div className="studio-project-manager-actions">
  <button title="Nuevo juego" onClick={()=>{const p=createProjectRecord("Nuevo juego");const next=[p,...projectList()];saveProjectList(next);setProjects(next);setProjectId(p.id);setCurrentName(p.name);setScene(p.scene);window.history.replaceState(null,"","/editor?project="+encodeURIComponent(p.id));}}>＋ Nuevo</button>
  <button title="Renombrar juego" onClick={()=>{const name=window.prompt("Nombre del juego",currentName);if(name?.trim()){setCurrentName(name.trim());}}}>✎ Renombrar</button>
 </div>
 </div><div className="studio-sidebar-actions studio-nav-actions"><Link title={t.back} to="/home">⌂ {t.back}</Link><Link title={t.explore} to="/games">▶ {t.explore}</Link></div><div className="studio-sidebar-section">{t.language}</div><select className="studio-language" value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select>
    <div className="studio-sidebar-actions">
     <button title={t.add} onClick={()=>setPanel("create")}>＋ {t.objects}</button><button title={t.hierarchy} onClick={()=>setPanel("scene")}>☷ {t.hierarchy}</button><Link title="Object Studio" to="/object-studio">◈ Object Studio</Link><button title={t.scene} onClick={()=>setPanel("scene")}>◉ {t.scene}</button>
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
    <div className="studio-panel-preview">{panel==="create"&&<><strong>{t.objects}</strong><div className="studio-object-grid">{groups.map(([type,label])=><button key={type} title={label} aria-label={label} onClick={()=>add(type)}>{label}</button>)}</div></>}{panel==="scene"&&<><strong>{t.hierarchy}</strong><div className="studio-scene-list">{scene.map(o=><button key={o.id} title={o.name} className={selected===o.id?"active":""} onClick={()=>setSelected(o.id)}>{o.name}</button>)}</div></>}</div><div className="studio-sidebar-spacer"/>
    <div className="studio-sidebar-actions bottom-actions">
     <button title={t.fullscreen} onClick={toggleFullscreen}>⛶ {t.fullscreen}</button><button title={t.save} onClick={saveScene}>✓ {saved?t.save:t.save}</button><Link title={t.publish} className="studio-publish" to="/publish">↗ {t.publish}</Link>
    </div>
   </aside>
   <div className="editor-main" onClick={()=>sidebarOpen&&setSidebarOpen(false)}>
    <div className="editor-workspace">
     <section className="editor-center">
      <div className="viewport-project"><strong>{currentName}</strong><span>● {t.local} · {scene.length} {t.objectsCount}</span></div>
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

function Publish(){const[,t]=useLang();const[games,setGames]=useGames();const{developer}=useUser();const nav=useNavigate();const[name,setName]=useState("My new game");const[desc,setDesc]=useState("A new Eskådin Stüdis experience.");const[done,setDone]=useState(false);const blocked=blockedIdentity(name);const go=()=>{if(blocked)return;const current=read("eskadin-project",null);const projects=projectList();const active=current?.id?getProject(current.id):projects[0]||null;const publishedScene=Array.isArray(active?.scene)?JSON.parse(JSON.stringify(active.scene)):[];const gameRecord={id:Date.now(),projectId:active?.id||null,scene:publishedScene,title:name.trim()||"My new game",genre:"3D Experience",tag:"New",color:"violet",players:0,likes:0,author:developer?.name||"Eskådin Studio",description:desc};setGames(g=>[...g,gameRecord]);setDone(true)};if(!developer)return <main className="page narrow"><div className="form-card"><div className="eyebrow">{t.developer}</div><h1 className="page-title">{t.developerRequired}</h1><p className="muted">{t.developerRequiredText}</p><button className="button button-primary" onClick={()=>nav("/developer/register")}>{t.createDeveloper}</button></div></main>;return <main className="page narrow"><div className="eyebrow">{t.publish}</div><h1 className="page-title">{done?t.published:t.publish}</h1>{done?<div className="success-card"><b>✓ {t.publish}</b><p>{t.localCatalog}</p><Link className="button button-primary" to="/games">{t.explore}</Link></div>:<div className="form-card"><label>{t.name}<input value={name} onChange={e=>setName(e.target.value)}/></label>{blocked&&<p className="error">{t.reservedName}</p>}<label>{t.description}<textarea value={desc} onChange={e=>setDesc(e.target.value)}/></label><label>{t.settings}<select><option>{t.public}</option><option>{t.private}</option></select></label><button className="button button-primary" disabled={blocked} onClick={go}>{t.publish} · 0€</button><p className="muted">{t.earnedOnly}</p></div>}</main>}

function Missions(){const[,t]=useLang();const[balance,setBalance]=useState(()=>Number(localStorage.getItem("eskadin-fc")||0));const[progress,setProgress]=useState(()=>read("eskadin-mission-progress",{play:false,explore:false,like:false}));const ms=[["play","Play an experience",8],["explore","Open an experience page",12],["like","Like an experience",5]];useEffect(()=>{const sync=()=>{setProgress(read("eskadin-mission-progress",{play:false,explore:false,like:false}));setBalance(Number(localStorage.getItem("eskadin-fc")||0))};sync();const id=setInterval(sync,400);return()=>clearInterval(id)},[]);return <main className="page"><div className="eyebrow">{t.missions}</div><h1 className="page-title">F¢ missions</h1><div className="wallet-banner"><b>{balance} F¢</b><span>{t.earnCurrency}</span><Link to="/wallet">{t.wallet}</Link></div><div className="mission-grid">{ms.map(([id,title,n])=><div className="mission-card" key={id}><span>MISSION</span><h3>{title}</h3><strong>+{n} F¢</strong><Link className="button button-primary" to="/games">{progress[id]?"✓ Completed":"Go do it →"}</Link></div>)}</div></main>}

function Wallet(){const[,t]=useLang();const balance=Number(localStorage.getItem("eskadin-fc")||0);return <main className="page narrow"><div className="eyebrow">{t.wallet}</div><h1 className="page-title">{balance} F¢</h1><div className="form-card"><h2>{t.platformCurrencyTitle}</h2><p className="muted">F¢ can only be earned through platform gameplay missions. It cannot be purchased, withdrawn or converted to real money.</p><Link className="button button-primary" to="/missions">{t.missions}</Link></div></main>}

function Projects(){const[,t]=useLang();const project=read("eskadin-project",null);return <main className="page"><div className="eyebrow">{t.projects}</div><h1 className="page-title">{t.yourProjects}</h1>{project?<div className="dashboard-grid"><Link className="dash" to="/editor"><b>{project.name}</b><span>Local editable scene · {project.scene?.length||0} objects · {new Date(project.updatedAt).toLocaleString()}</span></Link></div>:<div className="form-card"><h2>{t.noProjects}</h2><p className="muted">{t.saveSceneHint}</p><Link className="button button-primary" to="/editor">{t.openEditor}</Link></div>}</main>}

function Statistics(){const[,t]=useLang();const[games]=useGames();const views=Number(localStorage.getItem("eskadin-stat-views")||0);const sessions=Number(localStorage.getItem("eskadin-stat-sessions")||0);const likes=games.reduce((n,g)=>n+Number(g.likes||0),0);return <main className="page"><div className="eyebrow">{t.statistics}</div><h1 className="page-title">{t.statistics}</h1><div className="stats-grid"><div><b>{views.toLocaleString()}</b><span>{t.gameViews}</span></div><div><b>{likes.toLocaleString()}</b><span>Likes</span></div><div><b>{sessions.toLocaleString()}</b><span>{t.playSessions}</span></div><div><b>{games.length.toLocaleString()}</b><span>{t.publishedGames}</span></div></div><div className="form-card"><p className="muted">{t.localStats}</p></div></main>}

const AVATAR_ITEMS=[
 {id:"hair-classic",name:"Cabello clásico",category:"Cabello",price:0,kind:"hair",value:"classic",glyph:"◒"},
 {id:"hair-short",name:"Cabello corto",category:"Cabello",price:35,kind:"hair",value:"short",glyph:"◓"},
 {id:"face-smile",name:"Cara sonriente",category:"Cara",price:0,kind:"face",value:"smile",glyph:"☺"},
 {id:"face-cool",name:"Cara cool",category:"Cara",price:60,kind:"face",value:"cool",glyph:"😎"},
 {id:"hat-cap",name:"Gorra azul",category:"Sombreros",price:50,kind:"hat",value:"cap",glyph:"🧢"},
 {id:"hat-crown",name:"Corona",category:"Sombreros",price:120,kind:"hat",value:"crown",glyph:"♛"},
 {id:"shirt-blue",name:"Camiseta azul",category:"Camisas",price:0,kind:"shirt",value:"#5b7cff",glyph:"▣"},
 {id:"shirt-red",name:"Camiseta roja",category:"Camisas",price:45,kind:"shirt",value:"#e95d6a",glyph:"▣"},
 {id:"pants-dark",name:"Pantalón oscuro",category:"Pantalones",price:0,kind:"pants",value:"#202638",glyph:"▤"},
 {id:"pants-green",name:"Pantalón verde",category:"Pantalones",price:45,kind:"pants",value:"#29352d",glyph:"▤"},
 {id:"skin-warm",name:"Tono cálido",category:"Cuerpo",price:0,kind:"skin",value:"#f2c7a5",glyph:"●"},
 {id:"skin-brown",name:"Tono marrón",category:"Cuerpo",price:0,kind:"skin",value:"#8d5524",glyph:"●"}
];
function avatarOwned(){return read("eskadin-owned-avatar-items",AVATAR_ITEMS.filter(i=>i.price===0).map(i=>i.id))}
function saveAvatarItem(id){const ids=avatarOwned();if(!ids.includes(id)){ids.push(id);save("eskadin-owned-avatar-items",ids)}}
function updateAvatarItem(user,item){
 const next={...(user||{name:"Eskådin Player"})};
 next[item.kind]=item.value;
 return next;
}

const AVATAR_ASSET_TYPES={
 rigid:[
  ["Hair","Cabello"],
  ["Hat","Sombrero"],
  ["Face","Cara"],
  ["Neck","Cuello"],
  ["Shoulder","Hombro"],
  ["Front","Frontal"],
  ["Back","Espalda"],
  ["Waist","Cintura"]
 ],
 layered:[
  ["TShirt","Camiseta 3D"],
  ["Shirt","Camisa"],
  ["Sweater","Jersey"],
  ["Pants","Pantalón 3D"],
  ["DressSkirt","Vestido / Falda"],
  ["Shorts","Shorts"],
  ["Shoes","Zapatos"]
 ],
 classic:[
  ["ClassicTShirt","Camiseta clásica"],
  ["ClassicShirt","Camisa clásica"],
  ["ClassicPants","Pantalón clásico"]
 ]
};
const AVATAR_ATTACHMENT_NAMES={
 Hair:"HairAttachment",Hat:"HatAttachment",Face:"FaceFrontAttachment",Neck:"NeckAttachment",
 Shoulder:"RightShoulderAttachment",Front:"BodyFrontAttachment",Back:"BodyBackAttachment",Waist:"WaistCenterAttachment"
};
const createdAvatarItems=()=>read("eskadin-created-avatar-items",[]);
const saveCreatedAvatarItems=items=>save("eskadin-created-avatar-items",items);
const avatarCustomOwned=()=>read("eskadin-owned-created-avatar-items",[]);
const saveAvatarCustomOwned=ids=>save("eskadin-owned-created-avatar-items",ids);
const avatarItemLabel=item=>item?.assetType==="rigid"?"Accesorio rígido":item?.assetType==="layered"?"Ropa en capas":"Ropa clásica";

function ObjectStudio(){
 const[,t]=useLang();
 const{developer}=useUser();
 const[assetType,setAssetType]=useState("layered");
 const[category,setCategory]=useState("TShirt");
 const[name,setName]=useState("Mi creación");
 const[description,setDescription]=useState("");
 const[price,setPrice]=useState(0);
 const[animClip,setAnimClip]=useState("idle");
 const[frame,setFrame]=useState(0);
 const[created,setCreated]=useState(false);
 const categories={
  layered:[["TShirt","Camiseta 3D"],["Shirt","Camisa"],["Sweater","Jersey"],["Pants","Pantalón 3D"],["DressSkirt","Vestido / Falda"],["Shorts","Shorts"],["Shoes","Zapatos"]],
  rigid:[["Hair","Cabello"],["Hat","Sombrero"],["Face","Cara"],["Neck","Cuello"],["Shoulder","Hombro"],["Front","Frontal"],["Back","Espalda"],["Waist","Cintura"]],
  classic:[["ClassicTShirt","Camiseta clásica"],["ClassicShirt","Camisa clásica"],["ClassicPants","Pantalón clásico"]],
  animation:[["Idle","Idle"],["Walk","Caminar"],["Run","Correr"],["Jump","Saltar"],["Fall","Caer"],["Emote","Emote"]]
 };
 const convert=()=>{
  const now=Date.now();
  const item={id:"asset-"+now,name:name.trim()||"Creación de Eskådin",description:description.trim(),creator:developer?.name||"Eskådin Creator",assetType,subtype:category,animation:assetType==="animation"?{clip:animClip,frames:Math.max(1,Number(frame)||1)}:null,price:Math.max(0,Math.floor(Number(price)||0)),status:"published",createdAt:new Date(now).toISOString()};
  const next=[item,...createdAvatarItems()];saveCreatedAvatarItems(next);
  const owned=avatarCustomOwned();if(!owned.includes(item.id))saveAvatarCustomOwned([...owned,item.id]);
  setCreated(true);setTimeout(()=>setCreated(false),1800);
 };
 const isAnim=assetType==="animation";
 const previewClass="object-studio-creator-preview";
 return <main className="object-studio-page">
  <header className="object-studio-header">
   <div><span className="roblox-kicker">OBJECT STUDIO</span><h1>Crea ropa, accesorios y animaciones</h1><p>Un creador de artículos de avatar, no un editor de mapas.</p></div>
   <div className="object-studio-header-actions"><Link className="roblox-pill" to="/avatar">Avatar</Link><Link className="roblox-pill" to="/marketplace">Mercado</Link></div>
  </header>
  <div className="object-studio-layout object-studio-creator-layout">
   <aside className="object-studio-panel">
    <div className="object-studio-panel-title">1 · Tipo de creación</div>
    <div className="object-studio-type-grid">
     <button className={assetType==="layered"?"chosen":""} onClick={()=>{setAssetType("layered");setCategory("TShirt")}}>👕 Ropa en capas</button>
     <button className={assetType==="classic"?"chosen":""} onClick={()=>{setAssetType("classic");setCategory("ClassicTShirt")}}>🖼️ Ropa clásica</button>
     <button className={assetType==="rigid"?"chosen":""} onClick={()=>{setAssetType("rigid");setCategory("Hat")}}>🎩 Accesorio</button>
     <button className={assetType==="animation"?"chosen":""} onClick={()=>{setAssetType("animation");setCategory("Idle")}}>🕺 Animación</button>
    </div>
    <div className="object-studio-panel-title">2 · Categoría</div>
    <select value={category} onChange={e=>setCategory(e.target.value)}>
     {categories[assetType].map(([v,l])=><option key={v} value={v}>{l}</option>)}
    </select>
    {!isAnim&&<div className="object-studio-creator-tools">
     <button>＋ Añadir forma</button><button>◈ Añadir malla</button><button>▧ Textura</button><button>✥ Ajustar al avatar</button>
     <p className="object-studio-tool-note">El maniquí R15 queda siempre visible para crear y ajustar el artículo directamente sobre el avatar.</p>
    </div>}
    {isAnim&&<div className="object-studio-creator-tools">
     <button onClick={()=>setFrame(f=>Math.max(0,f-1))}>◀ Frame</button><button onClick={()=>setFrame(f=>f+1)}>Frame ▶</button><button onClick={()=>setFrame(0)}>↺ Inicio</button>
    </div>}
   </aside>
   <section className="object-studio-preview">
    <div className="object-studio-preview-bar"><b>{isAnim?"EDITOR DE ANIMACIÓN":"EDITOR DE AVATAR"}</b><span>{isAnim?animClip:"Vista previa sobre R15"}</span></div>
    <div className={previewClass}>
     <R15AvatarPreview user={developer||{name:"Eskådin Player"}} size="xl"/>
     <div className="creator-preview-grid"/>
    </div>
    {isAnim&&<div className="object-studio-timeline"><span>0</span><input type="range" min="0" max="120" value={frame} onChange={e=>setFrame(e.target.value)}/><span>{frame}</span><button onClick={()=>setFrame(0)}>▶︎ Preview</button></div>}
   </section>
   <aside className="object-studio-panel object-studio-inspector">
    <div className="object-studio-panel-title">3 · Publicación</div>
    <label>Nombre<input value={name} onChange={e=>setName(e.target.value)} placeholder="Nombre del artículo"/></label>
    <label>Descripción<textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe tu creación…"/></label>
    {isAnim?<><label>Animación<select value={animClip} onChange={e=>setAnimClip(e.target.value)}><option value="idle">Idle</option><option value="walk">Caminar</option><option value="run">Correr</option><option value="jump">Saltar</option><option value="fall">Caer</option><option value="emote">Emote</option></select></label><div className="object-studio-checks"><span>✓ Rig R15</span><span>✓ Timeline</span><span>✓ Poses por frame</span></div></>:<div className="object-studio-checks"><span>✓ Previsualización en avatar</span><span>✓ Tipo: {categories[assetType].find(([v])=>v===category)?.[1]}</span>{assetType==="layered"&&<span>✓ Preparado para rigging, cages y attachments</span>}</div>}
    <label>Precio F¢<input type="number" min="0" step="1" value={price} onChange={e=>setPrice(e.target.value)}/></label>
    <button className="button button-primary object-studio-generate" onClick={convert}>{created?"✓ Publicado en Mercado":"Publicar creación"}</button>
    <p className="object-studio-note">Las creaciones se guardan en el Mercado local de Eskådin y quedan asociadas a tu inventario en este dispositivo.</p>
   </aside>
  </div>
 </main>
}
function AvatarEditor(){
 const[,t]=useLang();const{user,login}=useUser();const current=user||{name:"Eskådin Player",skin:"#f2c7a5",shirt:"#5b7cff",pants:"#202638",hair:"classic",face:"smile",hat:"none"};
 const[form,setForm]=useState(current);const saveProfile=()=>{login(form);save("eskadin-avatar",form)};const set=(k,v)=>setForm(x=>({...x,[k]:v}));
 return <main className="roblox-page avatar-editor-page">
  <div className="roblox-titlebar"><div><span className="roblox-kicker">AVATAR</span><h1>Editar avatar</h1><p>tu personaje se guarda en tu perfil y aparece dentro de tus experiencias.</p></div><Link className="roblox-pill" to="/marketplace">Abrir mercado</Link></div>
  <div className="avatar-editor-layout">
   <section className="roblox-card avatar-dressing-room"><div className="avatar-stage"><R15AvatarPreview user={form} size="xl"/></div><div className="avatar-editor-actions"><button className="button button-primary" onClick={saveProfile}>Guardar perfil y avatar</button><Link className="button button-ghost" to="/account">Ver perfil</Link></div></section>
   <section className="roblox-card avatar-editor-controls">
    <h2>Cuerpo</h2>
    <div className="avatar-choice-row"><span>Piel</span>{["#f2c7a5","#d89b72","#8d5524","#f7dfc5"].map(v=><button key={v} className={"swatch "+(form.skin===v?"chosen":"")} style={{background:v}} onClick={()=>set("skin",v)}/>)}</div>
    <div className="avatar-choice-row"><span>Camiseta</span>{["#5b7cff","#e95d6a","#58b89a","#9b6cff","#f2b84b"].map(v=><button key={v} className={"swatch "+(form.shirt===v?"chosen":"")} style={{background:v}} onClick={()=>set("shirt",v)}/>)}</div>
    <div className="avatar-choice-row"><span>Pantalón</span>{["#202638","#354a73","#4d3430","#29352d"].map(v=><button key={v} className={"swatch "+(form.pants===v?"chosen":"")} style={{background:v}} onClick={()=>set("pants",v)}/>)}</div>
    <h2>Aspecto</h2>
    <div className="avatar-chip-grid">{AVATAR_ITEMS.filter(i=>["hair","face","hat"].includes(i.kind)).map(i=><button key={i.id} className={"avatar-chip "+(form[i.kind]===i.value?"chosen":"")} onClick={()=>set(i.kind,i.value)}>{i.glyph} {i.name}</button>)}</div>
   </section>
  </div>
 </main>
}
function Marketplace(){
 const[,t]=useLang();const{user,login}=useUser();const[query,setQuery]=useState("");const[category,setCategory]=useState("Todos");
 const[owned,setOwned]=useState(()=>[...avatarOwned(),...avatarCustomOwned()]);
 const[balance,setBalance]=useState(()=>Number(localStorage.getItem("eskadin-fc")||0));
 const custom=createdAvatarItems();
 const customCategories=["Accesorios","Ropa en capas","Ropa clásica"];
 const cats=["Todos","Cuerpo","Cabello","Cara","Sombreros","Camisas","Pantalones",...customCategories];
 const builtins=AVATAR_ITEMS.filter(i=>(category==="Todos"||i.category===category)&&i.name.toLowerCase().includes(query.toLowerCase()));
 const customFiltered=custom.filter(i=>{
  const cat=avatarItemLabel(i);
  return (category==="Todos"||category===cat||(category==="Accesorios"&&i.assetType==="rigid")||(category==="Ropa en capas"&&i.assetType==="layered")||(category==="Ropa clásica"&&i.assetType==="classic"))&&
   i.name.toLowerCase().includes(query.toLowerCase());
 });
 const buyBuiltin=e=>{const cost=e.price||0;if(cost>balance)return;const next=balance-cost;localStorage.setItem("eskadin-fc",String(next));setBalance(next);saveAvatarItem(e.id);setOwned(x=>x.includes(e.id)?x:[...x,e.id])};
 const equipBuiltin=e=>{login(updateAvatarItem(user||{name:"Eskådin Player"},e));saveAvatarItem(e.id);setOwned(x=>x.includes(e.id)?x:[...x,e.id])};
 const buyCustom=e=>{const cost=e.price||0;if(cost>balance)return;const next=balance-cost;localStorage.setItem("eskadin-fc",String(next));setBalance(next);const ids=avatarCustomOwned();if(!ids.includes(e.id))saveAvatarCustomOwned([...ids,e.id]);setOwned(x=>x.includes(e.id)?x:[...x,e.id])};
 const equipCustom=e=>{
  const current=user||{name:"Eskådin Player"};
  const ids=Array.isArray(current.avatarItems)?current.avatarItems.filter(id=>id!==e.id):[];
  login({...current,avatarItems:[...ids,e.id]});
  const ownedIds=avatarCustomOwned();if(!ownedIds.includes(e.id))saveAvatarCustomOwned([...ownedIds,e.id]);
 };
 const icon=i=>i.assetType==="rigid"?"◈":i.assetType==="layered"?"▣":"▤";
 return <main className="roblox-page marketplace-page">
  <div className="roblox-titlebar"><div><span className="roblox-kicker">MERCADO</span><h1>Mercado de objetos</h1><p>Los objetos creados en Object Studio aparecen aquí automáticamente.</p></div><div className="market-balance">F¢ {balance}</div></div>
  <div className="market-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar objetos…"/><div className="market-categories">{cats.map(c=><button key={c} className={category===c?"chosen":""} onClick={()=>setCategory(c)}>{c}</button>)}</div></div>
  {custom.length>0&&<div className="market-creator-link"><span>✦ {custom.length} artículo{custom.length===1?"":"s"} creados por la comunidad</span><Link to="/object-studio" className="roblox-pill">Crear otro</Link></div>}
  <div className="market-grid">
   {builtins.map(item=>{const isOwned=owned.includes(item.id);return <article className="market-item" key={item.id}><div className="market-item-preview"><span>{item.glyph}</span></div><div className="market-item-info"><small>{item.category}</small><h3>{item.name}</h3><b>{isOwned?"Propiedad":item.price===0?"Gratis":"F¢ "+item.price}</b><div className="market-item-actions">{isOwned?<button className="button button-primary small" onClick={()=>equipBuiltin(item)}>Equipar</button>:<button className="button button-ghost small" disabled={item.price>balance} onClick={()=>buyBuiltin(item)}>{item.price===0?"Obtener":"Comprar · F¢ "+item.price}</button>}</div></div></article>})}
   {customFiltered.map(item=>{const isOwned=owned.includes(item.id);return <article className="market-item market-item-created" key={item.id}><div className="market-item-preview"><span>{icon(item)}</span><small>3D</small></div><div className="market-item-info"><small>{avatarItemLabel(item)} · {item.subtype}</small><h3>{item.name}</h3><p>{item.description||"Objeto creado en Object Studio."}</p><b>{isOwned?"Propiedad":item.price===0?"Gratis":"F¢ "+item.price}</b><div className="market-item-actions">{isOwned?<button className="button button-primary small" onClick={()=>equipCustom(item)}>Equipar</button>:<button className="button button-ghost small" disabled={item.price>balance} onClick={()=>buyCustom(item)}>{item.price===0?"Obtener":"Comprar · F¢ "+item.price}</button>}</div></div></article>})}
  </div>
  {!builtins.length&&!customFiltered.length&&<div className="form-card"><h2>No hay objetos con ese filtro.</h2><Link className="button button-primary" to="/object-studio">Abrir Object Studio</Link></div>}
 </main>
}
function Account(){
 const[,t]=useLang();const{user,logout}=useUser();const current=user||{name:"Eskådin Player",bio:"",skin:"#f2c7a5",shirt:"#5b7cff",pants:"#202638",hair:"classic",face:"smile",hat:"none"};
 return <main className="roblox-page account-page roblox-inspired-page">
  <div className="account-cover"><div className="account-cover-pattern"/></div>
  <section className="account-header">
   <div className="account-header-avatar"><R15AvatarPreview user={current} size="xl"/></div>
   <div className="account-header-main"><span className="roblox-kicker">PERFIL</span><h1>{current.name}</h1><p>@{normalizeIdentity(current.name)}</p><div className="profile-actions"><Link to="/account/edit" className="roblox-pill">Editar perfil</Link><Link to="/avatar" className="roblox-pill">Editar avatar</Link></div></div>
  </section>
  <div className="account-tabs"><Link className="active" to="/account">Perfil</Link><Link to="/avatar">Avatar</Link><Link to="/marketplace">Inventario</Link></div>
  <div className="profile-grid">
   <section className="roblox-card"><h2>Acerca de</h2><p>{current.bio||"Todavía no has añadido una descripción."}</p><div className="profile-stats"><b>{Number(localStorage.getItem("eskadin-fc")||0)}<small>F¢</small></b><b>0<small>{t.games}</small></b><b>0<small>{t.sessions}</small></b></div></section>
   <section className="roblox-card account-avatar-card"><h2>Avatar</h2><div className="avatar-preview-row"><R15AvatarPreview user={current} size="md"/><div><b>R15</b><p>Tu avatar personalizado aparece aquí y dentro de tus experiencias.</p><Link className="button button-ghost small" to="/avatar">Personalizar</Link></div></div></section>
   <section className="roblox-card"><h2>Cuenta</h2><div className="account-actions"><Link className="button button-ghost" to="/account/edit">Editar cuenta</Link><Link className="button button-ghost" to="/settings">{t.settings}</Link><Link className="button button-ghost" to="/wallet">{t.wallet}</Link><Link className="button danger-button" to="/account/delete">{t.delete}</Link><button className="button button-ghost" onClick={logout}>{t.logout}</button></div></section>
  </div>
 </main>
}
function AccountEdit(){
 const{user,login}=useUser();const current=user||{name:"Eskådin Player",bio:"",skin:"#f2c7a5",shirt:"#5b7cff",pants:"#202638",hair:"classic",face:"smile",hat:"none"};
 const[form,setForm]=useState(current);const set=(k,v)=>setForm(x=>({...x,[k]:v}));const saveProfile=()=>login({...form,name:form.name.trim()||"Eskådin Player",bio:form.bio.trim()});
 return <main className="roblox-page account-edit-page roblox-inspired-page">
  <div className="roblox-titlebar"><div><span className="roblox-kicker">CUENTA</span><h1>Editar perfil</h1><p>Actualiza tu identidad, descripción y avatar.</p></div><Link className="roblox-pill" to="/account">Volver al perfil</Link></div>
  <div className="account-edit-layout">
   <section className="roblox-card account-edit-preview"><R15AvatarPreview user={form} size="xl"/><div><h2>{form.name||"Eskådin Player"}</h2><p>@{normalizeIdentity(form.name||"Eskådin Player")}</p></div></section>
   <section className="roblox-card account-edit-form">
    <h2>Información básica</h2>
    <label>Nombre visible<input value={form.name||""} maxLength="24" onChange={e=>set("name",e.target.value)} placeholder="Tu nombre"/></label>
    <label>Descripción<textarea value={form.bio||""} maxLength="160" onChange={e=>set("bio",e.target.value)} placeholder="Cuéntale algo a la comunidad…"/></label>
    <h2>Colores del cuerpo</h2>
    <div className="account-swatch-row"><span>Piel</span>{["#f2c7a5","#d89b72","#8d5524","#f7dfc5"].map(v=><button key={v} className={form.skin===v?"chosen":""} style={{background:v}} onClick={()=>set("skin",v)}/>)}</div>
    <div className="account-swatch-row"><span>Camiseta</span>{["#5b7cff","#e95d6a","#58b89a","#9b6cff","#f2b84b"].map(v=><button key={v} className={form.shirt===v?"chosen":""} style={{background:v}} onClick={()=>set("shirt",v)}/>)}</div>
    <div className="account-swatch-row"><span>Pantalón</span>{["#202638","#354a73","#4d3430","#29352d"].map(v=><button key={v} className={form.pants===v?"chosen":""} style={{background:v}} onClick={()=>set("pants",v)}/>)}</div>
    <h2>Proporciones R15</h2>
    <label>Anchura <input type="range" min=".78" max="1.22" step=".01" value={form.bodyWidth||1} onChange={e=>set("bodyWidth",Number(e.target.value))}/></label>
    <label>Altura <input type="range" min=".88" max="1.14" step=".01" value={form.bodyHeight||1} onChange={e=>set("bodyHeight",Number(e.target.value))}/></label>
    <label>Cabeza <input type="range" min=".85" max="1.18" step=".01" value={form.headScale||1} onChange={e=>set("headScale",Number(e.target.value))}/></label>
    <div className="account-edit-actions"><button className="button button-primary" onClick={saveProfile}>Guardar cambios</button><Link className="button button-ghost" to="/account">Cancelar</Link></div>
   </section>
  </div>
 </main>
}
function Settings(){const[lang,t]=useLang();const{setLang}=useContext(LangContext);return <main className="page narrow"><div className="eyebrow">{t.settings}</div><h1 className="page-title">{t.settings}</h1><div className="form-card"><label>{t.language}<select value={lang} onChange={e=>setLang(e.target.value)}>{Object.entries(LANG).map(([k,v])=><option key={k} value={k}>{v}</option>)}</select></label><p className="muted">{t.languageStored}</p></div></main>}

function Login(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.account}</div><h1>{t.login}</h1><p className="muted">Cuenta personal para jugar, guardar progreso y ganar F¢.</p><label>{t.email}<input type="email"/></label><label>{t.password}<input type="password"/></label><label>{t.displayName}<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><button className="button button-primary" onClick={()=>{login({name:name||"Eskådin Player"});nav("/account")}}>{t.login}</button><Link className="muted" to="/register">{t.register}</Link><Link className="muted" to="/developer/register">{t.createDeveloper} →</Link></div></main>}
function Register(){const[,t]=useLang();const{login}=useUser();const nav=useNavigate();const[name,setName]=useState("");const[skin,setSkin]=useState("#f2c7a5");const[shirt,setShirt]=useState("#5b7cff");const[pants,setPants]=useState("#202638");const[hat,setHat]=useState("none");const preview={name:name||"Eskådin Player",skin,shirt,pants,hat};return <main className="signup-page"><div className="signup-brand">Esk<span>å</span>din St<span>ü</span>dis<sup>®</sup></div><div className="signup-shell"><section className="signup-copy"><span className="roblox-kicker">{t.studyAvatar||t.register}</span><h1>Tu cuenta.<br/><strong>Tu avatar.<br/>Tu mundo.</strong></h1><p>entra a Eskådin Stüdis, crea juegos, descubre experiencias y juega con tu avatar.</p><Avatar user={preview} size="lg"/></section><section className="signup-card"><div className="signup-tabs"><b>CREAR CUENTA</b><Link to="/login">YA TENGO CUENTA</Link></div><h2>{t.register}</h2><label>{t.username}<input value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre"/></label><label>{t.email}<input type="email" placeholder="tu@email.com"/></label><label>{t.password}<input type="password" placeholder="Contraseña"/></label><label>{t.confirmPassword}<input type="password" placeholder="Repite la contraseña"/></label><div className="avatar-custom"><b>{t.customizeAvatar}</b><div><span>{t.skin}</span>{["#f2c7a5","#d89b72","#8d5524","#f7dfc5"].map(c=><button key={c} style={{background:c}} className={skin===c?"chosen":""} onClick={()=>setSkin(c)} aria-label="Color de piel"/>)}</div><div><span>{t.shirt}</span>{["#5b7cff","#e95d6a","#58b89a","#9b6cff","#f2b84b"].map(c=><button key={c} style={{background:c}} className={shirt===c?"chosen":""} onClick={()=>setShirt(c)} aria-label="Color de camiseta"/>)}</div><div><span>{t.pants}</span>{["#202638","#354a73","#4d3430","#29352d"].map(c=><button key={c} style={{background:c}} className={pants===c?"chosen":""} onClick={()=>setPants(c)} aria-label="Color de pantalón"/>)}</div><div><span>{t.accessory}</span>{[["none","Sin accesorio"],["cap","Gorra"],["crown","Corona"]].map(([v,l])=><button key={v} className={"avatar-option "+(hat===v?"chosen":"")} onClick={()=>setHat(v)}>{l}</button>)}</div></div><button className="signup-submit" onClick={()=>{login({name:name||"Eskådin Player",skin,shirt,pants,hat});nav("/account")}}>{t.register} <span>→</span></button><small>al continuar aceptas las normas de la comunidad.</small></section></div></main>}
function DeveloperRegister(){const[,t]=useLang();const{devLogin}=useUser();const nav=useNavigate();const[name,setName]=useState("");return <main className="page narrow auth-page"><div className="form-card auth-card"><div className="eyebrow">{t.developer}</div><h1>{t.createDeveloper}</h1><p className="muted">{t.developerRequiredText}</p><label>Nombre del estudio<input value={name} onChange={e=>setName(e.target.value)} placeholder={t.developer}/></label><label>{t.email}<input type="email"/></label><label>{t.password}<input type="password"/></label><label>{t.confirmPassword}<input type="password"/></label><button className="button button-primary" onClick={()=>{devLogin({name:name||"Eskådin Studio"});nav("/developer/account")}}>{t.createDeveloper}</button><Link className="muted" to="/register">{t.register} →</Link></div></main>}
function DeveloperAccount(){const[,t]=useLang();const{developer,devLogout}=useUser();return <main className="page narrow"><div className="eyebrow">{t.developer}</div><h1 className="page-title">{developer?.name||"Eskådin Studio"}</h1><div className="form-card"><p className="muted">{t.developerRequiredText}</p><div className="account-actions"><Link className="button button-primary" to="/editor">Abrir editor</Link><Link className="button button-ghost" to="/publish">{t.publish}</Link><Link className="button button-ghost" to="/statistics">{t.statistics}</Link><button className="button danger-button" onClick={()=>{devLogout();location.href="/"}}>{t.delete}</button></div></div></main>}
function DeleteAccount(){const[,t]=useLang();const{logout}=useUser();const nav=useNavigate();const[c,setC]=useState("");return <main className="page narrow auth-page"><div className="form-card danger-card"><div className="eyebrow danger">DANGER ZONE</div><h1>{t.delete}</h1><p className="muted">This clears the local account and session on this device.</p><input value={c} onChange={e=>setC(e.target.value)} placeholder="DELETE"/><button className="button danger-button" disabled={c!=="DELETE"} onClick={()=>{logout();localStorage.removeItem("eskadin-fc");nav("/")}}>{t.delete}</button></div></main>}

function NotFound(){const[,t]=useLang();return <main className="page notfound"><h1>404</h1><p>{t.pageEscaped}</p><Link className="button button-primary" to="/">{t.home}</Link></main>}

export default function CompleteApp(){return <LangProvider><AuthProvider><Shell><Routes><Route path="/" element={<RootRoute/>}/><Route path="/home" element={<Games/>}/><Route path="/games" element={<Games/>}/><Route path="/marketplace" element={<Marketplace/>}/><Route path="/object-studio" element={<ObjectStudio/>}/><Route path="/avatar" element={<AvatarEditor/>}/><Route path="/games/:id" element={<Game/>}/><Route path="/games/:id/play" element={<Play/>}/><Route path="/editor" element={<Editor/>}/><Route path="/projects" element={<StudioProjects/>}/><Route path="/developer" element={<Developer/>}/><Route path="/publish" element={<Publish/>}/><Route path="/missions" element={<Missions/>}/><Route path="/wallet" element={<Wallet/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/account" element={<Account/>}/><Route path="/account/edit" element={<AccountEdit/>}/><Route path="/settings" element={<Settings/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/developer/register" element={<DeveloperRegister/>}/><Route path="/developer/account" element={<DeveloperAccount/>}/><Route path="/account/delete" element={<DeleteAccount/>}/><Route path="*" element={<NotFound/>}/></Routes></Shell></AuthProvider></LangProvider>}
