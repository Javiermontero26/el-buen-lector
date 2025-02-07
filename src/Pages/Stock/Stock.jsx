import React, { useEffect, useState, useRef } from 'react';
import { Notyf } from 'notyf';
import Select from 'react-select';

const Stock = () => {

  // APIS STOCK
  const urlGet = 'http://localhost:8080/apiv1/stocklibros/listar';
  const urlPostEntrada = 'http://localhost:8080/apiv1/stocklibros/registrar';
  const urlPostSalida = 'http://localhost:8080/apiv1/stocklibros/salidareg';
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';
  const urlUpdateStock = 'http://localhost:8080/api/stock/actualizar';

  // ESTADOS
  const tablaStock = useRef(null);
  const [stocklibros, setStockLibros] = useState([]);
  const [stockFiltrados, setStockFiltrados] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [libros, setLibros] = useState([]);
  const [nuevoStockEntrada, setNuevoStockEntrada] = useState({ idLibro: '', cantidad: '', motivo: '' });
  const [nuevoStockSalida, setNuevoStockSalida] = useState({ idLibro: '', cantidad: '', motivo: '', stockDisponible: 0 });
  const [modalShowEntrada, setModalShowEntrada] = useState(false);
  const [modalShowSalida, setModalShowSalida] = useState(false);
  const [modalShowEditar, setModalShowEditar] = useState(false);
  const [stockAEditar, setStockAEditar] = useState(null);
  const token = localStorage.getItem('accessToken');

  // INSTANCIA PARA USAR NOTYF Y AGREGAR PROPIEDADES A LA ALERTA
  const notyf = new Notyf();

  // OBTENER STOCK CON API GET
  const fetchStock = async () => {

    try {
      // Realizar la solicitud con el token en los encabezados
      const response = await fetch(urlGet, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const responseJSON = await response.json();
        setStockLibros(responseJSON);
        setStockFiltrados(responseJSON);
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de API:', error);
    }
  };

  // OBTENER LIBROS CON API GET
  const fetchLibros = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(urlLibros, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const responseJSON = await response.json();
      setLibros(responseJSON);
    } catch (error) {
      console.error('Error al obtener libros:', error);
      notyf.error('Error al cargar los libros');
    }
  };

  // AGREGAR ENTRADA A STOCK (AUMENTA LA CANTIDAD)
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
          'Authorization': `Bearer ${token}`,
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

  // AGREGAR SALIDA A STOCK (DISMINUYE LA CANTIDAD)
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
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idLibro: parseInt(nuevoStockSalida.idLibro),
          cantidad: parseInt(nuevoStockSalida.cantidad),
          motivo: nuevoStockSalida.motivo,
        }),
      });

      if (response.ok) {
        fetchStock();
        setNuevoStockSalida({ idLibro: '', cantidad: '', motivo: '', stockDisponible: 0 });
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

  //Editar Stock
  const editarStock = async () => {
    if (!stockAEditar.idLibro || !stockAEditar.cantidad) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    if (isNaN(stockAEditar.cantidad) || parseInt(stockAEditar.cantidad) < 0) {
      notyf.error('La cantidad debe ser un número positivo');
      return;
    }

    try {
      const libroSeleccionado = libros.find(libro => libro.idLibro === stockAEditar.idLibro);
      if (!libroSeleccionado) {
        notyf.error('Libro no encontrado');
        return;
      }

      const response = await fetch(urlUpdateStock, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          idLibro: stockAEditar.idLibro,
          cantidad: parseInt(stockAEditar.cantidad),
          tituloLibro: libroSeleccionado.titulo,
        }),
      });

      if (response.ok) {
        fetchStock();
        setModalShowEditar(false);
        notyf.success('Stock actualizado correctamente');
      } else {
        const errorData = await response.json();
        notyf.error('Error al actualizar stock: ' + (errorData.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      notyf.error('Hubo un error al conectar con el servidor.');
    }
  };


  // CON ESTO CERRAMOS LOS MODALES Y SE PIERDEN LOS DATOS ANTES ESCRITOS O SELECCIONADOS
  const handleCloseModalEntrada = () => {
    setNuevoStockEntrada({ idLibro: '', cantidad: '', motivo: '' });
    setModalShowEntrada(false);
  };

  const handleCloseModalSalida = () => {
    setNuevoStockSalida({ idLibro: '', cantidad: '', motivo: '', stockDisponible: 0 });
    setModalShowSalida(false);
  };

  // FUNCIONES DE EDICIÓN
  const abrirModalEditar = (stock) => {
    setStockAEditar({
      idLibro: stock.libro.idLibro,
      cantidad: stock.cantidadTotal,
    });
    setModalShowEditar(true);
  };

  const handleCloseModalEditar = () => {
    setStockAEditar(null);
    setModalShowEditar(false);
  };

  useEffect(() => {
    fetchStock();
    fetchLibros();
  }, []);

  // OPCIONES DE REACT-SELECT
  const libroOptions = libros.map((libro) => ({
    value: libro.idLibro,
    label: libro.titulo,
  }));

  // OPCIONES DE REACT-SELECT PARA SALIDAS (solo libros con stock disponible)
  const libroOptionsSalida = stocklibros
    .filter((stock) => stock.cantidadTotal >= 1)  // Solo los libros con stock mayor a 1
    .map((stock) => ({
      value: stock.libro.idLibro,
      label: stock.libro.titulo,
    }));

  // Función de cambio para cantidad
  const handleCantidadChangeEditar = (e) => {
    const value = e.target.value;
    if (/^[0-9]*$/.test(value)) {
      setStockAEditar({ ...stockAEditar, cantidad: value });
    }
  };

  //SELECT ENTRADAS
  const handleSelectChangeEntrada = (selectedOption) => {
    setNuevoStockEntrada({
      ...nuevoStockEntrada,
      idLibro: selectedOption ? selectedOption.value : ''
    });
  };

  //SELECT SALIDAS
  const handleSelectChangeSalida = (selectedOption) => {
    const selectedLibro = stocklibros.find((stock) => stock.libro.idLibro === selectedOption.value);
    setNuevoStockSalida({
      ...nuevoStockSalida,
      idLibro: selectedOption.value,
      stockDisponible: selectedLibro ? selectedLibro.cantidadTotal : 0,
    });
  };

  // LOGICA PARA QUE SE CAMBIE SOLA LA CANTIDAD SI ES MAYOR Al STOCK DISPONIBLE
  const handleCantidadChange = (e) => {
    const value = e.target.value;

    // VALIDACION PARA NUMEROS ENTEROS Y QUE NO EXEDA EL SOCTK DISPONIBLE
    if (/^[0-9]*$/.test(value)) {
      // SI EL VALOR INGRESADOR ES MAYOR QUE EL STOCK, SE AJUSTA AUTOMATICAMENTE AL STOCK DISPONIBLEE
      const cantidad = Math.min(parseInt(value) || 0, nuevoStockSalida.stockDisponible);

      // ACTUALIZA EL ESTADO A LA CANTIDAD AJUSTADA
      setNuevoStockSalida({ ...nuevoStockSalida, cantidad: cantidad });
    }
  };

  //-------------- BUSQUEDA ------------//

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = stocklibros.filter((skt) =>
      skt.libro.titulo.toLowerCase().includes(query) ||
      skt.cantidadTotal.toString().includes(query)
    );

    setStockFiltrados(filtered);
  };

  // Función para limpiar el campo de búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setStockFiltrados(stocklibros);
  };

  //-------------- FIN BUSQUEDA ------------//

  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE STOCK DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Cantidad"];
    const tableRows = stockFiltrados.map(skt => [
      skt.libro.titulo,
      skt.cantidadTotal,
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
      {/* Card Header */}
      <div className="card border-top-0 mb-2">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Stock de Libros</h2>
            <div>
              <button className="btn btn-light me-2" onClick={exportToPDF}
                disabled={localStorage.getItem('role') !== 'Admin'}>
                <i className="bi bi-file-earmark-pdf me-2 text-danger h5"></i>Exportar a PDF
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
                    type="text"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={nuevoStockEntrada.cantidad}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9]*$/.test(value)) {
                        setNuevoStockEntrada({ ...nuevoStockEntrada, cantidad: value });
                      }
                    }}
                    required
                    maxLength={5}
                    disabled={!nuevoStockEntrada.idLibro}
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
                    options={libroOptionsSalida}
                    onChange={handleSelectChangeSalida}
                    value={libroOptionsSalida.find((option) => option.value === nuevoStockSalida.idLibro)}
                    placeholder="Selecciona un libro"
                    isClearable
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={nuevoStockSalida.cantidad}
                    onChange={handleCantidadChange}
                    required
                    maxLength={5}
                    disabled={!nuevoStockSalida.idLibro}
                  />
                  {nuevoStockSalida.stockDisponible !== undefined && (
                    <small className="form-text text-muted">
                      Stock Disponible: {nuevoStockSalida.stockDisponible}
                    </small>
                  )}
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

      {/* Modal de Editar Stock */}
      {modalShowEditar && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Stock de Libro</h5>
                <button type="button" className="btn-close" onClick={handleCloseModalEditar} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="idLibro" className="form-label">Selecciona un Libro</label>
                  <Select
                    id="idLibro"
                    options={libroOptions}
                    onChange={(selectedOption) => setStockAEditar({ ...stockAEditar, idLibro: selectedOption.value })}
                    value={libroOptions.find((option) => option.value === stockAEditar.idLibro)}
                    placeholder="Selecciona un libro"
                    isClearable isDisabled
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="cantidad" className="form-label">Cantidad</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cantidad"
                    name="cantidad"
                    value={stockAEditar.cantidad}
                    onChange={handleCantidadChangeEditar}
                    required
                    maxLength={5}
                  />
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModalEditar}>Cerrar</button>
                <button type="button" className="btn btn-primary" onClick={editarStock}>Actualizar Stock</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de Stock */}
      <div className="table-container">
        <table ref={tablaStock} className="table table-striped">
          <thead>
            <tr>
              <th>Libro</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {searchQuery && stockFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  El libro no existe
                </td>
              </tr>
            ) : (
              stockFiltrados.map((skt) => (
                <tr key={skt.idStock}>
                  <td className='col-8'>{skt.libro.titulo}</td>
                  <td>{skt.cantidadTotal}</td>
                  <td>
                    <span
                      className={`edit ${localStorage.getItem('role') !== 'Admin' ? 'disabled' : ''}`}
                      title="Editar"
                      onClick={() => abrirModalEditar(skt)}
                      style={{ pointerEvents: localStorage.getItem('role') !== 'Admin' ? 'none' : 'auto', opacity: localStorage.getItem('role') !== 'Admin' ? 0.5 : 1 }}>
                      <i className="material-icons">&#xE254;</i>
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
