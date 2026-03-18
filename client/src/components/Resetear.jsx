import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import '../App.css';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function ResetPassword() {
  const query = useQuery();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const t = query.get('token');
    if (t) setToken(t);
  }, [query]);

  const fetchResetPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword) {
      setErrorMessage('La nueva contraseña no puede estar vacía');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/resetear', {
        token,
        newPassword
      });
      setSuccessMessage(response.data.message || 'Contraseña actualizada con éxito');
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('No se pudo actualizar la contraseña');
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

      {/* Formulario de reset */}
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Resetear contraseña</h2>

          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            <p style={{ color: "#8a36b1ff", fontWeight: "bold", marginTop: "5px" }}>
              {errorMessage}
            </p>
          )}
          {successMessage && (
            <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
              {successMessage}
            </p>
          )}

          <Button
            variant="contained"
            fullWidth
            style={{ textAlign: "center", backgroundColor: '#500075', marginTop: "10px" }}
            onClick={fetchResetPassword}
          >
            GUARDAR
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

export default ResetPassword;

