import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const WriterButton = () => {
  const [userStatus, setUserStatus] = useState({
    isAuthenticated: false,
    isWriter: false,
    loading: true
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkWriterStatus = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setUserStatus({ isAuthenticated: false, isWriter: false, loading: false });
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        const user = response.data;

        // 🔥 SOLO EMAIL — simple y directo
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

    checkWriterStatus();
  }, []);

  if (userStatus.loading) return null;
  if (!userStatus.isWriter) return null;

  return (
    <button
      onClick={() => navigate('/escribir')}
      className="writer-button"
    >
      ✍️ Escribir Noticia
    </button>
  );
};

export default WriterButton;
