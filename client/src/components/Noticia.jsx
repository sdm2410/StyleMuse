import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Noticia({ user, noticiaId = 1 }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [comentarios, setComentarios] = useState([]);
  const [input, setInput] = useState('');
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const menuList = document.getElementById('menuList');
    if (menuList) {
      menuList.style.display = menuOpen ? 'block' : 'none';
    }
  }, [menuOpen]);

  // ============================
  // OBTENER COMENTARIOS
  // ============================
  const fetchComentarios = async () => {
    try {
      const res = await fetch(`http://localhost:3000/comentarios/${noticiaId}`);
      const data = await res.json();
      console.log("📥 Comentarios noticia 1:", data);
      setComentarios(data);
    } catch (err) {
      console.error("❌ Error obteniendo comentarios:", err);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [noticiaId]);

  // ============================
  // ENVIAR COMENTARIO
  // ============================
  const handleComentario = async (e) => {
    e.preventDefault();
    
    // 🆕 Validaciones previas
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("❌ Debes iniciar sesión para comentar");
      navigate('/login');
      return;
    }

    if (input.trim() === '') {
      alert("❌ El comentario no puede estar vacío");
      return;
    }

    setEnviando(true);

    try {
      console.log("📤 Enviando comentario...", {
        contenido: input,
        noticiaId,
        token: token ? "✅ Presente" : "❌ Falta"
      });

      const res = await fetch("http://localhost:3000/comentario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          contenido: input.trim(), 
          noticiaId 
        })
      });

      console.log("📥 Respuesta del servidor:", res.status);

      // 🆕 Manejo mejorado de errores
      if (!res.ok) {
        let errorMessage = "Error al enviar comentario";
        
        try {
          const errorData = await res.json();
          console.error("❌ Error del servidor:", errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error("❌ No se pudo parsear el error:", parseError);
        }

        // 🆕 Manejo específico por código de error
        if (res.status === 401) {
          alert("❌ Sesión expirada. Por favor, inicia sesión nuevamente.");
          localStorage.removeItem('token');
          navigate('/login');
          return;
        } else if (res.status === 403) {
          alert("❌ Solo los suscriptores pueden comentar. ¡Suscríbete para participar!");
          navigate('/suscribirse');
          return;
        } else {
          alert(`❌ ${errorMessage}`);
        }

        setEnviando(false);
        return;
      }

      const comentarioGuardado = await res.json();
      console.log("✅ Comentario guardado:", comentarioGuardado);

      // 🆕 Limpiar y actualizar
      setInput('');
      await fetchComentarios();
      alert("✅ Comentario enviado correctamente");

    } catch (err) {
      console.error("❌ Error en handleComentario:", err);
      alert("❌ Error de conexión. Verifica que el servidor esté activo.");
    } finally {
      setEnviando(false);
    }
  };

  // ============================
  // LOGOUT
  // ============================
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

      {/* CONTENIDO */}
      <main className="container my-5">

        <div className="card shadow-lg border-dark">
          <img src="/rutina.webp" className="card-img-top" alt="Rutina de noche" />
          <div className="card-body bg-light text-dark">

            <h2 className="card-title">Rutinas de noche que transforman tu piel en 7 días</h2>

            <p className="card-text">
              Dormir bien es esencial, pero lo que hacés antes de cerrar los ojos puede marcar la diferencia entre una piel apagada y una que brilla con salud...
            </p>

            <br />

            <p className="card-text">
              Recordá que tu piel es única...
            </p>

            <br />

            <h5>🌙 Día 1: Limpieza profunda</h5>
            <p className="card-text">Olvidate del jabón común...</p>

            <br />

            <h5>💧 Día 2: Hidratación estratégica</h5>
            <p className="card-text">Después de limpiar...</p>

            <br />

            <h5>🧬 Día 3: Renovación celular</h5>
            <p className="card-text">Es hora de sumar activos...</p>

            <br />

            <h5>🛡️ Día 4: Reparación intensiva</h5>
            <p className="card-text">Usá una crema de noche rica...</p>

            <br />

            <h5>🌿 Día 5: Detox y descanso</h5>
            <p className="card-text">Dejá descansar tu piel...</p>

            <br />

            <h5>✨ Día 6: Estimulación suave</h5>
            <p className="card-text">Volvé a los activos...</p>

            <br />

            <h5>🌸 Día 7: Ritual completo</h5>
            <p className="card-text">Repetí la rutina completa...</p>

            <br />

            <h4>🧠 Bonus: hábitos que potencian tu rutina</h4>
            <div className="bonustips">
              <li>Dormí al menos 7 horas.</li>
              <li>Evitá pantallas antes de dormir.</li>
              <li>Hidratate durante el día.</li>
              <li>Usá funda de almohada suave.</li>
            </div>

            <br />

            <p className="card-text"><small className="text-muted">Por Valentina Ríos</small></p>

          </div>
        </div>

        {/* ============================
            COMENTARIOS
        ============================ */}
        {user ? (
          user.suscripcionActiva === true || user.suscripcionActiva === 1 || user.suscripcionActiva === 'true' ? (
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
                  <p className="text-muted">Todavía no hay comentarios. Sé el primero en participar ✨</p>
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
                  disabled={enviando}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={enviando}
                >
                  {enviando ? "Enviando..." : "Enviar"}
                </button>
              </form>

            </section>
          ) : (
            <section className="comentarios container my-5">
              <h3>💬 Comentarios</h3>
              <div className="alert alert-warning" role="alert">
                🚫 Esta es una función exclusiva para <strong>suscriptores</strong>.{" "}
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

export default Noticia;