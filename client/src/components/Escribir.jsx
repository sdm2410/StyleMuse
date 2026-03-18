import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../App.css';
import axios from "axios";

function Escribir() {
  const [menuOpen, setMenuOpen] = useState(false);

  // CAMPOS DEL FORMULARIO
  const [tituloNoticia, setTituloNoticia] = useState('');
  const [escritorAsignado, setEscritorAsignado] = useState('');
  const [categoria, setCategoria] = useState('moda');
  const [imagen, setImagen] = useState('');
  const [contenido, setContenido] = useState('');

  // Categorías predeterminadas como las tarjetas del home
  const categoriasPredeterminadas = [
    { value: 'belleza', label: 'Belleza' },
    { value: 'moda', label: 'Moda' },
    { value: 'pasarela', label: 'Pasarelas' },
    { value: 'famosas', label: 'Famosas' },
    { value: 'grwm', label: 'GRWM' },
    { value: 'recomendado', label: 'Recomendaciones' }
  ];

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {

    await axios.post(
      "http://localhost:3000/noticia",
      {
        tituloNoticia,
        escritorAsignado,
        categoria,
        imagen,
        contenido
      },
      {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    alert("✅ Noticia publicada con éxito\n\nRedirigiendo al home...");

    setTituloNoticia("");
    setEscritorAsignado("");
    setCategoria("");
    setImagen("");
    setContenido("");

    setTimeout(() => {
      navigate("/home");
    }, 2000);

  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("❌ Error al publicar la noticia");
  }
};

  return (
    <>
      {/* Menú fijo estilo home */}
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
                style={{ display: menuOpen ? 'block' : 'none' }}
              >
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><Link to="/suscribirse">Suscribirse</Link></li>
                <li><a href="#footer">Contacto</a></li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  Cerrar sesión
                </li>
              </ul>
            </nav>
          </section>
        </article>
      </div>

      {/* Formulario de publicación */}
      <div className="perfil-container">
        <div className="noticia-datos">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>
            Publicar noticia
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Título de la noticia"
              value={tituloNoticia}
              onChange={(e) => setTituloNoticia(e.target.value)}
              className="perfil-campo"
              required
            />

            <input
              type="text"
              placeholder="Autor"
              value={escritorAsignado}
              onChange={(e) => setEscritorAsignado(e.target.value)}
              className="perfil-campo"
              required
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="perfil-campo"
              required
            >
              {categoriasPredeterminadas.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="URL de imagen"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="perfil-campo"
            />

            <textarea
              placeholder="Contenido de la noticia"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="perfil-campo"
              rows="6"
              required
            ></textarea>

            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: '#500075', marginTop: "10px" }}
              type="submit"
            >
              PUBLICAR
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
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

export default Escribir;
