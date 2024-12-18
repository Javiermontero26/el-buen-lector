import React, { useEffect, useState, useRef } from 'react';

const Entradas = () => {
  const url = 'http://localhost:8080/apiv1/historial/ingreso';
  const [entradaslibros, setEntradasLibros] = useState([]);
  const [entradasFiltradas, setEntradasFiltradas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const tablaEntradas = useRef(null);

  // Función para obtener los datos de la API
  const fetchApi = async () => {
    const response = await fetch(url);
    const responseJSON = await response.json();
    setEntradasLibros(responseJSON);
    setEntradasFiltradas(responseJSON); 
  };

  // Llamada a la API al montar el componente
  useEffect(() => {
    fetchApi();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = entradaslibros.filter((entrada) =>
      entrada.libro.titulo.toLowerCase().includes(query) ||  
      entrada.fechaIngreso.toLowerCase().includes(query) ||  
      entrada.cantidad.toString().includes(query) ||  // Convierte cantidad a string para usar includes()
      entrada.motivo.toLowerCase().includes(query)  
    );

    setEntradasFiltradas(filtered);
    
  };


  // Función para limpiar el campo de búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setEntradasFiltradas(entradaslibros); 
  };

  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE ENTRADAS DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Cantidad", "Fecha Ingreso", "Motivo"];
    const tableRows = entradasFiltradas.map(entradas => [
      entradas.libro.titulo,
      entradas.cantidad,
      entradas.fechaIngreso,
      entradas.motivo,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.output('dataurlnewwindow');
  };

  return (
    <div className="container mt-4">
      <div className="card border-top-0 mb-2">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Entradas de Libros</h2>
            <button className="btn btn-light me-2" onClick={exportToPDF}>
              <i className="bi bi-file-earmark-pdf me-2 text-danger h5"></i>Exportar a PDF
            </button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-3 d-flex align-items-center col-12 col-md-12 col-lg-3 ms-auto">
        <label htmlFor="Busquedas" className="me-2">Filtrar:</label>
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={handleSearch}
          />

          {/* Mostrar la X solo si hay texto en el campo de búsqueda */}
          {searchQuery && (
            <span
              className="position-absolute top-50 end-0 translate-middle-y pe-2"
              onClick={clearSearch}
              style={{ cursor: 'pointer' }}
            >
              <i className="bi bi-x" style={{ fontSize: '1.5rem', color: 'black' }}></i>
            </span>
          )}
        </div>
      </div>

      {/* Lista de Entradas */}
      <div className="table-container">
        <table ref={tablaEntradas} className="table table-striped" id="tablaEntradas">
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
            {entradasFiltradas.map((entradas) => (
              <tr key={entradas.idIngreso}>
                <td className="col-4">{entradas.libro.titulo}</td>
                <td className="col-1">{entradas.cantidad}</td>
                <td className="col-3">{entradas.fechaIngreso}</td>
                <td className="col-3">{entradas.motivo}</td>
                <td className="col-1">
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
