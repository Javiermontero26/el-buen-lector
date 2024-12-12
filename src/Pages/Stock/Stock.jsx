import React, { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import Select from 'react-select';  // Importar el componente Select

const Stock = () => {
  // URLs de la API
  const urlGet = 'http://localhost:8080/apiv1/stocklibros/listar';
  const urlPost = 'http://localhost:8080/apiv1/stocklibros/registrar';
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';  // URL para obtener los libros

  // Estados
  const [stocklibros, setStockLibros] = useState([]);
  const [libros, setLibros] = useState([]);  // Estado para almacenar los libros
  const [nuevoStock, setNuevoStock] = useState({ idLibro: '', cantidad: '', motivo: '' });
  const [modalShow, setModalShow] = useState(false);

  // Crear una instancia de Notyf para notificaciones
  const notyf = new Notyf();

  // Obtener stock de libros
  const fetchStock = async () => {
    const response = await fetch(urlGet);
    const responseJSON = await response.json();
    setStockLibros(responseJSON);
  };

  // Obtener libros para el select en el modal
  const fetchLibros = async () => {
    const response = await fetch(urlLibros);
    const responseJSON = await response.json();
    setLibros(responseJSON);
  };

  // Agregar nuevo stock
  const agregarStock = async () => {
    // Validar si los campos son válidos
    if (!nuevoStock.idLibro || !nuevoStock.cantidad || !nuevoStock.motivo) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    try {
      const response = await fetch(urlPost, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idLibro: parseInt(nuevoStock.idLibro),  // Asegurarnos de que idLibro sea un número
          cantidad: parseInt(nuevoStock.cantidad), // Asegurarnos de que la cantidad sea un número
          motivo: nuevoStock.motivo, // El motivo
        }),
      });

      if (response.ok) {
        fetchStock(); // Recargar la lista de stock
        setNuevoStock({ idLibro: '', cantidad: '', motivo: '' }); // Limpiar los campos del formulario
        setModalShow(false); // Cerrar el modal
        notyf.success('Stock agregado correctamente');
      } else {
        const errorData = await response.json();
        console.error('Error al agregar stock:', errorData);
        notyf.error('Error al agregar stock: ' + (errorData.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      notyf.error('Hubo un error al conectar con el servidor.');
    }
  };

  // Función para limpiar el formulario y cerrar el modal
  const handleCloseModal = () => {
    setNuevoStock({ idLibro: '', cantidad: '', motivo: '' });  // Limpiar el estado
    setModalShow(false);  // Cerrar el modal
  };

  useEffect(() => {
    fetchStock();  // Cargar stock cuando el componente se monta
    fetchLibros();  // Cargar los libros cuando el componente se monta
  }, []);

  // Opciones para React-Select
  const libroOptions = libros.map((libro) => ({
    value: libro.idLibro,
    label: libro.titulo
  }));

  // Manejador de cambio de selección en React-Select
  const handleSelectChange = (selectedOption) => {
    setNuevoStock({
      ...nuevoStock,
      idLibro: selectedOption ? selectedOption.value : ''
    });
  };

  return (
    <div className="container mt-4">
      {/* Card Header */}
      <div className="card border-top-0">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Stock de Libros</h2>
            <div>
              <button className="btn btn-light" onClick={() => setModalShow(true)}>
                Agregar Entrada
              </button>
              <button className="btn btn-light ms-2">
                Agregar Salida
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Stock */}
      {modalShow && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Entrada</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="idLibro" className="form-label">Selecciona un Libro</label>
                  <Select
                    id="idLibro"
                    options={libroOptions}
                    onChange={handleSelectChange}
                    value={libroOptions.find((option) => option.value === nuevoStock.idLibro)}
                    placeholder="Selecciona un libro"
                    isClearable//={false}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input
                    type="number"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={nuevoStock.cantidad}
                    onChange={(e) => setNuevoStock({ ...nuevoStock, cantidad: e.target.value })}
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
                        checked={nuevoStock.motivo === "Compra"}
                        onChange={(e) => setNuevoStock({ ...nuevoStock, motivo: e.target.value })}
                        required
                      />
                      <label className="form-check-label" htmlFor="motivoCompra">
                        Compra
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoVenta"
                        name="motivo"
                        value="Venta"
                        checked={nuevoStock.motivo === "Venta"}
                        onChange={(e) => setNuevoStock({ ...nuevoStock, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoVenta">
                        Venta
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input bg-secondary"
                        id="motivoDevolucion"
                        name="motivo"
                        value="Devolución"
                        checked={nuevoStock.motivo === "Devolución"}
                        onChange={(e) => setNuevoStock({ ...nuevoStock, motivo: e.target.value })}
                      />
                      <label className="form-check-label" htmlFor="motivoDevolucion">
                        Devolución
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cerrar
                </button>
                <button type="button" className="btn btn-primary" onClick={agregarStock}>
                  Guardar
                </button>
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
