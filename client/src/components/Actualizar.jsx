import { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../App.css';

function UpdateUser() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [contraseñaNueva, setContraseñaNueva] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 👈 nuevo estado

  const token = localStorage.getItem('token');

  const fetchUpdateUser = async () => {
    try {
      const response = await axios.put(
        'http://localhost:3000/user',
        { nombre, apellido, email, contraseñaActual, contraseñaNueva },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Usuario actualizado:", response.data);
      setErrorMessage(''); // limpiar error si todo salió bien
      alert("Perfil actualizado con éxito");
    } catch (error) {
      console.error("Error al actualizar:", error);

      // 👇 detectar si el backend devolvió "contraseña incorrecta"
      if (error.response && error.response.data && error.response.data.error === "La contraseña actual es incorrecta") {
        setErrorMessage("Contraseña incorrecta");
      } else {
        setErrorMessage("No se pudo actualizar el perfil");
      }
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
              <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>Menú ▼</button>
              <ul className="dropdown-list" id="menuList" style={{ display: menuOpen ? 'block' : 'none' }}>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/perfil">Perfil</Link></li>
                <li><a href="#footer">Contacto</a></li>
              </ul>
            </nav>
          </section>
        </article>
      </div>

      {/* Formulario de actualización */}
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Actualizar perfil</h2>

          <input
            type="text"
            placeholder="Nuevo nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{ textAlign: "center", margin: "5px" }}
          />
          <input
            type="text"
            placeholder="Nuevo apellido"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            style={{ textAlign: "center", margin: "5px" }}
          />
          <input
            type="text"
            placeholder="Nuevo email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ textAlign: "center", margin: "5px" }}
          />

          <input
            type="password"
            placeholder="Contraseña actual"
            value={contraseñaActual}
            onChange={(e) => setContraseñaActual(e.target.value)}
            style={{
              textAlign: "center",
              margin: "5px",
              padding: "12px 10px",
              border: "1px solid #ECC2FF",
              borderRadius: "4px",
              fontSize: "16px",
              width: "90%"
            }}
          />

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={contraseñaNueva}
            onChange={(e) => setContraseñaNueva(e.target.value)}
            style={{
              textAlign: "center",
              margin: "5px",
              padding: "12px 10px",
              border: "1px solid #ECC2FF",
              borderRadius: "4px",
              fontSize: "16px",
              width: "90%"
            }}
          />

          {/* 👇 Mensaje de error en pantalla */}
          {errorMessage && (
            <p style={{ color: "#8a36b1ff", fontWeight: "bold", marginTop: "5px" }}>
              {errorMessage}
            </p>
          )}

          <Button
            variant="contained"
            fullWidth
            style={{ textAlign: "center", backgroundColor: '#500075', marginTop: "10px" }}
            onClick={fetchUpdateUser}
          >
            GUARDAR
          </Button>

          <div style={{ marginTop: "15px" }}>
            <Link to="/perfil">Volver al perfil</Link>
          </div>
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

export default UpdateUser;
