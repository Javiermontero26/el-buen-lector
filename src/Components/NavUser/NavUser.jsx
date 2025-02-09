import React, { useEffect } from 'react';
import '../NavUser/NavUser.css';
import logoperfil from '../NavUser/profile-1.jpg';
import { useLocation, useNavigate } from 'react-router-dom';

const NavUser = () => {
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');
    const location = useLocation();
    const navigate = useNavigate();

    const getLastSegment = (pathname) => {
        const segments = pathname.split('/');
        return segments[segments.length - 1];
    };

    useEffect(() => {
        if (role !== 'Admin' && role !== 'Almacenero' || !role) {
            localStorage.clear();
            navigate('/el_buen_lector/login');
        }
        
    }, [role, navigate]);

    return (
        <div className="right">
            <div className="titlepages">
                <h2 className='m-1 mx-auto'>{getLastSegment(location.pathname)}</h2>
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
                    <div className="profile-photo">
                        <img src={logoperfil} alt="Profile" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavUser;
