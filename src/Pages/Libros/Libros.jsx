import React, { useState, useEffect, useRef } from 'react';
import { Notyf } from 'notyf';
import Select from 'react-select';
import 'notyf/notyf.min.css';

const Libros = () => {
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';
  const urlAutores = 'http://localhost:8080/apiv1/autores/listar';

  const [libros, setLibros] = useState([]);
  const tablalibros = useRef(null);
  const [autores, setAutores] = useState([]);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', fechaPublicacion: '', idAutor: '' });
  const [nuevoAutor, setNuevoAutor] = useState({ nombre: '' });
  const [modalShow, setModalShow] = useState(false);
  const [modalAutorShow, setModalAutorShow] = useState(false);

  const notyf = new Notyf();

  // Obtener los libros desde la API
  const fetchLibros = async () => {
    const response = await fetch(urlLibros);
    const responseJSON = await response.json();
    setLibros(responseJSON);
  };

  // Obtener los autores desde la API
  const fetchAutores = async () => {
    const response = await fetch(urlAutores);
    const responseJSON = await response.json();
    setAutores(responseJSON);
  };

  // Agregar un nuevo libro a la API
  const agregarLibro = async () => {
    if (!nuevoLibro.titulo || !nuevoLibro.fechaPublicacion || !nuevoLibro.idAutor) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    const response = await fetch('http://localhost:8080/apiv1/libros', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoLibro),
    });

    if (response.ok) {
      fetchLibros(); // Recargar la lista de libros
      setModalShow(false); // Cerrar el modal
      setNuevoLibro({ titulo: '', fechaPublicacion: '', idAutor: '' }); // Limpiar el formulario
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

    const response = await fetch('http://localhost:8080/apiv1/autores/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

  // Exportar a PDF
  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título del PDF
    doc.setFontSize(18);
    doc.text("LISTA DE LIBROS", 14, 16);

    const tableColumn = ["Título", "Fecha Publicación", "Autor"];
    const tableRows = libros.map(libro => [
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

    doc.save('libros.pdf');
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

  // DataTable 
  useEffect(() => {
    if (libros.length > 0 && !$.fn.dataTable.isDataTable(tablalibros.current)) {
      $(tablalibros.current).DataTable({
        paging: true,
        lengthChange: false,
        searching: true,
        ordering: false,
        info: false,
        autoWidth: true,
        responsive: true,
        language: {
          search: "Buscar Libro:",
          paginate: {
            previous: "Anterior",
            next: "Siguiente",
          },
        },
      });
    }
  }, [libros]);



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
              <button className="btn btn-light" onClick={() => setModalShow(true)}>
                Agregar
              </button>
            </div>
          </div>
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
        <table ref={tablalibros} className="table table-striped" id="tablaLibros">
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
            {libros.map((libro) => (
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
