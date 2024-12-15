    import React from 'react';
    import { Link, useNavigate, useLocation } from 'react-router-dom';  // Importamos useLocation
    import logo from '../Navbar/logo.png'

    const NavbarAdmin = () => {
        const navigate = useNavigate();
        const location = useLocation();  // Hook que devuelve la ruta actual

        const handleLogout = () => {
            localStorage.removeItem('isAuthenticated');
            navigate('/el_buen_lector');
        };

        // Función para comprobar si la ruta actual es la misma que la del enlace
        const Active = (path) => location.pathname === path;

        return (
            <div className="container">
                <aside>
                    <div className="top">
                        <Link className="nav-link text-white" to="/el_buen_lector/Pages/Dasboard/Dasboard">
                            <div className="logo">
                                <img src={logo} />
                                <h2 className="fs-3 fs-md-1 fs-lg-1">ElBuen<span className="text-primary">Lector</span></h2>
                            </div>
                        </Link>
                        <div className="close" id="close">
                            <span className="material-symbols-sharp">close</span>
                        </div>
                    </div>
                    <div className="sidebar">
                        {/* Usamos "Active para" determinar si el enlace debe tener la clase 'active' */}
                        <Link className={Active('/el_buen_lector/Pages/Dasboard/Dasboard') ? 'active' : ''} to="/el_buen_lector/Pages/Dasboard/Dasboard">
                            <span className="material-symbols-sharp">grid_view</span>
                            <h3>Inicio</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Libros/Libros') ? 'active' : ''} to="/el_buen_lector/Pages/Libros/Libros">
                            <span className="material-symbols-sharp">library_books</span>
                            <h3>Libros</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Stock/Stock') ? 'active' : ''} to="/el_buen_lector/Pages/Stock/Stock">
                            <span className="material-symbols-sharp">box</span>
                            <h3>Stock</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Entradas/Entradas') ? 'active' : ''} to="/el_buen_lector/Pages/Entradas/Entradas">
                            <span className="material-symbols-sharp">contract_edit</span>
                            <h3>Entradas</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Salidas/Salidas') ? 'active' : ''} to="/el_buen_lector/Pages/Salidas/Salidas">
                            <span className="material-symbols-sharp">contract_delete</span>
                            <h3>Salidas</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Usuarios/Usuarios') ? 'active' : ''} to="/el_buen_lector/Pages/Usuarios/Usuarios">
                            <span className="material-symbols-sharp">group</span>
                            <h3>Usuarios</h3>
                        </Link>
                        <Link className={Active('/el_buen_lector/Pages/Configuracion/Configuracion') ? 'active' : ''} to="/el_buen_lector/Pages/Configuracion/Configuracion">
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

    export default NavbarAdmin;
