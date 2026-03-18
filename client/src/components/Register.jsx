import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function Register() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const registerUser = async () => {
    // Limpiar mensajes anteriores
    setErrorMessage('');
    setSuccessMessage('');

    // Validación básica
    if (!nombre || !apellido || !email || !contraseña) {
      setErrorMessage('Todos los campos son requeridos');
      return;
    }

    // Validación de email
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMessage('Por favor, ingresa un email válido');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/users', {
        nombre,
        apellido,
        email,
        contraseña
      });
      setSuccessMessage('¡Usuario registrado con éxito!');
      localStorage.setItem('token', response.data.token);
      console.log(response.data);

    } catch (error) {
      if (error.response?.status === 409) {
        // Error 409: Email ya registrado
        setErrorMessage(error.response.data.message || 'El email ya está registrado');
      } else if (error.response?.data?.error) {
        // Otros errores del backend
        setErrorMessage(error.response.data.error);
      } else {
        // Error genérico
        setErrorMessage('Error al registrar usuario. Por favor, inténtalo de nuevo.');
      }
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 style={{ fontFamily: "Cambria", fontSize: "30px" }}>Registrarse</h2>

        {/* Mensajes de error y éxito */}
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

        <input
          type="text"
          style={{ textAlign: "center", margin: "5px" }}
          placeholder="Nombre"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />
        <input
          type="text"
          style={{ textAlign: "center", margin: "5px" }}
          placeholder="Apellido"
          value={apellido}
          onChange={(event) => setApellido(event.target.value)}
        />
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
            {/* Aquí podés poner un ícono de ojo si querés */}
          </button>
        </div>

        <Button
          variant="contained"
          onClick={registerUser}
          fullWidth
          style={{
            textAlign: "center",
            backgroundColor: "#500075",
            marginTop: "20px",
            marginBottom: "10px",
          }}
        >
          REGISTRARSE
        </Button>

        <h2 style={{ fontFamily: "Candara", fontSize: "17px" }}>
          ¿Ya te registraste? ¡Andá al inicio de sesión!
        </h2>
        <Link to="/login">
          <Button
            variant="contained"
            fullWidth
            style={{
              textAlign: "center",
              backgroundColor: "#500075",
              marginTop: "10px",
            }}
          >
            INICIAR SESIÓN
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Register;
