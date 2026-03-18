import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);
    const [dbMessage, setDbMessage] = useState("");
    const [menuActivo, setMenuActivo] = useState(null);

    // Bitácora general
    const [bitacoraVisible, setBitacoraVisible] = useState(false);
    const [bitacoraDatos, setBitacoraDatos] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const res = await axios.get("http://localhost:3000/users", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Normalizar estado y suscripción en caso de venir booleanos
                const normalizados = res.data.map(u => ({
                    ...u,
                    estado: u.estado === true ? 1 : u.estado === false ? 0 : u.estado,
                    suscripcionActiva:
                        u.suscripcionActiva === true ? 1 :
                            u.suscripcionActiva === false ? 0 :
                                u.suscripcionActiva
                }));
                setUsuarios(normalizados);
            } catch (err) {
                setError("No se pudo cargar la lista de usuarios");
            } finally {
                setLoading(false);
            }
        };
        fetchUsuarios();
    }, [token]);

    useEffect(() => {
        if (bitacoraVisible) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [bitacoraVisible]);


    // Acciones usuarios
    const bloquearUsuario = async (id) => {
        try {
            await axios.put(`http://localhost:3000/delete/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 0 } : u));
        } catch {
            alert("Error al bloquear usuario");
        }
    };

    const desbloquearUsuario = async (id) => {
        try {
            await axios.put(`http://localhost:3000/user/unblock/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: 1 } : u));
        } catch {
            alert("Error al desbloquear usuario");
        }
    };

    const eliminarUsuario = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/user/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(prev => prev.filter(u => u.id !== id));
        } catch {
            alert("Error al eliminar usuario");
        }
    };

    const resetearPassword = async (id) => {
        try {
            const res = await axios.put(`http://localhost:3000/user/reset-password/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Podés reemplazar alert por un toast si tenés librería
            alert(`Nueva contraseña temporal: ${res.data.nuevaPassword}`);
        } catch {
            alert("Error al resetear contraseña");
        }
    };

    const cambiarSuscripcion = async (id, activa) => {
        try {
            await axios.put(`http://localhost:3000/user/suscripcion/${id}`, { activa }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuarios(prev => prev.map(u => u.id === id ? { ...u, suscripcionActiva: activa ? 1 : 0 } : u));
        } catch {
            alert("Error al cambiar suscripción");
        }
    };

    const asignarRol = async (email, rol) => {
        try {
            await axios.post(`http://localhost:3000/user/asignar-rol`, { email, rol }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Refrescar roles en UI (opcional: volver a pedir usuarios)
            alert(`Rol ${rol} asignado a ${email}`);
        } catch {
            alert("Error al asignar rol");
        }
    };

    const quitarRol = async (email, rol) => {
        try {
            await axios.post(`http://localhost:3000/user/quitar-rol`, { email, rol }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(`Rol ${rol} quitado a ${email}`);
        } catch {
            alert("Error al quitar rol");
        }
    };

    // BD
    const verificarBD = async () => {
        try {
            const res = await axios.get("http://localhost:3000/verificar-bd", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDbMessage(`✅ Verificación: ${res.data.message}`);
        } catch {
            setDbMessage("❌ Error al verificar la base de datos");
        }
    };

    const rectificarBD = async () => {
        try {
            const res = await axios.post("http://localhost:3000/rectificar-bd", {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDbMessage(`🔄 Rectificación: ${res.data.message}`);
        } catch {
            setDbMessage("❌ Error al rectificar la base de datos");
        }
    };

    // Bitácora general
    const abrirBitacoraGeneral = async () => {
        try {
            const res = await axios.get("http://localhost:3000/bitacora", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBitacoraDatos(res.data);
            setBitacoraVisible(true);
        } catch {
            alert("Error al obtener bitácora general");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            {/* Menú fijo estilo home */}
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
                            <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>Menú ▼</button>
                            <ul className="dropdown-list" id="menuList" style={{ display: menuOpen ? 'block' : 'none' }}>
                                <li><Link to="/home">Home</Link></li>
                                <li><Link to="/perfil">Perfil</Link></li>
                                <li><a href="#footer">Contacto</a></li>
                                <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Cerrar sesión</li>
                            </ul>
                        </nav>
                    </section>
                </article>
            </div>

            <div className="login-container">
                <div className="login-box" style={{ width: "95%", maxWidth: "1200px", margin: "0 auto", padding: "2rem", backgroundColor: "#F7E6FF" }}>
                    <h2 className="titulo-panel">Panel de Administración</h2>

                    {loading && <p>Cargando usuarios...</p>}
                    {error && <p className="error-panel">{error}</p>}

                    {/* 🔹 Botones BD + Bitácora General */}
                    <div className="botones-panel">
                        <button className="boton-panel boton-verificar" onClick={verificarBD}>Verificar BD</button>
                        <button className="boton-panel boton-rectificar" onClick={rectificarBD}>Rectificar BD</button>
                        <button className="boton-panel boton-bitacora" onClick={abrirBitacoraGeneral}>Ver Bitácora General</button>
                        {dbMessage && <p className="mensaje-panel">{dbMessage}</p>}
                    </div>

                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Estado</th>
                                <th>Suscripción</th>
                                <th>Rol principal</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id}>
                                    <td>{usuario.nombre} {usuario.apellido}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.estado === 1 || usuario.estado === true ? "Activo" : "Bloqueado"}</td>
                                    <td>{usuario.suscripcionActiva === 1 || usuario.suscripcionActiva === true ? "Activa" : "Inactiva"}</td>
                                    <td>{usuario.roles?.[0]?.nombreRol || "usuario"}</td>
                                    <td>
                                        <div className="menu-opciones">
                                            <button
                                                className="menu-opciones-btn"
                                                onClick={() => setMenuActivo(menuActivo === usuario.id ? null : usuario.id)}
                                            >
                                                ⋮ Opciones
                                            </button>

                                            {menuActivo === usuario.id && (
                                                <ul className="menu-opciones-lista">
                                                    <li><button onClick={() => bloquearUsuario(usuario.id)} disabled={usuario.estado === 0}>Bloquear</button></li>
                                                    <li><button onClick={() => desbloquearUsuario(usuario.id)} disabled={usuario.estado === 1}>Desbloquear</button></li>
                                                    <li><button onClick={() => eliminarUsuario(usuario.id)}>Eliminar</button></li>
                                                    <li><button onClick={() => resetearPassword(usuario.id)}>Resetear contraseña</button></li>
                                                    <li>
                                                        <button onClick={() => cambiarSuscripcion(usuario.id, usuario.suscripcionActiva === 1 ? 0 : 1)}>
                                                            {usuario.suscripcionActiva === 1 ? "Desactivar suscripción" : "Activar suscripción"}
                                                        </button>
                                                    </li>

                                                    <li><button onClick={() => asignarRol(usuario.email, "escritor")}>Asignar rol escritor</button></li>
                                                    <li><button onClick={() => quitarRol(usuario.email, "escritor")}>Quitar rol escritor</button></li>
                                                </ul>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 🔹 Modal Bitácora General */}
                    {bitacoraVisible && (
                        <div className="modal-bitacora">
                            <div className="modal-content">
                                <h3>Bitácora General</h3>
                                <button className="btn-bloquear" onClick={() => setBitacoraVisible(false)}>Cerrar</button>
                                <ul className="lista-bitacora">
                                    {bitacoraDatos.length === 0 ? (
                                        <li>No hay registros disponibles.</li>
                                    ) : (
                                        bitacoraDatos.map((registro, index) => (
                                            <li key={index}>
                                                <strong>Usuario {registro.idUsuario}</strong> — {registro.accionRealizada} — {new Date(registro.fechaAccion).toLocaleString()}
                                            </li>
                                        ))
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 🔵 Footer */}
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



};

export default AdminUsuarios;
