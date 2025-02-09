import React, { useState, useEffect } from 'react';
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
  const [modalEditShow, setModalEditShow] = useState(false);
  const [libroEditar, setLibroEditar] = useState(null);
  const [modalDeleteShow, setModalDeleteShow] = useState(false);
  const [libroEliminar, setLibroEliminar] = useState(null);

  const notyf = new Notyf();

  const fetchLibros = async () => {
    const token = localStorage.getItem('accessToken');
    try {
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
      setModalAutorShow(false);
      notyf.success('Autor agregado correctamente');
    } else {
      notyf.error('Hubo un error al agregar el autor');
    }
  };

  const editarLibro = async () => {
    if (!libroEditar.titulo || !libroEditar.fechaPublicacion || !libroEditar.idAutor) {
      notyf.error('Todos los campos son requeridos');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const response = await fetch(`http://localhost:8080/apiv1/libros/actualizar/${libroEditar.idLibro}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(libroEditar),
    });

    if (response.ok) {
      fetchLibros();
      setModalEditShow(false);
      setLibroEditar(null);
      notyf.success('Libro actualizado correctamente');
    } else {
      notyf.error('Hubo un error al actualizar el libro');
    }
  };

  // Delete book function
  const eliminarLibro = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://localhost:8080/apiv1/libros/eliminar/${libroEliminar.idLibro}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchLibros();
        setModalDeleteShow(false);
        setLibroEliminar(null);
        notyf.success('Libro eliminado correctamente');
      } else {
        notyf.error('Error al eliminar el libro, Stock existente.');
      }
    } catch (error) {
      console.error('Error en la solicitud de API para eliminar:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoLibro({
      ...nuevoLibro,
      [name]: value,
    });
  };

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setLibroEditar({
      ...libroEditar,
      [name]: value,
    });
  };

  const handleChangeAutor = (e) => {
    const { name, value } = e.target;
    setNuevoAutor({
      ...nuevoAutor,
      [name]: value,
    });
  };

  const handleCloseModal = () => {
    setNuevoLibro({ titulo: '', fechaPublicacion: '', idAutor: '' });
    setModalShow(false);
  };

  const handleCloseModalAutor = () => {
    setNuevoAutor({ nombre: '' });
    setModalAutorShow(false);
  };

  const handleCloseModalEdit = () => {
    setLibroEditar(null);
    setModalEditShow(false);
  };

  const openModalEdit = (libro) => {
    setLibroEditar({
      idLibro: libro.idLibro,
      titulo: libro.titulo,
      fechaPublicacion: libro.fechaPublicacion,
      idAutor: libro.autor.idAutor,
    });
    setModalEditShow(true);
  };

  // Modal handlers
  const handleCloseModalDelete = () => {
    setModalDeleteShow(false);
    setLibroEliminar(null);
  };

  const openModalDelete = (libro) => {
    setLibroEliminar(libro);
    setModalDeleteShow(true);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setLibrosFiltrados(libros);
  };

  useEffect(() => {
    fetchLibros();
    fetchAutores();
  }, []);

  const autorOptions = autores.map((autor) => ({
    value: autor.idAutor,
    label: autor.nombre,
  }));

  const handleSelectChange = (selectedOption) => {
    setNuevoLibro({
      ...nuevoLibro,
      idAutor: selectedOption ? selectedOption.value : '',
    });
  };

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

  const exportToPDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
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
              <button className="btn btn-light me-2" onClick={exportToPDF}
                disabled={localStorage.getItem('role') !== 'Admin'}>
                <i className="bi bi-file-earmark-pdf me-2 text-danger h5"></i>Exportar a PDF
              </button>
              <button className="btn btn-light" onClick={() => setModalShow(true)}>
                Agregar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 d-flex align-items-center col-12 col-md-12 col-lg-3 ms-auto">
        <label htmlFor="Busquedas" className="me-2">Filtrar:</label>
        <div className="position-relative">
          <input
            type="text"
            className="form-control"
            value={searchQuery}
            onChange={handleSearch}
          />
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
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={nuevoLibro.titulo}
                    onChange={handleChange}
                    maxLength={255}
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
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idAutor" className="form-label">Autor</label>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 me-2">
                      <Select
                        id="idAutor"
                        options={autorOptions}
                        onChange={handleSelectChange}
                        value={autorOptions.find((option) => option.value === nuevoLibro.idAutor) || null}
                        placeholder="Selecciona un autor"
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => setModalAutorShow(true)}
                    >
                      Agregar Autor
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={agregarLibro}>Guardar Libro</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${modalEditShow ? 'show' : ''}`} style={{ display: modalEditShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Editar Libro</h5>
              <button type="button" className="btn-close" onClick={handleCloseModalEdit} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="titulo" className="form-label">Título</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titulo"
                    name="titulo"
                    value={libroEditar?.titulo || ''}
                    onChange={handleChangeEdit}
                    maxLength={255}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="fechaPublicacion" className="form-label">Fecha de Publicación</label>
                  <input
                    type="date"
                    className="form-control"
                    id="fechaPublicacion"
                    name="fechaPublicacion"
                    value={libroEditar?.fechaPublicacion || ''}
                    onChange={handleChangeEdit}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idAutor" className="form-label">Autor</label>
                  <div className="d-flex align-items-center">
                    <div className="flex-grow-1 me-2">
                      <Select
                        id="idAutor"
                        options={autorOptions}
                        value={autorOptions.find((option) => option.value === libroEditar?.idAutor) || null}
                        onChange={(selectedOption) => setLibroEditar({ ...libroEditar, idAutor: selectedOption ? selectedOption.value : '' })}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={() => setModalAutorShow(true)}
                    >
                      Agregar Autor
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModalEdit}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={editarLibro}>Actualizar Libro</button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${modalDeleteShow ? 'show' : ''}`} style={{ display: modalDeleteShow ? 'block' : 'none' }} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmar Eliminación</h5>
              <button type="button" className="btn-close" onClick={handleCloseModalDelete} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que quieres eliminar el libro <strong>{libroEliminar?.titulo}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModalDelete}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={eliminarLibro}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>

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
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={nuevoAutor.nombre}
                    onChange={handleChangeAutor}
                    maxLength={255}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModalAutor}>Cancelar</button>
              <button type="button" className="btn btn-primary" onClick={agregarAutor}>Agregar Autor</button>
            </div>
          </div>
        </div>
      </div>

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
            {searchQuery && librosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No se encontraron Libros
                </td>
              </tr>
            ) : (
              librosFiltrados.map((libro) => (
                <tr key={libro.idLibro}>
                  <td hidden>{libro.idLibro}</td>
                  <td>{libro.titulo}</td>
                  <td>{libro.fechaPublicacion}</td>
                  <td hidden>{libro.autor.idAutor}</td>
                  <td>{libro.autor.nombre}</td>
                  <td>
                    <span className="edit" title="Editar" onClick={() => openModalEdit(libro)}>
                      <i className="material-icons">&#xE254;</i>
                    </span>
                    <span className="delete" title="Eliminar" onClick={() => openModalDelete(libro)}>
                      <i className="material-icons">&#xE872;</i>
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

export default Libros;