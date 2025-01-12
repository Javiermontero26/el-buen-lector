import React from 'react';
import NavbarAdmin from './NavbarAdmin';
import NavbarAlmacen from './NavbarAlmacen';

const UsuarioNav = () => {
    const role = localStorage.getItem('role');
    return (
        <div>
            {role === 'Admin' && <NavbarAdmin />}
            {role === 'Almacenero' && <NavbarAlmacen />}
        </div>

    );
};

export default UsuarioNav;
