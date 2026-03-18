import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function PaymentSuccess() {
  const [loading, setLoading] = useState(true);
  const [subscriptionUpdated, setSubscriptionUpdated] = useState(false);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const updateSubscription = async () => {
      try {
        // Obtener el objeto user actual de localStorage
        const currentUser = localStorage.getItem('user');
        if (currentUser) {
          const userObj = JSON.parse(currentUser);
          // Actualizar suscripcionActiva a true localmente
          userObj.suscripcionActiva = true;
          // Guardar el objeto user actualizado
          localStorage.setItem('user', JSON.stringify(userObj));
        }

        // Llamar al backend para activar la suscripción en la base de datos
        const response = await fetch('http://localhost:3000/activar-suscripcion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.user) {
            // Actualizar localStorage con los datos frescos del backend
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }

        // También guardar el valor individual por compatibilidad
        localStorage.setItem('suscripcionActiva', 'true');
        setSubscriptionUpdated(true);

        // Disparar evento para notificar a App.jsx del cambio
        window.dispatchEvent(new Event('userUpdated'));

        // Esperar 2 segundos y redirigir a HomeSub
        setTimeout(() => {
          navigate('/homesub');
        }, 2000);

      } catch (error) {
        console.error('Error:', error);
        // Si hay error con el backend, igual actualizamos localmente
        localStorage.setItem('suscripcionActiva', 'true');
        setSubscriptionUpdated(true);
        setTimeout(() => {
          navigate('/homesub');
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    updateSubscription();
  }, [navigate]);

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
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '60px', color: '#4CAF50', marginBottom: '20px' }}>
              ✅
            </div>
            <h2 style={{ fontFamily: "Cambria", fontSize: "32px", color: '#4CAF50', marginBottom: '20px' }}>
              ¡Pago Exitoso!
            </h2>
          </div>

          {loading ? (
            <p style={{ fontFamily: "Cambria", fontSize: "20px", color: "#333", textAlign: 'center' }}>
              Actualizando tu suscripción...
            </p>
          ) : (
            <div style={{ textAlign: 'center' }}>
              {subscriptionUpdated ? (
                <div>
                  <p style={{ fontFamily: "Cambria", fontSize: "20px", color: "#4CAF50", marginBottom: '30px' }}>
                    ¡Felicidades! Ahora tienes acceso premium a todo nuestro contenido editorial exclusivo.
                  </p>
                  <p style={{ fontFamily: "Cambria", fontSize: "16px", color: "#666" }}>
                    Redirigiendo a tu Home premium...
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontFamily: "Cambria", fontSize: "20px", color: "#FF9800", marginBottom: '30px' }}>
                    Tu pago fue procesado exitosamente. Estamos actualizando tu suscripción.
                  </p>
                  <p style={{ fontFamily: "Cambria", fontSize: "16px", color: "#666" }}>
                    Si el problema persiste, contacta a soporte.
                  </p>
                </div>
              )}
            </div>
          )}
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

export default PaymentSuccess;