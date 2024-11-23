import React from 'react';
import '../NavUser/NavUser.css';
import logoperfil from '../NavUser/profile-1.jpg';

const NavUser = () => {
    const userName = localStorage.getItem('userName');
    const role = localStorage.getItem('role');

    return (
        <div className="right">
            <div className="titlepages">
                <h2 className='m-1 mx-auto'>Libros</h2>
            </div>
            <div className="top">
                <div className="profile">
                    <div className="info">
                        <p className="text-white">Hola, <b className="text-white">{userName}</b></p>
                        <p className="text-white"><small>{role === 'admin' ? 'Administrador' : 'Almacéro'}</small></p>
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
