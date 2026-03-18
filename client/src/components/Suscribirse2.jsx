import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Suscribirse2() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const iniciarPago = async () => {
      try {
        // Obtener userId del localStorage (debería guardarse durante el login)
        const userId = localStorage.getItem('userId') || '1';

        const response = await axios.post("http://localhost:3000/subscribirse", { userId });
        const checkoutUrl = response.data.init_point;

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          setError("No se recibió la URL de pago.");
        }
      } catch (err) {
        console.error("Error al iniciar pago:", err);
        setError("Hubo un problema al iniciar el pago.");
      } finally {
        setLoading(false);
      }
    };

    iniciarPago();
  }, []);

  return (
    <>
      {/* Header igual al Perfil */}
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
              <button
                className="dropdown-toggle"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                Menú ▼
              </button>
              <ul
                className="dropdown-list"
                style={{ display: menuOpen ? "block" : "none" }}
              >
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><Link to="/suscribirse">Suscribirse</Link></li>
                <li><a href="#footer">Contacto</a></li>
                <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                  Cerrar sesión
                </li>
              </ul>
            </nav>
          </section>
        </article>
      </div>

      {/* Contenido principal */}
      <div className="perfil-container">
        <div className="perfil-datos">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Mercado Pago</h2>

          {loading && (
            <p style={{ fontFamily: "Cambria", fontSize: "20px", color: "#333" }}>
              Redirigiendo a Mercado Pago...
            </p>
          )}

          {error && (
            <p style={{ fontFamily: "Cambria", fontSize: "20px", color: "red" }}>
              {error}
            </p>
          )}
          <div style={{ marginTop: "15px" }}>
            <Link to="/suscribirse">Volver</Link>
          </div>
        </div>
      </div>

      {/* Footer igual al Perfil */}
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

export default Suscribirse2;
