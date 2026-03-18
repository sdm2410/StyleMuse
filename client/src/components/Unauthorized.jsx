import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import '../App.css';

function Unauthorized() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ fontFamily: "Cambria", fontSize: "30px", color: "#500075" }}>
          🔒 INICIA SESIÓN PARA CONTINUAR
        </h2>

        <p style={{ fontFamily: "Candara", fontSize: "18px", marginTop: "15px" }}>
          Debes iniciar sesión para acceder a la plataforma de StyleMuse
        </p>

        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#500075", marginTop: "15px" }}
          >
            INICIAR SESIÓN
          </Button>
        </Link>

        <h3 style={{ fontFamily: "Candara", fontSize: "17px", marginTop: "25px" }}>
          ¿No tienes cuenta?
        </h3>

        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            fullWidth
            style={{ backgroundColor: "#8002bbff", marginTop: "10px" }}
          >
            REGISTRARSE
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Unauthorized;
