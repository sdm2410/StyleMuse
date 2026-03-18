import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@mui/material";

function Login() {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const fetchLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3000/login', { email, contraseña });

      // 🔹 Guardar token y usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      setMessage('Inicio exitoso');
      navigate('/home'); // corregí la ruta: debe ser en minúscula si tu componente es /home
    } catch (error) {
      if (error.response && error.response.data.errorType === 'ACCOUNT_DISABLED') {
        alert('⚠️ No puede iniciar sesión porque su cuenta está desactivada. Contacte al administrador.');
        setMessage('Cuenta desactivada');
      } else if (error.response && error.response.data.message) {
        alert(`❌ ${error.response.data.message}`);
        setMessage(error.response.data.message);
      } else {
        alert('❌ Usuario o contraseña inválidos');
        setMessage('Error de inicio de sesión');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ fontFamily: 'Cambria', fontSize: '30px' }}>Iniciar sesión</h2>

        {/* Campo Email */}
        <input
          type="text"
          style={{ textAlign: "center", margin: "5px" }}
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <div className="login-password-wrap">
          <input
            type={showPassword ? "text" : "password"}
            style={{ textAlign: "center", margin: "5px" }}
            placeholder="Contraseña"
            value={contraseña}
            onChange={(event) => setContraseña(event.target.value)}
            className="perfil-password"
          />
          <button
            type="button"
            className="perfil-eye-btn"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={togglePassword}
          >

          </button>
        </div>

        {/* Botón Login */}
        <Button
          variant="contained"
          onClick={fetchLogin}
          fullWidth
          style={{ backgroundColor: '#500075', marginTop: '10px' }}
        >
          INICIAR SESIÓN
        </Button>

        <p style={{ color: 'purple', fontSize: '18px' }}>{message}</p>

        {/* Recuperar contraseña */}
        <h2 style={{ fontFamily: 'Candara', fontSize: '17px', marginTop: '20px' }}>
          ¿Te olvidaste tu contraseña? ¡Cliqueá acá!
        </h2>
        <Link to="/recuperar">
          <Button variant="contained" fullWidth style={{ backgroundColor: '#8002bbff', marginTop: '10px' }}>
            RECUPERAR CONTRASEÑA
          </Button>
        </Link>

        {/* Registrarse */}
        <h2 style={{ fontFamily: 'Candara', fontSize: '17px', marginTop: '20px' }}>
          ¿No estás registrado? ¡Registrate acá!
        </h2>
        <Link to="/register">
          <Button variant="contained" fullWidth style={{ backgroundColor: '#500075', marginTop: '10px' }}>
            REGISTRARSE
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default Login;
