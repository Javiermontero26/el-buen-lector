import React, { useEffect, useState, useRef } from 'react';

const Salidas = () => {
  const url = 'http://localhost:8080/apiv1/historial/salida';
  const [salidaslibros, setSalidasLibros] = useState([]);
  const tablaSalidas = useRef(null);

  // Función para obtener los datos de la API
  const fetchApi = async () => {
    const response = await fetch(url);
    const responseJSON = await response.json();
    setSalidasLibros(responseJSON);
  };

  // Llamada a la API al montar el componente
  useEffect(() => {
    fetchApi();
  }, []);


  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE SALIDAS DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Cantidad", "Fecha Ingreso", "Motivo"];
    const tableRows = salidaslibros.map(salidas => [
      salidas.libro.titulo,
      salidas.cantidad,
      salidas.fechaIngreso,
      salidas.motivo,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('salidas.pdf');
  };

  // DataTable 
  useEffect(() => {
    if (salidaslibros.length > 0 && !$.fn.dataTable.isDataTable(tablaSalidas.current)) {
      $(tablaSalidas.current).DataTable({
        paging: true,
        lengthChange: false,
        searching: true,
        ordering: false,
        info: false,
        autoWidth: true,
        responsive: true,
        language: {
          search: "Buscar Salidas:",
          paginate: {
            previous: "Anterior",
            next: "Siguiente",
          },
        },
      });
    }
  }, [salidaslibros]);

  return (
    <div className="container mt-4">
      <div className="card border-top-0 mb-2">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Salidas de Libros</h2>
            <button className="btn btn-light me-2" onClick={exportToPDF}>
              <i className="bi bi-file-earmark-pdf me-2 text-danger h5"></i>Exportar a PDF
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Entradas */}
      <div className="table-container">
        <table ref={tablaSalidas} className="table table-striped" id="tablaSalidas">
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
            {salidaslibros.map((salidas) => (
              <tr key={salidas.idSalida}>
                <td className='col-4'>{salidas.libro.titulo}</td>
                <td className='col-1'>{salidas.cantidad}</td>
                <td className='col-3'>{salidas.fechaIngreso}</td>
                <td className='col-3'>{salidas.motivo}</td>
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

export default Salidas;
