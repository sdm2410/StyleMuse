import { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link } from "react-router-dom";
import '../App.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchForgotPassword = async () => {
    // Limpiar mensajes anteriores
    setErrorMessage('');
    setSuccessMessage('');

    // Validación básica del email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Por favor, ingresa un email válido');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/recuperar', { email });
      console.log("Solicitud enviada:", response.data);
      setSuccessMessage(response.data.message || "Se ha enviado un correo de recuperación a tu email");
    } catch (error) {
      console.error("Error al solicitar recuperación:", error);
      if (error.response?.status === 404) {
        // Error 404: Email no registrado
        setErrorMessage(error.response.data.message || 'El email no está registrado en nuestro sistema');
      } else if (error.response?.data?.error) {
        // Otros errores del backend
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("No se pudo enviar el correo de recuperación. Por favor, inténtalo de nuevo.");
      }
    }
  };

  return (
    <>
      {/* Menú fijo estilo home */}
      <div className="grid_header">
        <article className="grid_a">
          <section className="grid_logo">
            <img className="logo" src="/logo.png" alt="Logo" />
          </section>
          <section className="grid_titulo">
            <h1 className="titulo">Style Muse</h1>
          </section>
          <section className="grid_menu">
            <nav className="dropdown">
              <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>Menú ▼</button>
              <ul className="dropdown-list" id="menuList" style={{ display: menuOpen ? 'block' : 'none' }}>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><a href="#footer">Contacto</a></li>
              </ul>
            </nav>
          </section>
        </article>
      </div>

      {/* Formulario de recuperación */}
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Recuperar contraseña</h2>

          <input
            type="email"
            placeholder="Introduce tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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

          {/* Mensajes */}
          {errorMessage && (
            <div className="form-error">
              {errorMessage}
            </div>
          )}
          {successMessage && (
            <div className="form-success">
              {successMessage}
            </div>
          )}

          <Button
            variant="contained"
            fullWidth
            style={{ textAlign: "center", backgroundColor: '#500075', marginTop: "10px" }}
            onClick={fetchForgotPassword}
          >
            ENVIAR
          </Button>

          <div style={{ marginTop: "15px" }}>
            <Link to="/login">Volver al login</Link>
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

export default ForgotPassword;
