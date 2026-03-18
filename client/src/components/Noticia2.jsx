import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Noticia2({ user }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const noticiaId = 2;

  useEffect(() => {
    const menuList = document.getElementById('menuList');
    if (menuList) {
      menuList.style.display = menuOpen ? 'block' : 'none';
    }
  }, [menuOpen]);

  const fetchComentarios = async () => {
    try {
      const res = await fetch(`http://localhost:3000/comentarios/${noticiaId}`);
      const data = await res.json();
      console.log("📥 Comentarios noticia 2:", data);
      setComentarios(data);
    } catch (err) {
      console.error("❌ Error obteniendo comentarios:", err);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, []);

  const handleComentario = async (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      try {
        const res = await fetch("http://localhost:3000/comentario", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ contenido: input, noticiaId }),
        });

        if (!res.ok) {
          let msg = "Error al enviar comentario";
          try {
            const errorData = await res.json();
            console.error("❌ Error al enviar comentario:", errorData);
            if (errorData?.error) msg = errorData.error;
          } catch (_) {}

          alert("❌ " + msg);
          return;
        }

        const comentarioGuardado = await res.json();
        console.log("✅ Comentario guardado noticia 2:", comentarioGuardado);

        setInput('');
        fetchComentarios();
      } catch (err) {
        console.error("❌ Error en handleComentario:", err);
        alert("❌ Error de conexión al enviar comentario");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <>
      {/* HEADER */}
      <div className="grid_header">
        <article className="grid_a">
          <section className="grid_logo">
            <Link to="/home">
              <img className="logo" src="/logo.png" alt="Logo" />
            </Link>
          </section>

          <section className="grid_titulo">
            <h1 className="titulo">Style Muse</h1>
          </section>

          <section className="grid_menu">
            <nav className="dropdown">
              <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                Menú ▼
              </button>

              <ul className="dropdown-list" id="menuList" style={{ display: menuOpen ? 'block' : 'none' }}>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><Link to="/suscribirse">Suscribirse</Link></li>
                <li><a href="#footer">Contacto</a></li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
              </ul>
            </nav>
          </section>
        </article>
      </div>

      <article className="grid_b"></article>

      {/* CONTENIDO */}
      <main className="container my-5">
        <div className="card shadow-lg border-dark">
          <img src="/circular.webp" className="card-img-top" alt="Belleza circular" />
          <div className="card-body bg-light text-dark">

            <h2 className="card-title">Belleza circular: marcas que reinventan el skincare sostenible</h2>

            <p className="card-text">
              En un mundo donde la conciencia ambiental ya no es una opción sino una urgencia...
            </p>

            <br />

            <h5>♻️ ¿Qué es la belleza circular?</h5>
            <p className="card-text">
              La belleza circular se basa en tres pilares: reducir el desperdicio, reutilizar materiales y regenerar recursos...
            </p>

            <br />

            <h5>🌱 Marcas que lideran el cambio</h5>
            <ul className="bonustips">
              <li><strong>Aurelia Botanicals:</strong> Sueros recargables libres de microplásticos.</li>
              <li><strong>Lunaria Skin:</strong> Marca argentina con envases compostables.</li>
              <li><strong>Kjaer Weis:</strong> Cápsulas recambiables de diseño minimalista.</li>
            </ul>

            <br />

            <h5>💧 Ingredientes regenerativos</h5>
            <p className="card-text">
              Marcas como Biossance y Herbivore apuestan por ingredientes cultivados sosteniblemente...
            </p>

            <br />

            <h5>🧼 Ritual consciente</h5>
            <p className="card-text">
              Adoptar belleza circular implica repensar tu rutina: simplificar, reutilizar y recargar...
            </p>

            <br />

            <p>
              La nueva belleza no solo embellece: repara, respeta y regenera...
            </p>

            <br />

            <p className="card-text"><small className="text-muted">Por Camila Torres</small></p>
          </div>
        </div>

        {/* COMENTARIOS */}
        {user ? (
          user.suscripcionActiva === true || user.suscripcionActiva === 1 ? (
            <section className="comentarios container my-5">

              <h3>💬 Comentarios</h3>

              <div className="chat-box border rounded p-3 mb-3 bg-white"
                style={{ maxHeight: "300px", overflowY: "auto" }}>

                {comentarios.length > 0 ? (
                  comentarios.map((msg, i) => (
                    <div key={i} className="chat-message user">
                      <p className="mb-1">{msg.contenido}</p>

                      {msg.usuario && (
                        <small className="text-muted">
                          {msg.usuario.nombre} {msg.usuario.apellido}
                        </small>
                      )}

                      {msg.fecha && (
                        <small className="text-muted ms-2">
                          {new Date(msg.fecha).toLocaleString()}
                        </small>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted">
                    Todavía no hay comentarios. Sé el primero en participar ✨
                  </p>
                )}

              </div>

              {/* FORM COMENTARIO */}
              <form className="d-flex gap-2" onSubmit={handleComentario}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Escribí tu comentario..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  required
                />

                <button
                  type="submit"
                  className="btn"
                  style={{
                    backgroundColor: "#8A2BE2",
                    borderColor: "#8A2BE2",
                    color: "#fff"
                  }}
                >
                  Enviar
                </button>
              </form>

            </section>
          ) : (
            <section className="comentarios container my-5">
              <h3>💬 Comentarios</h3>
              <div className="alert alert-warning" role="alert">
                🚫 Esta función es solo para <strong>suscriptores</strong>.{" "}
                <Link to="/suscribirse">Suscribite</Link> para comentar.
              </div>
            </section>
          )
        ) : null}

      </main>

      {/* FOOTER */}
      <div className="grid-footer" id="footer">
        <div className="redes">
          <a className="icono" target="_blank" href="https://www.instagram.com/stylemuse.okk/">
            <img src="/insta.svg" alt="Instagram" />
          </a>
          <br />
          <a className="icono" target="_blank" href="https://www.tiktok.com/@stylemuse.tk">
            <img src="/tiktok.svg" alt="Tiktok" />
          </a>
          <br />
          <a className="icono" target="_blank" href="https://www.youtube.com/@stylemusenoticias">
            <img src="/youtube.svg" alt="Youtube" />
          </a>
        </div>

        <div className="copy"><h4>©Copyright</h4></div>
        <div className="conta"><h4>Contacto +54 11 4967-1832</h4></div>
      </div>
    </>
  );
}

export default Noticia2;
