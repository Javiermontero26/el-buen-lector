import React, { useEffect, useState } from 'react';

const Salidas = () => {
  const url = 'http://localhost:8080/apiv1/historial/salida';
  const [salidaslibros, setSalidasLibros] = useState([]);
  const [salidasFiltradas, setSalidasFiltradas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Función para obtener los datos de la API
  const fetchApi = async () => {
    // Obtener el token de acceso del localStorage
    const token = localStorage.getItem('accessToken'); // Asume que siempre habrá un token
    
    try {
      // Realizar la solicitud con el token en los encabezados
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token al encabezado Authorization
        },
      });

      if (response.ok) {
        const responseJSON = await response.json();
        setSalidasLibros(responseJSON);
        setSalidasFiltradas(responseJSON); // Inicializamos el filtro con todos los datos
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de API:', error);
    }
  };

  // Llamada a la API al montar el componente
  useEffect(() => {
    fetchApi();
  }, []);

  //-------------- BUSQUEDA ------------//

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = salidaslibros.filter((salidas) =>
      salidas.libro.titulo.toLowerCase().includes(query) ||
      salidas.fechaIngreso.toLowerCase().includes(query) ||
      salidas.cantidad.toString().includes(query) ||
      salidas.motivo.toLowerCase().includes(query)
    );

    setSalidasFiltradas(filtered);
  };

  // Función para limpiar el campo de búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setSalidasFiltradas(salidaslibros);
  };

  //-------------- FIN BUSQUEDA ------------//

  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE SALIDAS DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Cantidad", "Fecha Ingreso", "Motivo"];
    const tableRows = salidasFiltradas.map(salidas => [
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

    doc.output('dataurlnewwindow');
  };

  return (
    <div className="container mt-4">
      <div className="card border-top-0 mb-2">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Salidas de Libros</h2>
            <button className="btn btn-light me-2" onClick={exportToPDF}
            disabled={localStorage.getItem('role') !== 'Admin'}>
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

      <div className="table-container">
        <table className="table table-striped" id="tablaSalidas">
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
            {salidasFiltradas.map((salidas) => (
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
