import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import '../App.css';

function Perfil() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError("No estás logueada. Iniciá sesión primero.");
      return;
    }

    axios.get('http://localhost:3000/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        if (response.data && response.data.email) {
          setUser(response.data);
        } else {
          setError("Respuesta inválida del servidor.");
        }
      })
      .catch(err => {
        console.error("Error al cargar perfil:", err);
        setError("No se pudieron cargar tus datos.");
      });
  }, []);

  const togglePassword = () => {
    setShowPassword(prev => !prev);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };


  return (
    <>

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
              <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>Menú ▼</button>
              <ul className="dropdown-list" style={{ display: menuOpen ? 'block' : 'none' }}>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <Link to="/suscribirse"><li>Suscribirse</li></Link>
                <li><a href="#footer">Contacto</a></li>
                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
              </ul>
            </nav>
          </section>
        </article>
      </div>


      <div className="perfil-container">
        <div className="perfil-datos">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Mi perfil</h2>

          {error && <p className="perfil-error">{error}</p>}

          {user ? (
            <>
              <p className="perfil-campo"><strong>Nombre:</strong> {user.nombre}</p>
              <p className="perfil-campo"><strong>Apellido:</strong> {user.apellido}</p>
              <p className="perfil-campo"><strong>Email:</strong> {user.email}</p>

            </>
          ) : !error ? (
            <p className="perfil-cargando">Cargando...</p>
          ) : null}

          {/* Botón para ir a UpdateUser */}
          <Link to="/actualizar" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              fullWidth
              style={{ backgroundColor: '#500075', marginTop: "10px" }}
            >
              ACTUALIZAR PERFIL
            </Button>
          </Link>
          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: '#1c0029ff', marginTop: "10px" }}
            onClick={handleLogout}
          >
            CERRAR SESIÓN
          </Button>
        </div>
      </div>
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

export default Perfil;
