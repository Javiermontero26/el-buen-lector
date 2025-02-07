import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Tarjetas = () => {
    const [totalLibros, setTotalLibros] = useState(0);  
    const [totalEntradas, setTotalEntradas] = useState(0); 
    const [totalSalidas, setTotalSalidas] = useState(0);
    const [error, setError] = useState(null);  

    
    const fetchTotales = async () => {

        const token = localStorage.getItem('accessToken');  
        try {
            // total de libros
            const responseLibros = await fetch('http://localhost:8080/apiv1/libros/total', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (responseLibros.ok) {
                const totalLibrosResponse = await responseLibros.json();
                setTotalLibros(totalLibrosResponse); 
            } else {
                setError('No se pudo obtener el total de libros');
            }

            // total de entradas
            const responseEntradas = await fetch('http://localhost:8080/apiv1/historial/entradas/total', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (responseEntradas.ok) {
                const totalEntradasResponse = await responseEntradas.json();
                setTotalEntradas(totalEntradasResponse); 
            } else {
                setError('No se pudo obtener el total de entradas');
            }

            // total de salidas
            const responseSalidas = await fetch('http://localhost:8080/apiv1/historial/salidas/total', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (responseSalidas.ok) {
                const totalSalidasResponse = await responseSalidas.json();
                setTotalSalidas(totalSalidasResponse); 
            } else {
                setError('No se pudo obtener el total de salidas');
            }
        } catch (error) {
            setError('Error en la solicitud de API');
        }
    };

    // Llamar a la API al montar el componente
    useEffect(() => {
        fetchTotales();
    }, []);  

    return (
        <div className="container p-2">
            <div className="row g-4">
                {/* Tarjeta de Libros */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Libros" className="card text-white bg-primary h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Libros</h1>
                            <p className="text-white">
                                {error ? error : `Total de Libros: ${totalLibros}`}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Stock */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Stock" className="card text-white bg-primary h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Stock</h1>
                            <p className="text-white">
                                0
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Entradas */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Entradas" className="card text-white bg-success h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Entradas</h1>
                            <p className="text-white">
                                {error ? error : `Total de Entradas: ${totalEntradas}`}
                            </p>
                        </div>
                    </Link>
                </div>

                {/* Tarjeta de Salidas */}
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <Link to="/el_buen_lector/Salidas" className="card text-white bg-danger h-100 text-decoration-none">
                        <div className="card-body d-flex flex-column">
                            <h1 className="card-title">Salidas</h1>
                            <p className="text-white">
                                {error ? error : `Total de Salidas: ${totalSalidas}`}
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Tarjetas;
