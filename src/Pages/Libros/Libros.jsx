import React, { useState, useEffect } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const Libros = () => {
  const urlLibros = 'http://localhost:8080/apiv1/libros/listar';
  const urlAutores = 'http://localhost:8080/apiv1/autores/listar';

  const [libros, setLibros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [nuevoLibro, setNuevoLibro] = useState({ titulo: '', fechaPublicacion: '', idAutor: '' });
  const [nuevoAutor, setNuevoAutor] = useState({ nombre: '' });
  const [modalShow, setModalShow] = useState(false);
  const [modalAutorShow, setModalAutorShow] = useState(false);

  // Crear una instancia de Notyf
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
    // Validar si los campos obligatorios están vacíos
    if (!nuevoLibro.titulo || !nuevoLibro.fechaPublicacion || !nuevoLibro.idAutor) {
      notyf.error('Todos los campos son requeridos');
      return; // Detener el proceso si algún campo requerido está vacío
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
      notyf.success('Libro agregado correctamente'); // Mostrar la alerta de éxito
    } else {
      notyf.error('Este Libro ya existe'); // Mostrar la alerta de error si algo sale mal
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
      setNuevoAutor({ nombre: '' }); // Limpiar el formulario del autor
      fetchAutores(); // Recargar la lista de autores
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

  useEffect(() => {
    fetchLibros();  // Cargar libros cuando el componente se monta
    fetchAutores();  // Cargar autores cuando el componente se monta
  }, []);

  return (
    <div className="container mt-4">
      <div className="card border-top-0">
        <div className="card-header bg-primary border-top p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="m-0 text-white">Lista de Libros</h2>
            <button className="btn btn-light" onClick={() => setModalShow(true)}>
              Agregar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Libro */}
      <div className={`modal fade ${modalShow ? 'show' : ''}`} style={{ display: modalShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Libro</h5>
              <button type="button" className="btn-close" onClick={() => setModalShow(false)} aria-label="Close"></button>
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
                  <div className="d-flex justify-content-between">
                    <select
                      className="form-select"
                      id="idAutor"
                      name="idAutor"
                      value={nuevoLibro.idAutor}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona un autor</option>
                      {autores.map((autor) => (
                        <option key={autor.idAutor} value={autor.idAutor}>
                          {autor.nombre}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-success ms-2"
                      onClick={() => setModalAutorShow(true)}
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={agregarLibro}>
                Guardar Libro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para Agregar Autor */}
      <div className={`modal fade ${modalAutorShow ? 'show' : ''}`} style={{ display: modalAutorShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Agregar Autor</h5>
              <button type="button" className="btn-close" onClick={() => setModalAutorShow(false)} aria-label="Close"></button>
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
              <button type="button" className="btn btn-secondary" onClick={() => setModalAutorShow(false)}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={agregarAutor}>
                Guardar Autor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mostrar la lista de libros */}
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

  );
};

export default Libros;
