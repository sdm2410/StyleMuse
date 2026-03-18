import './App.css';
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Perfil from './components/Perfil';
import Subscribirse from './components/Suscribirse';
import Subscribirse1 from './components/Suscribirse1';
import Actualizar from './components/Actualizar';
import Subscribirse2 from './components/Suscribirse2';
import Escribir from './components/Escribir';
import Recuperar from './components/Recuperar';
import Resetear from './components/Resetear';
import NoticiaDetalle from './components/NoticiaDetalle';
import Noticia from './components/Noticia';
import Noticia2 from './components/Noticia2';
import HomeSub from './components/HomeSub';
import PaymentSuccess from './components/PaymentSuccess';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedRouteSub from './components/ProtectedRouteSub';
import ProtectedRouteWriter from './components/ProtectedRouteWriter';
import AdminUsuarios from './components/Administrador';
//import Envio from './components/Envio';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setLoadingUser(false);
    } else {
      const fetchUser = async () => {
        try {
          const res = await fetch("http://localhost:3000/me", {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          });

          if (!res.ok) throw new Error("Token inválido o expirado");

          const data = await res.json();
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        } catch (err) {
          console.log("❌ Error cargando usuario:", err);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        } finally {
          setLoadingUser(false);
        }
      };
      fetchUser();
    }

    // Escuchar cambios en localStorage (después de pago/suscripción)
    const handleStorageChange = (e) => {
      if (e.key === 'user' || e.key === 'suscripcionActiva') {
        const updatedUser = localStorage.getItem("user");
        if (updatedUser) {
          setUser(JSON.parse(updatedUser));
        }
      }
    };

    // También escuchar actualizaciones en la misma pestaña
    const handleStorageUpdate = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageUpdate);
    };
  }, []);

  if (loadingUser && localStorage.getItem("token")) {
    return <p style={{ padding: "50px", textAlign: "center" }}>Cargando sesión...</p>;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/resetear" element={<Resetear />} />
        {/* <Route path="/enviodomicilio" element={<Envio />} /> */}

        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
        <Route path="/actualizar" element={<ProtectedRoute><Actualizar /></ProtectedRoute>} />
        <Route path="/suscribirse" element={<ProtectedRoute><Subscribirse /></ProtectedRoute>} />
        <Route path="/suscribirse1" element={<ProtectedRoute><Subscribirse1 /></ProtectedRoute>} />
        <Route path="/suscribirse2" element={<ProtectedRoute><Subscribirse2 /></ProtectedRoute>} />
        <Route
            path="/escribir"
            element={
            <ProtectedRouteWriter>
                <Escribir />
            </ProtectedRouteWriter>
             }
          />
        <Route path="/admin" element={<ProtectedRoute><AdminUsuarios /></ProtectedRoute>} />

        <Route path="/homesub" element={<ProtectedRouteSub><HomeSub /></ProtectedRouteSub>} />
        <Route path="/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />

        <Route path="/noticia" element={<ProtectedRoute><Noticia user={user} /></ProtectedRoute>} />
        <Route path="/noticia2" element={<ProtectedRoute><Noticia2 user={user} /></ProtectedRoute>} />
        <Route path="/noticia/:id" element={<ProtectedRoute><NoticiaDetalle user={user} /></ProtectedRoute>} />

        <Route path="/mercadopago/success" element={<PaymentSuccess />} />
        <Route path="/failure" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Cambria', color: '#f44336' }}>Error en el pago</h2>
            <p>El pago no pudo ser procesado. Por favor, inténtalo nuevamente.</p>
            <a href="/suscribirse" style={{ color: '#500075' }}>Volver a intentar</a>
          </div>
        } />
        <Route path="/pending" element={
          <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'Cambria', color: '#ff9800' }}>Pago pendiente</h2>
            <p>Tu pago está siendo procesado. Recibirás una confirmación por email.</p>
            <a href="/home" style={{ color: '#500075' }}>Ir al home</a>
          </div>
        } />

        <Route path="*" element={<h2 style={{ padding: "50px", textAlign: "center" }}>404 - Página no encontrada</h2>} />
      </Routes>
    </div>
  );
}

export default App;
