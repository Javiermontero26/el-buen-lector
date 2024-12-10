import React, { useEffect, useState } from 'react';

const Entradas = () => {
  const url = 'http://localhost:8080/apiv1/historial/ingreso';
  const [entradaslibros, setEntradasLibros] = useState([]);

  const fetchApi = async () => {
    const response = await fetch(url);
    const responseJSON = await response.json();
    setEntradasLibros(responseJSON);
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card border-top-0">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Entrada de Libros</h2>
            <button className="btn btn-light" onClick={() => console.log('Agregar')}>
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Mostrar la lista de libros */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Libro</th>
            <th>Cantidad</th>
            <th>Fecha Ingreso</th>
            <th>Motivo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {entradaslibros.map((entradas) => (
            <tr key={entradas.idIngreso}>
              <td className='col-4'>{entradas.libro.titulo}</td>
              <td className='col-1'>{entradas.cantidad}</td>
              <td className='col-3'>{entradas.fechaIngreso}</td>
              <td className='col-3'>{entradas.motivo}</td>
              <td className='col-1'>
                <span className="edit" title="Editar" onClick={() => console.log('Editar')}>
                  <i className="material-icons">&#xE254;</i>
                </span>
                <span className="delete" title="Eliminar" onClick={() => console.log('Eliminar')}>
                  <i className="material-icons">&#xE872;</i>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Entradas;
