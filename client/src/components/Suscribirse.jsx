import Button from "@mui/material/Button";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import "../App.css";

function Subscribe() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

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

      {/* Contenedor principal */}
      <div className="perfil-container">
        <div className="perfil-datos">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>
            Suscribirse
          </h2>

          {/* Botón Mercado Pago → lleva a Suscribirse2 */}
          <Link to="/suscribirse2" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: "#009ee3", marginTop: "15px" }}
            >
              Pagar con Mercado Pago
            </Button>
          </Link>

          <Link to="/suscribirse1" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: "#500075", marginTop: "15px" }}
            >
              Pagar con Tarjeta
            </Button>
          </Link>
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

export default Subscribe;
