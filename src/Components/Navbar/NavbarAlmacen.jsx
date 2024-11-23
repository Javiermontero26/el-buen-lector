import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../Navbar/logo.png'

const NavbarAlmacen = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/el_buen_lector');
    };

    return (
        <div className="container">
            <aside>
                <div className="top">
                    <Link className="nav-link text-white" to="/el_buen_lector/Pages/Dasboard/Dasboard">
                        <div class="logo">
                            <img src={logo} />
                            <h2>ElBuen<span class="primary">Lector</span></h2>
                        </div>
                    </Link>
                    <div className="close" id="close">
                        <span className="material-symbols-sharp">close</span>
                    </div>
                </div>
                <div className="sidebar">
                    <Link className="active" to="/el_buen_lector/Pages/Libros/Libros">
                        <span className="material-symbols-sharp">library_books</span>
                        <h3>Libros</h3>
                    </Link>
                    <Link to="/el_buen_lector/Pages/Stock/Stock">
                        <span className="material-symbols-sharp">box</span>
                        <h3>Stock</h3>
                    </Link>
                    <Link to="/el_buen_lector/Pages/Entradas/Entradas">
                        <span className="material-symbols-sharp">contract_edit</span>
                        <h3>Entradas</h3>
                    </Link>
                    <Link to="/el_buen_lector/Pages/Salidas/Salidas">
                        <span className="material-symbols-sharp">contract_delete</span>
                        <h3>Salidas</h3>
                    </Link>
                    <Link to="/el_buen_lector/Pages/Configuracion/Configuracion">
                        <span className="material-symbols-sharp">settings</span>
                        <h3>Configuracion</h3>
                    </Link>
                    <a href="#" className='salir' onClick={handleLogout}>
                        <span className="material-symbols-sharp">logout</span>
                        <h3>Salir</h3>
                    </a>
                </div>
            </aside>
        </div>

    );
};

export default NavbarAlmacen;
