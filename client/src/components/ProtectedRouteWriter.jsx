import React, { useState, useEffect } from 'react';
import Unauthorized from './Unauthorized';
import axios from 'axios';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const ProtectedRouteWriter = ({ children }) => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    isWriter: false,
    loading: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkWriter = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserStatus({ isAuthenticated: false, isWriter: false, loading: false });
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/me", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const user = response.data;

        // 🔥 SOLO EMAIL — sin roles, sin BD
        const isWriter = user.email === "sabrinademarcoet36@gmail.com";

        setUserStatus({
          isAuthenticated: true,
          isWriter,
          loading: false
        });

      } catch (error) {
        setUserStatus({ isAuthenticated: false, isWriter: false, loading: false });
      }
    };

    checkWriter();
  }, []);

  if (userStatus.loading) {
    return <div>Verificando permisos...</div>;
  }

  if (!userStatus.isAuthenticated) {
    return <Unauthorized />;
  }

  if (!userStatus.isWriter) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>Acceso restringido</h2>
          <Button onClick={() => navigate('/home')}>VOLVER AL HOME</Button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRouteWriter;

