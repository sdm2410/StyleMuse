import React from 'react';
import Unauthorized from './Unauthorized';

const ProtectedRoute = ({ children }) => {
  // Verificar si hay un token en el localStorage
  const token = localStorage.getItem('token');

  console.log('ProtectedRoute - Token check:', token ? 'Token exists' : 'No token found');

  // Si no hay token, mostrar el componente Unauthorized
  if (!token) {
    console.log('ProtectedRoute - Rendering Unauthorized component');
    return <Unauthorized />;
  }

  // Si hay token, mostrar el componente protegido
  console.log('ProtectedRoute - Rendering protected component');
  return children;
};

export default ProtectedRoute;