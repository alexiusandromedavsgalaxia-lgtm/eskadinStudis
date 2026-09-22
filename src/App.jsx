import { Link, Routes, Route, useParams } from "react-router-dom";

const games = [
  { id: 1, title: "Neon District", genre: "Acción · 3D", color: "violet", players: "1.2K" },
  { id: 2, title: "Blockline", genre: "Construcción", color: "lime", players: "842" },
  { id: 3, title: "Night Shift", genre: "Terror", color: "blue", players: "3.4K" },
  { id: 4, title: "Worlds Apart", genre: "Aventura", color: "pink", players: "621" },
];

const features = [
  ["01", "Editor visual", "Coloca paredes, objetos, luces y sonidos sin convertir cada acción sencilla en una clase de programación."],
  ["02", "Publicación abierta", "Prepara tu juego y publícalo para que otras personas puedan descubrirlo y jugarlo."],
  ["03", "Sin economía real", "Sin anuncios, compras dentro de juegos ni pagar por publicar. F¢ se consigue jugando."],
];

function Layout({ children }) {
  return <div className="app-shell"><div className="wrap">
    <nav className="nav">
      <Link className="brand" to="/">Esk<span>å</span>din St<span>ü</span>dis®</Link>
      <div className="nav-links">
        <Link to="/games">Explorar</Link><Link to="/editor">Crear</Link><Link to="/developer">Developer</Link><Link to="/account">Cuenta</Link>
      </div>
      <Link className="button button-primary small" to="/editor">Empezar</Link>
    </nav>
    {children}
    <footer className="footer"><span>© 2026 Eskådin Stüdis®</span><span>Creado para crear. Diseñado para jugar.</span></footer>
  </div></div>;
}

function Home() {
  return <main>
    <section className="hero"><div className="hero-inner">
      <div className="pill">UNA NUEVA FORMA DE CREAR JUEGOS</div>
      <h1><span>Crea.</span><span className="gradient">Publica.</span><span>Juega.</span></h1>
      <p className="lead">Convierte ideas en juegos 3D, compártelos y juega sin anuncios ni tiendas dentro de las experiencias.</p>
      <div className="actions"><Link className="button button-primary" to="/editor">Crear un juego</Link><Link className="button button-ghost" to="/games">Explorar juegos</Link></div>
    </div></section>

    <section className="section"><div className="section-head"><div className="eyebrow">CREAR SIN PELEARTE CON EL EDITOR</div><h2>Tu idea primero. El código, después.</h2><p>Construye escenas, coloca objetos y prepara tu juego desde una interfaz pensada para que crear sea directo.</p></div>
      <div className="feature-grid">{features.map(([n,t,p]) => <article className="card" key={n}><div className="icon">{n}</div><h3>{t}</h3><p>{p}</p></article>)}</div>
    </section>

    <section className="section"><div className="section-head"><div className="eyebrow">DESCUBRE</div><h2>Un catálogo hecho por gente que crea.</h2><p>Busca experiencias, entra, juega y encuentra algo nuevo.</p></div>
      <div className="showcase"><div className="feature-panel"><div className="eyebrow">ESCAPARATE</div><h3>Todo empieza con una idea.</h3><p>Desde pequeños proyectos hasta mundos 3D completos. Crear y jugar viven en el mismo sitio.</p><div className="mock-editor"><div className="mock-sidebar"><i/><i/><i/><i/></div><div className="mock-main"><i/><i/><i/><i/></div></div></div>
      <div className="side-stack"><div className="mini-card"><strong>F¢</strong><span>Moneda de plataforma que se consigue jugando, no comprándola.</span></div><div className="mini-card"><strong>0 €</strong><span>Sin anuncios. Sin compras dentro de los juegos. Sin pagar por publicar.</span></div><div className="mini-card"><strong>∞</strong><span>Espacio para crear, probar y compartir nuevas experiencias.</span></div></div></div>
    </section>
    <section className="section"><div className="cta"><div className="eyebrow">ESKÅDIN STÜDIS®</div><h2>Haz que exista.</h2><p>La próxima experiencia puede empezar con una pared, una idea absurda o un mundo entero.</p><div className="actions"><Link className="button button-primary" to="/editor">Entrar al editor</Link><Link className="button button-ghost" to="/games">Ver juegos</Link></div></div></section>
  </main>;
}

function Games() {
  return <main className="page"><div className="page-head"><div><div className="eyebrow">CATÁLOGO</div><h1 className="page-title">Explorar juegos</h1><p>Experiencias creadas por la comunidad de Eskådin Stüdis®.</p></div><Link className="button button-primary" to="/editor">Crear juego</Link></div>
    <div className="games-grid">{games.map(g=><Link className="game-card" to={"/games/"+g.id} key={g.id}><div className={"game-cover "+g.color}><span>ESKÅDIN</span></div><div className="game-info"><h3>{g.title}</h3><p>{g.genre}</p><b>♥ {g.players} jugadores</b></div></Link>)}</div>
  </main>;
}

