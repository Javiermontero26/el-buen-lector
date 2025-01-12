import React, { useEffect, useState } from 'react';

const Usuarios = () => {
    const url = 'http://localhost:8080/apiv1/usuarios/listar';
    const rolesUrl = 'http://localhost:8080/apiv1/roles/listar'; 
    const addUsuarioUrl = 'http://localhost:8080/apiv1/usuarios/add';
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]); // Estado para los roles
    const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        apellidos: '',
        usuario: '',
        password: '',
        correo: '',
        telefono: '',
        img: null, // Aquí almacenamos la imagen
        idRol: '', // Asegúrate de tener los ID de los roles disponibles
        idEstado: '', // Asegúrate de tener los ID de los estados disponibles
    });

    // Función para obtener los usuarios desde la API
    const fetchUsuarios = async () => {
        const token = localStorage.getItem('accessToken'); // Obtener token del localStorage
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Agregar el token al header
                },
            });

            const responseJSON = await response.json();
            setUsuarios(responseJSON);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    // Función para obtener los roles desde la API
    const fetchRoles = async () => {
        const token = localStorage.getItem('accessToken'); // Obtener token del localStorage
        try {
            const response = await fetch(rolesUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Agregar el token al header
                },
            });

            const responseJSON = await response.json();
            setRoles(responseJSON);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    };

    // Llamadas a las APIs cuando el componente se monta
    useEffect(() => {
        fetchUsuarios();
        fetchRoles(); // Llamada para obtener los roles
    }, []);

    // Función para abrir el modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // Manejo del cambio en el formulario de agregar usuario
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            // Si el campo es un archivo, actualizamos el estado con el archivo
            setNuevoUsuario((prevState) => ({
                ...prevState,
                [name]: files[0], // Guardamos el archivo en el estado
            }));
        } else {
            // Para los otros campos, actualizamos el valor en el estado
            setNuevoUsuario((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Enviar el formulario para agregar un nuevo usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('accessToken'); // Obtener token del localStorage
        const formData = new FormData();

        // Añadimos todos los datos del formulario al FormData
        for (const key in nuevoUsuario) {
            formData.append(key, nuevoUsuario[key]);
        }

        try {
            const response = await fetch(addUsuarioUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Agregar el token al header
                },
                body: formData, // Enviar los datos con FormData
            });

            if (response.ok) {
                // Si la respuesta es exitosa, actualizamos la lista de usuarios
                fetchUsuarios();
                handleCloseModal(); // Cerrar el modal después de agregar el usuario
            } else {
                // Si hay un error
                console.error('Error al agregar el usuario');
            }
        } catch (error) {
            console.error('Error al enviar los datos del usuario:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card border-top-0 mb-2">
                <div className="card-header bg-primary border-top p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="m-0 text-white">Lista de Usuarios</h2>
                        {/* Botón para abrir el modal */}
                        <button className="btn btn-light" onClick={handleOpenModal}>
                            Agregar Usuario
                        </button>
                    </div>
                </div>
            </div>

            {/* Lista de Usuarios */}
            <div className="table-container">
                <table className="table table-striped" id="tablaSalidas">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Telefono</th>
                            <th>Img</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usu) => (
                            <tr key={usu.idUsuario}>
                                <td>{usu.nombre}</td>
                                <td>{usu.apellidos}</td>
                                <td>{usu.usuario}</td>
                                <td>{usu.correo}</td>
                                <td>{usu.telefono}</td>
                                <td>
                                    {usu.img && (
                                        <img
                                            src={`http://localhost:8080/apiv1/usuarios/images/${usu.img}`}
                                            alt={usu.nombre}
                                            width="100"
                                            height="100"
                                            className="img-fluid"
                                        />
                                    )}
                                </td>
                                <td>{usu.rol.nombre}</td>
                                <td>{usu.estado.nombre}</td>
                                <td>
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

            {/* Modal para agregar usuario */}
            {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header col-6">
                                <h5 className="modal-title">Agregar Usuario</h5>
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                    aria-label="Close"
                                    onClick={handleCloseModal}
                                >
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nombre"
                                            value={nuevoUsuario.nombre}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellidos</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="apellidos"
                                            value={nuevoUsuario.apellidos}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Usuario</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="usuario"
                                            value={nuevoUsuario.usuario}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Contraseña</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            value={nuevoUsuario.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Correo</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="correo"
                                            value={nuevoUsuario.correo}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="telefono"
                                            value={nuevoUsuario.telefono}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    {/* Campo de carga de imagen */}
                                    <div className="form-group">
                                        <label>Imagen</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="img"
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Rol</label>
                                        <select
                                            className="form-control"
                                            name="idRol"
                                            value={nuevoUsuario.idRol}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un rol</option>
                                            {roles.map((rol) => (
                                                <option key={rol.idRol} value={rol.idRol}>
                                                    {rol.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            className="form-control"
                                            name="idEstado"
                                            value={nuevoUsuario.idEstado}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Selecciona un estado</option>
                                            <option value="1">Activo</option>
                                            <option value="0">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Guardar Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;
