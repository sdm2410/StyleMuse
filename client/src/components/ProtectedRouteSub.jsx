import React, { useState, useEffect } from 'react';
import Unauthorized from './Unauthorized';
import axios from 'axios';
import { Button } from '@mui/material';
import '../App.css';

const ProtectedRouteSub = ({ children }) => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    hasSubscription: false,
    loading: true
  });

  useEffect(() => {
    const checkUserStatus = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUserStatus({
          isAuthenticated: false,
          hasSubscription: false,
          loading: false
        });
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const user = response.data;
        setUserStatus({
          isAuthenticated: true,
          hasSubscription: user.suscripcionActiva === true || user.suscripcionActiva === 1,
          loading: false
        });

      } catch (error) {
        console.error('Error verificando estado del usuario:', error);
        setUserStatus({
          isAuthenticated: false,
          hasSubscription: false,
          loading: false
        });
      }
    };

    checkUserStatus();
  }, []);

  if (userStatus.loading) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "25px", color: "#500075" }}>
            Verificando suscripción...
          </h2>
        </div>
      </div>
    );
  }

  if (!userStatus.isAuthenticated) {
    return <Unauthorized />;
  }

  if (!userStatus.hasSubscription) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2 style={{ fontFamily: "Cambria", fontSize: "28px", color: "#500075" }}>
            Contenido Exclusivo para Suscriptores
          </h2>

          <p style={{ fontFamily: "Candara", fontSize: "17px", marginTop: "15px", color: "#8002bbff" }}>
            Este contenido está disponible solo para suscriptores premium de Style Muse.
          </p>

          <p style={{ fontFamily: "Candara", fontSize: "16px", marginTop: "10px", color: "#666" }}>
            Suscríbete por solo $10.00 ARS/mes y accede a todo nuestro contenido exclusivo.
          </p>

          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#500075", marginTop: "20px" }}
            onClick={() => window.location.href = '/suscribirse'}
          >
            SUSCRIBIRSE AHORA
          </Button>

          <Button
            variant="outlined"
            fullWidth
            style={{ borderColor: "#500075", color: "#500075", marginTop: "15px" }}
            onClick={() => window.location.href = '/home'}
          >
            VOLVER AL HOME
          </Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRouteSub;
