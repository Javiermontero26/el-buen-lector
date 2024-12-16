import React from 'react';
import { Link } from 'react-router-dom';

const Tarjetas = () => {
    return (
        <div className="container p-2">

            <div className="row g-4">
                {/* Tarjeta de Libros */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Pages/Libros/Libros" className="card text-white bg-primary h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Libros</h1>
                            <p className="text-white">Accede a la gestión de libros.</p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Stock */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Pages/Stock/Stock" className="card text-white bg-info h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Stock</h1>
                            <p className="text-white">Gestiona el stock de libros.</p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Entradas */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Pages/Entradas/Entradas" className="card text-white bg-warning h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Entradas</h1>
                            <p className="text-white">Registra las entradas de libros.</p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Salidas */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Pages/Salidas/Salidas" className="card text-white bg-danger h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Salidas</h1>
                            <p className="text-white">Gestiona las salidas de libros.</p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Usuarios
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Pages/Usuarios/Usuarios" className="card text-white bg-dark h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Usuarios</h1>
                            <p className="text-white">Gestiona los usuarios del sistema.</p>
                        </div>
                    </Link>
                </div>
                 */}
            </div>
        </div>
    );
};

export default Tarjetas;
