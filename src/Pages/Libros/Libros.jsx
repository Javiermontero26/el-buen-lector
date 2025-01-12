import React, { useState, useEffect, useRef } from 'react';
import { Notyf } from 'notyf';
import Select from 'react-select';
import 'notyf/notyf.min.css';

const Libros = () => {
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';
  const urlAutores = 'http://localhost:8080/apiv1/autores/listar';

  const [libros, setLibros] = useState([]);
  const [librosFiltrados, setLibrosFiltrados] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [autores, setAutores] = useState([]);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', fechaPublicacion: '', idAutor: '' });
  const [nuevoAutor, setNuevoAutor] = useState({ nombre: '' });
  const [modalShow, setModalShow] = useState(false);
  const [modalAutorShow, setModalAutorShow] = useState(false);

  const notyf = new Notyf();

  // Función para obtener los datos de la API
  const fetchLibros = async () => {
    // Obtener el token de acceso del localStorage
    const token = localStorage.getItem('accessToken');

    try {
      // Realizar la solicitud con el token en los encabezados
      const response = await fetch(urlLibros, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  
        },
      });

      if (response.ok) {
        const responseJSON = await response.json();
        setLibros(responseJSON);
        setLibrosFiltrados(responseJSON); 
      } else {
        console.error('Error al obtener datos:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la solicitud de API:', error);
    }
  };

  // Obtener los autores desde la API
  const fetchAutores = async () => {
    const token = localStorage.getItem('accessToken');

    const response = await fetch(urlAutores, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const responseJSON = await response.json();
    setAutores(responseJSON);
  };

  // Agregar un nuevo libro a la API
  const agregarLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.fechaPublicacion || !nuevoLibro.idAutor) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:8080/apiv1/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoLibro),
    });

    if (response.ok) {
      fetchLibros();
      setModalShow(false);
      setNuevoLibro({ titulo: '', fechaPublicacion: '', idAutor: '' });
      notyf.success('Libro agregado correctamente');
    } else {
      notyf.error('Este Libro ya existe');
    }
  };

  // Agregar un nuevo autor a la API
  const agregarAutor = async () => {
    if (!nuevoAutor.nombre) {
      notyf.error('El nombre del autor es requerido');
      return;
    }

    const token = localStorage.getItem('accessToken');

    const response = await fetch('http://localhost:8080/apiv1/autores/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(nuevoAutor),
    });

    if (response.ok) {
      setNuevoAutor({ nombre: '' });
      fetchAutores();
      setModalAutorShow(false); // Cerrar el modal de autor
      notyf.success('Autor agregado correctamente');
    } else {
      notyf.error('Hubo un error al agregar el autor');
    }
  };

  // Manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro({
      ...nuevoLibro,
      [name]: value,
    });
  };

  // Manejar los cambios en el formulario de autor
  const handleChangeAutor = (e) => {
    const { name, value } = e.target;
    setNuevoAutor({
      ...nuevoAutor,
      [name]: value,
    });
  };

  // Función para limpiar el formulario y cerrar el modal
  const handleCloseModal = () => {
    setNuevoLibro({ titulo: '', fechaPublicacion: '', idAutor: '' });
    setModalShow(false);
  };

  // Función para limpiar el formulario de autor y cerrar el modal
  const handleCloseModalAutor = () => {
    setNuevoAutor({ nombre: '' });
    setModalAutorShow(false);
  };

  useEffect(() => {
    fetchLibros();
    fetchAutores();
  }, []);

  // Opciones para React-Select (de los autores)
  const autorOptions = autores.map((autor) => ({
    value: autor.idAutor,
    label: autor.nombre,
  }));

  // Manejador de cambio en el select de autor
  const handleSelectChange = (selectedOption) => {
    setNuevoLibro({
      ...nuevoLibro,
      idAutor: selectedOption ? selectedOption.value : '',
    });
  };

  //-------------- BUSQUEDA ------------//

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = libros.filter((libro) =>
      libro.titulo.toLowerCase().includes(query) ||
      libro.fechaPublicacion.toLowerCase().includes(query) ||
      libro.autor.nombre.toLowerCase().includes(query)
    );

    setLibrosFiltrados(filtered);
  };

  // Función para limpiar el campo de búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setLibrosFiltrados(libros);
  };

  //-------------- FIN BUSQUEDA ------------//

  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.setTextColor(255, 0, 0);
    doc.text("LISTA DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Fecha Pulbicacíon", "Autor"];
    const tableRows = librosFiltrados.map(libro => [
      libro.titulo,
      libro.fechaPublicacion,
      libro.autor.nombre,
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
          <div className="d-flex align-items-center">
            <h2 className="m-0 text-white flex-grow-1">Lista de Libros</h2>
            <div className="d-flex">
              <button className="btn btn-light me-2" onClick={exportToPDF}>
                <i className="bi bi-file-earmark-pdf me-2 text-danger h5"></i>Exportar a PDF
              </button>
              <button
                className="btn btn-light"
                onClick={() => setModalShow(true)}
                disabled={localStorage.getItem('role') !== 'Almacenero'}>
                Agregar
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

          {/* Limpiar Texto con la X*/}
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

      {/* Modal Libro */}
      <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Libro</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="titulo" className="form-label" required>Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={nuevoLibro.titulo}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fechaPublicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPublicacion"
                    name="fechaPublicacion"
                    value={nuevoLibro.fechaPublicacion}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idAutor" className="form-label">Autor</label>
                  <div className="d-flex">

                    <div className="flex-grow-1 me-2">
                      <Select
                        className="react-select-container"
                        id="idAutor"
                        options={autores.map(autor => ({ value: autor.idAutor, label: autor.nombre }))}
                        onChange={(selectedOption) => setNuevoLibro({ ...nuevoLibro, idAutor: selectedOption ? selectedOption.value : '' })}
                        value={autores.find(autor => autor.idAutor === nuevoLibro.idAutor) ? { value: nuevoLibro.idAutor, label: autores.find(autor => autor.idAutor === nuevoLibro.idAutor).nombre } : null}
                        placeholder="Selecciona un autor"
                        isClearable
                      />
                    </div>

                    <div>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => setModalAutorShow(true)}
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>

              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={agregarLibro}>
                Guardar Libro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Autor */}
      <div className={`modal fade ${modalAutorShow ? 'show' : ''}`} style={{ display: modalAutorShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Autor</h5>
              <button type="button" className="btn-close" onClick={handleCloseModalAutor} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre del Autor</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={nuevoAutor.nombre}
                    onChange={handleChangeAutor}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModalAutor}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={agregarAutor}>
                Guardar Autor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Libros */}
      <div className="table-container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th hidden>ID Libro</th>
              <th>Titulo</th>
              <th>Fecha Publicación</th>
              <th hidden>ID Autor</th>
              <th>Autor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {librosFiltrados.map((libro) => (
              <tr key={libro.id}>
                <td hidden>{libro.idLibro}</td>
                <td>{libro.titulo}</td>
                <td>{libro.fechaPublicacion}</td>
                <td hidden>{libro.autor.idAutor}</td>
                <td>{libro.autor.nombre}</td>
                <td>
                  <span className="edit" title="Editar" onClick={() => openModal('edit')}>
                    <i className="material-icons">&#xE254;</i>
                  </span>
                  <span className="delete" title="Eliminar" onClick={() => openModal('delete')}>
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

export default Libros;
