import { Link } from "react-router-dom";

const features = [
  {
    number: "01",
    title: "Editor visual",
    text: "Coloca paredes, objetos, luces y sonidos sin convertir cada acción sencilla en una clase de programación.",
  },
  {
    number: "02",
    title: "Publicación abierta",
    text: "Prepara tu juego y publícalo para que otras personas puedan descubrirlo y jugarlo desde la plataforma.",
  },
  {
    number: "03",
    title: "Tu juego, tus reglas",
    text: "Las experiencias pueden tener sistemas propios y monedas internas, pero la plataforma no vende dinero real dentro de ellas.",
  },
];

function App() {
  return (
    <div className="app-shell">
      <div className="wrap">
        <nav className="nav">
          <Link className="brand" to="/">
            Esk<span>å</span>din St<span>ü</span>dis®
          </Link>

          <div className="nav-links">
            <Link to="/games">Explorar</Link>
            <Link to="/editor">Crear</Link>
            <Link to="/about">Sobre la plataforma</Link>
          </div>

          <Link className="button button-ghost" to="/editor">
            Empezar
          </Link>
        </nav>

        <main>
          <section className="hero" id="about">
            <div className="hero-inner">
              <div className="pill">UNA NUEVA FORMA DE CREAR JUEGOS</div>
              <h1>
                <span>Crea.</span>
                <span className="gradient">Publica.</span>
                <span>Juega.</span>
              </h1>
              <p className="lead">
                Eskådin Stüdis® es un espacio para convertir ideas en juegos 3D,
                compartirlos y jugar sin anuncios ni tiendas dentro de los juegos.
              </p>
              <div className="actions">
                <Link className="button button-primary" to="/editor">Crear un juego</Link>
                <Link className="button button-ghost" to="/games">Explorar juegos</Link>
              </div>
            </div>
          </section>

          <section className="section" id="create">
            <div className="section-head">
              <div className="eyebrow">CREAR SIN PELEARTE CON EL EDITOR</div>
              <h2>Tu idea primero. El código, después.</h2>
              <p>
                Construye escenas, coloca objetos y prepara tu juego desde una
                interfaz pensada para que crear sea directo.
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature) => (
                <article className="card" key={feature.number}>
                  <div className="icon">{feature.number}</div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section" id="explore">
            <div className="section-head">
              <div className="eyebrow">DESCUBRE</div>
              <h2>Un catálogo hecho por gente que crea.</h2>
              <p>
                Busca experiencias, entra, juega y encuentra algo nuevo sin
                anuncios interrumpiendo la partida.
              </p>
            </div>

            <div className="showcase">
              <div className="feature-panel">
                <div className="eyebrow">ESCAPARATE</div>
                <h3>Todo empieza con una idea.</h3>
                <p>
                  Desde pequeños proyectos hasta mundos 3D completos. La
                  plataforma está pensada para que crear y jugar formen parte
                  del mismo sitio.
                </p>
                <div className="mock-editor" aria-hidden="true">
                  <div className="mock-sidebar">
                    <i /><i /><i /><i />
                  </div>
                  <div className="mock-main">
                    <i /><i /><i /><i />
                  </div>
                </div>
              </div>

              <div className="side-stack">
                <div className="mini-card">
                  <strong>F¢</strong>
                  <span>Una moneda de plataforma que se consigue jugando, no comprándola.</span>
                </div>
                <div className="mini-card">
                  <strong>0 €</strong>
                  <span>Sin anuncios. Sin compras dentro de los juegos. Sin pagar por publicar.</span>
                </div>
                <div className="mini-card">
                  <strong>∞</strong>
                  <span>Espacio para crear, probar y compartir nuevas experiencias.</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="cta">
              <div className="eyebrow">ESKÅDIN STÜDIS®</div>
              <h2>Haz que exista.</h2>
              <p>
                La próxima experiencia puede empezar con una pared, una idea
                absurda o un mundo entero. Tú decides.
              </p>
              <div className="actions">
                <Link className="button button-primary" to="/editor">Entrar al editor</Link>
                <Link className="button button-ghost" to="/games">Ver juegos</Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <span>© 2026 Eskådin Stüdis®</span>
          <span>Creado para crear. Diseñado para jugar.</span>
        </footer>
      </div>
    </div>
  );
}

export default App;