import React, { useEffect, useState, useRef } from 'react';

const Entradas = () => {
  const url = 'http://localhost:8080/apiv1/historial/ingreso';
  const [entradaslibros, setEntradasLibros] = useState([]);
  const tablaEntradas = useRef(null);

  // Función para obtener los datos de la API
  const fetchApi = async () => {
    const response = await fetch(url);
    const responseJSON = await response.json();
    setEntradasLibros(responseJSON);
  };

  // Llamada a la API al montar el componente
  useEffect(() => {
    fetchApi();
  }, []);


  // DataTable 
  useEffect(() => {
    if (entradaslibros.length > 0 && !$.fn.dataTable.isDataTable(tablaEntradas.current)) {
      $(tablaEntradas.current).DataTable({
        paging: true,
        lengthChange: false,
        searching: true,
        ordering: false,
        info: false,
        autoWidth: true,
        responsive: true,
        language: {
          search: "Buscar Entradas:",
          paginate: {
            previous: "Anterior",
            next: "Siguiente",
          },
        },
      });
    }
  }, [entradaslibros]);

  return (
    <div className="container mt-4">
      <div className="card border-top-0 mb-2">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Entradas de Libros</h2>
          </div>
        </div>
      </div>

      {/* Lista de Entradas */}
      <div className="table-container">
        <table ref={tablaEntradas} className="table table-striped" id='tablaEntradas'>
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
                  <span
                    className="edit"
                    title="Editar"
                    onClick={() => console.log('Editar')}
                  >
                    <i className="material-icons">&#xE254;</i>
                  </span>
                  <span
                    className="delete"
                    title="Eliminar"
                    onClick={() => console.log('Eliminar')}
                  >
                    <i className="material-icons">&#xE872;</i>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Entradas;
