import { useState } from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import '../App.css';

function Subscribe() {
  const [nombreTitular, setNombreTitular] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [cvv, setCvv] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Obtener userId del token o localStorage
  const getUserId = () => {
    try {
      // Si el token es JWT, podrías decodificarlo aquí
      // Por ahora, lo guardaremos en localStorage durante el login
      return localStorage.getItem('userId') || '1'; // fallback para pruebas
    } catch {
      return '1';
    }
  };

  // Parsear fecha vencimiento (MM/AA) a mes y año
  const parseFechaVencimiento = (fecha) => {
    const parts = fecha.split('/');
    if (parts.length === 2) {
      return {
        mes: parts[0].trim(),
        año: '20' + parts[1].trim() // Convertir AA a AAAA
      };
    }
    return { mes: '', año: '' };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userId = getUserId();
      const { mes, año } = parseFechaVencimiento(fechaVencimiento);

      if (!mes || !año || mes.length !== 2 || año.length !== 4) {
        setError('La fecha de vencimiento debe tener formato MM/AA');
        setLoading(false);
        return;
      }

      // Versión simplificada - procesar suscripción directa
      await processSubscription(mes, año);
    } catch (error) {
      console.error('Error en el proceso de suscripción:', error);
      setError('Error al procesar la suscripción: ' + error.message);
      setLoading(false);
    }
  };

  const processSubscription = async (mes, año) => {
    try {
      console.log('Iniciando proceso de suscripción simple...');

      const userId = getUserId();
      console.log('UserID:', userId);

      // Guardar tarjeta y activar suscripción directamente
      const response = await axios.post(
        'http://localhost:3000/suscripcion-simple',
        {
          userId,
          nombreTitular,
          numeroTarjeta,
          mesVencimiento: mes,
          añoVencimiento: año.slice(-2),
          cvv,
          monto: 10.00
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Respuesta del backend:', response.data);

      if (response.data.success) {
        // Guardar en localStorage que el usuario está suscrito
        localStorage.setItem('suscripcionActiva', 'true');

        alert('¡Suscripción activada con éxito! Redirigiendo...');

        // Redirección directa sin timeout
        navigate('/homesub');
      } else {
        setError('No se pudo procesar la suscripción: ' + (response.data.message || 'Error desconocido'));
      }

    } catch (error) {
      console.error('Error detallado en suscripción:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Error al procesar la suscripción';
      setError(errorMessage);
    } finally {
      setLoading(false);
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
              <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                Menú ▼
              </button>
              <ul className="dropdown-list" style={{ display: menuOpen ? 'block' : 'none' }}>
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

      {/* Formulario de suscripción */}
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Suscribirse</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre titular"
              value={nombreTitular}
              onChange={(e) => setNombreTitular(e.target.value)}
              required
              style={{ textAlign: "center", margin: "5px" }}
            />
            <input
              type="text"
              placeholder="Número tarjeta"
              value={numeroTarjeta}
              onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\s/g, ''))}
              maxLength="19"
              required
              style={{ textAlign: "center", margin: "5px" }}
            />
            <input
              type="text"
              placeholder="Fecha vencimiento(MM/AA)"
              value={fechaVencimiento}
              onChange={(e) => setFechaVencimiento(e.target.value)}
              maxLength="5"
              required
              style={{ textAlign: "center", margin: "5px" }}
            />
            <input
              type="password"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength="4"
              required
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

            {error && (
              <div style={{ color: 'red', margin: '10px 0', fontFamily: 'Cambria', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              style={{
                textAlign: "center",
                backgroundColor: loading ? '#ccc' : '#500075',
                marginTop: "10px"
              }}
            >
              {loading ? 'PROCESANDO...' : 'SUSCRIBIRSE'}
            </Button>
          </form>

          <div style={{ marginTop: "15px" }}>
            <Link to="/suscribirse">Volver</Link>
          </div>
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

export default Subscribe;