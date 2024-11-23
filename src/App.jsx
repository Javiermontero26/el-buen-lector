import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login/LoginForm/login.jsx';
import Dasboard from './Pages/Dasboard/Dasboard.jsx';
import Libros from './Pages/Libros/Libros.jsx';
import ProtectedRoute from './Components/Login/ProtectedRoute.jsx';
import NavUser from './Components/NavUser/NavUser.jsx';
import UsuarioNav from './Components/Navbar/usuarioNav.jsx';
import Entradas from './Pages/Entradas/Entradas.jsx'
import Salidas from './Pages/Salidas/Salidas.jsx';
import Stock from './Pages/Stock/Stock.jsx';
import Configuracion from './Pages/Configuracion/Configuracion.jsx';
import Usuarios from './Pages/Usuarios/Usuarios.jsx';
import Reportes from './Pages/Reportes/Reportes.jsx';
const App = () => {
    return (
        <Router>
            <Routes>
                {/* Ruta para el Login */}
                <Route path="/el_buen_lector" element={<Login />} />

                {/*Ruta para el Dasborad(Pagina Principal)*/}
                <Route
                    path="/el_buen_lector/Pages/Dasboard/Dasboard"
                    element={
                        <ProtectedRoute>
                            <>
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Dasboard />
                                </main>
                            </>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Libros (Pagina de Libros)*/}
                <Route
                    path="/el_buen_lector/Pages/Libros/Libros"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Libros />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Entradas (Pagina de Entradas)*/}
                <Route
                    path="/el_buen_lector/Pages/Entradas/Entradas"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Entradas />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Salidas (Pagina de Salidas)*/}
                <Route
                    path="/el_buen_lector/Pages/Salidas/Salidas"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Salidas />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Stock (Pagina de Stock)*/}
                <Route
                    path="/el_buen_lector/Pages/Stock/Stock"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Stock />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Reportes (Pagina de Reportes)*/}
                <Route
                    path="/el_buen_lector/Pages/Reportes/Reportes"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Reportes />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Usuarios (Pagina de Usuarios)*/}
                <Route
                    path="/el_buen_lector/Pages/Usuarios/Usuarios"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Usuarios />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/*Ruta para Configuracion (Pagina de Configuracion del Usuario)*/}
                <Route
                    path="/el_buen_lector/Pages/Configuracion/Configuracion"
                    element={
                        <ProtectedRoute>
                            <div className="container">
                                <NavUser />
                                <UsuarioNav />
                                <main>
                                    <Configuracion />
                                </main>
                            </div>
                        </ProtectedRoute>
                    }
                />

                {/* Redirigir cualquier ruta desconocida al Login*/}
                <Route path="/" element={<Navigate to="/el_buen_lector" replace />} />
            </Routes>
        </Router>
    );
};

export default App;