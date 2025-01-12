import React, { useState, useEffect } from 'react';
import '../NavUser/NavUser.css';
import logoperfil from '../NavUser/profile-1.jpg';
import { useLocation } from 'react-router-dom';

const NavUser = () => {
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('accessToken');  
    const location = useLocation();

    // Estado para almacenar los datos del usuario
    const [usuario, setUsuario] = useState(null);
    const [error, setError] = useState(null);  

    // Método para hacer la solicitud GET a la API
    const getUsuarioPorNombre = async () => {
        try {
            if (!userName || !token) {
                throw new Error("Nombre de usuario o token no encontrados en localStorage");
            }

            const response = await fetch(`http://localhost:8080/apiv1/usuarios/listar/${userName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Comillas invertidas para interpolación de variables
                },
            });

            if (!response.ok) {
                throw new Error('Usuario no encontrado');
            }

            const data = await response.json();  
            setUsuario(data);  
        } catch (error) {
            setError(error.message); 
        }
    };

    // Llamar a la API cuando el componente se monte
    useEffect(() => {
        getUsuarioPorNombre();
    }, []);  

    // Función para obtener solo el último segmento de la ruta
    const getLastSegment = (pathname) => {
        const segments = pathname.split('/');
        return segments[segments.length - 1];  // Devuelve el último segmento de la ruta
    };

    return (
        <div className="right">
            <div className="titlepages">
                <h2 className="m-1 mx-auto">{getLastSegment(location.pathname)}</h2>
            </div>
            <div className="top">
                <div className="profile">
                    <div className="info">
                        <p className="text-white">Hola, <b className="text-white">{userName}</b></p>
                        <p className="text-white">
                            <small>
                                {role === 'Admin' && 'Administrador'}
                                {role === 'Almacenero' && 'Almacénero'}
                            </small>
                        </p>
                    </div>
                    {usuario && (
                        <div className="profile-photo">
                            {usuario.img ? (
                                <img
                                    src={`http://localhost:8080/apiv1/usuarios/images/${usuario.img}`}  // Comillas invertidas aquí también
                                    alt={usuario.nombre}
                                />
                            ) : (
                                <img
                                    src={logoperfil}
                                    alt="Usuario"
                                />
                            )}
                        </div>
                    )}
                    {/* Mostrar el error si ocurre */}
                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NavUser;