function Game() {
  const { id } = useParams(); const game=games.find(x=>String(x.id)===id)||games[0];
  return <main className="page"><Link className="back" to="/games">← Volver al catálogo</Link><div className="game-hero"><div className={"game-cover big "+game.color}><span>{game.title}</span></div><div><div className="eyebrow">EXPERIENCIA #{game.id}</div><h1 className="page-title">{game.title}</h1><p>{game.genre}. Una experiencia creada para Eskådin Stüdis®.</p><div className="actions"><Link className="button button-primary" to={"/games/"+game.id+"/play"}>▶ Jugar</Link><button className="button button-ghost">♡ Me gusta</button></div></div></div></main>;
}

function Play() { const { id }=useParams(); const game=games.find(x=>String(x.id)===id)||games[0]; return <main className="page play"><div className="playbar"><Link to={"/games/"+game.id}>← Salir</Link><b>{game.title}</b><span>Sesión #0001</span></div><div className="game-viewport"><div className="crosshair">+</div><div className="play-message">JUGANDO<br/><small>El runtime de Eskådin Stüdis® aparecerá aquí.</small></div></div></main>; }

function Editor() { return <main className="page"><div className="page-head"><div><div className="eyebrow">CREADOR</div><h1 className="page-title">Editor</h1><p>Empieza una experiencia nueva sin complicarte.</p></div><Link className="button button-primary" to="/publish">Publicar</Link></div><div className="editor-layout"><aside className="editor-side"><b>OBJETOS</b><button>▣ Pared</button><button>◆ Bloque</button><button>◉ Luz</button><button>♫ Sonido</button><button>⌁ Punto de spawn</button></aside><div className="editor-canvas"><div className="scene-grid"><span>Arrastra objetos aquí</span></div></div><aside className="properties"><b>PROPIEDADES</b><label>Nombre<input placeholder="Mi objeto"/></label><label>Posición<input placeholder="0, 0, 0"/></label><label>Escala<input placeholder="1, 1, 1"/></label></aside></div></main>; }

function Developer() { return <main className="page"><div className="eyebrow">DEVELOPER HUB</div><h1 className="page-title">Tu espacio de desarrollo.</h1><div className="dashboard-grid"><Link to="/editor" className="dash"><b>🧱 Editor</b><span>Crea y modifica experiencias.</span></Link><Link to="/publish" className="dash"><b>📤 Publicar</b><span>Prepara una versión pública.</span></Link><Link to="/statistics" className="dash"><b>📊 Estadísticas</b><span>Visitas, likes y sesiones.</span></Link><Link to="/account" className="dash"><b>👤 Cuenta</b><span>Perfil y configuración.</span></Link></div></main>; }

function Publish(){return <main className="page narrow"><div className="eyebrow">PUBLICACIÓN</div><h1 className="page-title">Publica tu juego.</h1><div className="form-card"><label>Nombre del juego<input placeholder="Mi juego"/></label><label>Descripción<textarea placeholder="¿De qué trata?"/></label><label>Visibilidad<select><option>Público</option><option>Privado</option></select></label><button className="button button-primary">Publicar gratis</button><p className="muted">Publicar no cuesta dinero. Las experiencias no pueden integrar pagos reales.</p></div></main>}

function Statistics(){return <main className="page"><div className="eyebrow">ANALÍTICAS</div><h1 className="page-title">Estadísticas</h1><div className="stats-grid"><div><b>12.4K</b><span>Visitas</span></div><div><b>1.8K</b><span>Likes</span></div><div><b>3.2K</b><span>Sesiones</span></div><div><b>48h</b><span>Tiempo jugado</span></div></div></main>}

function Account(){return <main className="page narrow"><div className="eyebrow">CUENTA</div><h1 className="page-title">Tu cuenta.</h1><div className="form-card"><div className="account-avatar">ES</div><h2>Eskådin Player</h2><p className="muted">0 juegos publicados · 0 sesiones · 0 F¢</p><Link className="button button-ghost" to="/">Volver al inicio</Link></div></main>}

function Login(){return <main className="page narrow"><div className="form-card"><div className="eyebrow">CUENTA</div><h1>Iniciar sesión</h1><label>Email<input type="email"/></label><label>Contraseña<input type="password"/></label><button className="button button-primary">Entrar</button><Link to="/register" className="muted">Crear una cuenta</Link></div></main>}
function Register(){return <main className="page narrow"><div className="form-card"><div className="eyebrow">CUENTA</div><h1>Crear cuenta</h1><label>Nombre de usuario<input/></label><label>Email<input type="email"/></label><label>Contraseña<input type="password"/></label><button className="button button-primary">Registrarme</button><Link to="/login" className="muted">Ya tengo una cuenta</Link></div></main>}
function NotFound(){return <main className="page notfound"><h1>404</h1><p>esta página se ha escapado del editor 😭</p><Link className="button button-primary" to="/">Volver</Link></main>}

export default function App(){
 return <Layout><Routes>
   <Route path="/" element={<Home/>}/><Route path="/games" element={<Games/>}/><Route path="/games/:id" element={<Game/>}/><Route path="/games/:id/play" element={<Play/>}/>
   <Route path="/editor" element={<Editor/>}/><Route path="/developer" element={<Developer/>}/><Route path="/publish" element={<Publish/>}/><Route path="/statistics" element={<Statistics/>}/><Route path="/account" element={<Account/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="*" element={<NotFound/>}/>
 </Routes></Layout>;
}