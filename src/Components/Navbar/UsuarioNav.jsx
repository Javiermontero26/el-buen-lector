import React from 'react';
import NavbarAdmin from './NavbarAdmin';  // Importamos el navbar de Admin
import NavbarAlmacen from './NavbarAlmacen';  // Importamos el navbar de Almacen

const UsuarioNav = () => {
    const role = localStorage.getItem('role');  // Obtenemos el rol del localStorage

    return (
        <div>
            {role === 'admin' ? <NavbarAdmin /> : <NavbarAlmacen />}
        </div>
    );
};

export default UsuarioNav;
