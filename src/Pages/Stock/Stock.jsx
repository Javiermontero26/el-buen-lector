import React, { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import Select from 'react-select';  // Importar el componente Select

const Stock = () => {
  // URLs de la API
  const urlGet = 'http://localhost:8080/apiv1/stocklibros/listar';
  const urlPostEntrada = 'http://localhost:8080/apiv1/stocklibros/registrar';  // Para entradas
  const urlPostSalida = 'http://localhost:8080/apiv1/stocklibros/salidareg';  // Para salidas
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';  // URL para obtener los libros

  // Estados
  const [stocklibros, setStockLibros] = useState([]);
  const [libros, setLibros] = useState([]);  // Estado para almacenar los libros
  const [nuevoStockEntrada, setNuevoStockEntrada] = useState({ idLibro: '', cantidad: '', motivo: '' });
  const [nuevoStockSalida, setNuevoStockSalida] = useState({ idLibro: '', cantidad: '', motivo: '' });
  const [modalShowEntrada, setModalShowEntrada] = useState(false);
  const [modalShowSalida, setModalShowSalida] = useState(false);

  // Crear una instancia de Notyf para notificaciones
  const notyf = new Notyf();

  // Obtener Stock desde la API
  const fetchStock = async () => {
    try {
      const response = await fetch(urlGet);
      const responseJSON = await response.json();
      setStockLibros(responseJSON);
    } catch (error) {
      console.error('Error al obtener stock:', error);
      notyf.error('Error al cargar el stock');
    }
  };

  // Obtener los libros desde la API
  const fetchLibros = async () => {
    try {
      const response = await fetch(urlLibros);
      const responseJSON = await response.json();
      setLibros(responseJSON);
    } catch (error) {
      console.error('Error al obtener libros:', error);
      notyf.error('Error al cargar los libros');
    }
  };

  // Agregar entrada de stock
  const agregarEntrada = async () => {
    if (!nuevoStockEntrada.idLibro || !nuevoStockEntrada.cantidad || !nuevoStockEntrada.motivo) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    if (isNaN(nuevoStockEntrada.cantidad) || parseInt(nuevoStockEntrada.cantidad) <= 0) {
      notyf.error('La cantidad debe ser un número positivo');
      return;
    }

    try {
      const response = await fetch(urlPostEntrada, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idLibro: parseInt(nuevoStockEntrada.idLibro),
          cantidad: parseInt(nuevoStockEntrada.cantidad),
          motivo: nuevoStockEntrada.motivo,
        }),
      });

      if (response.ok) {
        fetchStock();
        setNuevoStockEntrada({ idLibro: '', cantidad: '', motivo: '' });
        setModalShowEntrada(false);
        notyf.success('Entrada de stock agregada correctamente');
      } else {
        const errorData = await response.json();
        notyf.error('Error al agregar entrada: ' + (errorData.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      notyf.error('Hubo un error al conectar con el servidor.');
    }
  };

  // Agregar salida de stock
  const agregarSalida = async () => {
    if (!nuevoStockSalida.idLibro || !nuevoStockSalida.cantidad || !nuevoStockSalida.motivo) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    if (isNaN(nuevoStockSalida.cantidad) || parseInt(nuevoStockSalida.cantidad) <= 0) {
      notyf.error('La cantidad debe ser un número positivo');
      return;
    }

    try {
      const response = await fetch(urlPostSalida, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idLibro: parseInt(nuevoStockSalida.idLibro),
          cantidad: parseInt(nuevoStockSalida.cantidad),
          motivo: nuevoStockSalida.motivo,
        }),
      });

      if (response.ok) {
        fetchStock();
        setNuevoStockSalida({ idLibro: '', cantidad: '', motivo: '' });
        setModalShowSalida(false);
        notyf.success('Salida de stock agregada correctamente');
      } else {
        const errorData = await response.json();
        notyf.error('Error al agregar salida: ' + (errorData.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      notyf.error('Hubo un error al conectar con el servidor.');
    }
  };

  // Función para cerrar los modales
  const handleCloseModalEntrada = () => {
    setNuevoStockEntrada({ idLibro: '', cantidad: '', motivo: '' });
    setModalShowEntrada(false);
  };

  const handleCloseModalSalida = () => {
    setNuevoStockSalida({ idLibro: '', cantidad: '', motivo: '' });
    setModalShowSalida(false);
  };

  useEffect(() => {
    fetchStock();
    fetchLibros();
  }, []);

  // Opciones para React-Select
  const libroOptions = libros.map((libro) => ({
    value: libro.idLibro,
    label: libro.titulo,
  }));

  const handleSelectChangeEntrada = (selectedOption) => {
    setNuevoStockEntrada({
      ...nuevoStockEntrada,
      idLibro: selectedOption ? selectedOption.value : ''
    });
  };

  const handleSelectChangeSalida = (selectedOption) => {
    setNuevoStockSalida({
      ...nuevoStockSalida,
      idLibro: selectedOption ? selectedOption.value : ''
    });
  };


  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE STOCK DE LIBROS", 14, 16);

    const tableColumn = ["Libro", "Stock"];
    const tableRows = stocklibros.map(skt => [
      skt.tituloLibro,
      skt.cantidad,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
    });

    doc.save('stock.pdf');
  };

  return (
    <div className="container mt-4">
      {/* Card Header */}
      <div className="card border-top-0">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Stock de Libros</h2>
            <div>
            <button className="btn btn-light ms-2" onClick={exportToPDF}>
              <i className="bi bi-file-earmark-pdf me-2 text-danger h6"></i>Exportar a PDF
            </button>
              <button className="btn btn-light ms-2" onClick={() => setModalShowEntrada(true)}>
                Agregar Entrada
              </button>
              <button className="btn btn-light ms-2" onClick={() => setModalShowSalida(true)}>
                Agregar Salida
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Entrada */}
      {modalShowEntrada && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden={!modalShowEntrada} {...(modalShowEntrada && { inert: true })}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Entrada</h5>
                <button type="button" className="btn-close" onClick={handleCloseModalEntrada} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="idLibro" className="form-label">Selecciona un Libro</label>
                  <Select
                    id="idLibro"
                    options={libroOptions}
                    onChange={handleSelectChangeEntrada}
                    value={libroOptions.find((option) => option.value === nuevoStockEntrada.idLibro)}
                    placeholder="Selecciona un libro"
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={nuevoStockEntrada.cantidad}
                    onChange={(e) => setNuevoStockEntrada({ ...nuevoStockEntrada, cantidad: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="motivo" className="form-label">Motivo</label>
                  <div id="motivo" name="motivo" className="d-flex">
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoCompra"
                        name="motivo"
                        value="Compra"
                        checked={nuevoStockEntrada.motivo === "Compra"}
                        onChange={(e) => setNuevoStockEntrada({ ...nuevoStockEntrada, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoCompra">Compra</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoDevolucion"
                        name="motivo"
                        value="Devolución"
                        checked={nuevoStockEntrada.motivo === "Devolución"}
                        onChange={(e) => setNuevoStockEntrada({ ...nuevoStockEntrada, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoDevolucion">Devolución</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModalEntrada}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={agregarEntrada}>Agregar Entrada</button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Modal para Agregar Salida */}
      {modalShowSalida && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Salida</h5>
                <button type="button" className="btn-close" onClick={handleCloseModalSalida} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="idLibro" className="form-label">Selecciona un Libro</label>
                  <Select
                    id="idLibro"
                    options={libroOptions}
                    onChange={handleSelectChangeSalida}
                    value={libroOptions.find((option) => option.value === nuevoStockSalida.idLibro)}
                    placeholder="Selecciona un libro"
                    isClearable
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={nuevoStockSalida.cantidad}
                    onChange={(e) => setNuevoStockSalida({ ...nuevoStockSalida, cantidad: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="motivo" className="form-label">Motivo</label>
                  <div id="motivo" name="motivo" className="d-flex">
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoVenta"
                        name="motivo"
                        value="Venta"
                        checked={nuevoStockSalida.motivo === "Venta"}
                        onChange={(e) => setNuevoStockSalida({ ...nuevoStockSalida, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoVenta">Venta</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoPerdida"
                        name="motivo"
                        value="Pérdida"
                        checked={nuevoStockSalida.motivo === "Pérdida"}
                        onChange={(e) => setNuevoStockSalida({ ...nuevoStockSalida, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoPerdida">Pérdida</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModalSalida}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={agregarSalida}>Agregar Salida</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Stock */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Libro</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {stocklibros.map((skt) => (
            <tr key={skt.tituloLibro}>
              <td>{skt.tituloLibro}</td>
              <td>{skt.cantidad}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Stock;
