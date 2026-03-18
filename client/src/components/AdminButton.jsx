import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const AdminButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const roles = res.data.roles || [];
        console.log("🔍 Roles recibidos:", roles);

        const esAdmin = roles.includes("administrador");
        setIsAdmin(esAdmin);
      } catch (err) {
        console.error("❌ Error al verificar administrador:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading || !isAdmin) return null;

  return (
    <button
      onClick={() => navigate('/admin')}
      className="writer-button"
      title="Acceder al panel de administración"
    >
      🛠️ Panel de Administración
    </button>
  );
};

export default AdminButton;