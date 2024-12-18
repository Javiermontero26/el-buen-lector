import React, { useEffect, useState } from 'react';

const Usuarios = () => {
    const url = 'http://localhost:8080/apiv1/usuarios/listar';
    const rolesUrl = 'http://localhost:8080/apiv1/roles/listar'; // URL para obtener los roles
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
        img: '',
        idRol: '', // Asegúrate de tener los ID de los roles disponibles
        idEstado: '', // Asegúrate de tener los ID de los estados disponibles
    });

    // Función para obtener los usuarios desde la API
    const fetchUsuarios = async () => {
        const response = await fetch(url);
        const responseJSON = await response.json();
        setUsuarios(responseJSON);
    };

    // Función para obtener los roles desde la API
    const fetchRoles = async () => {
        const response = await fetch(rolesUrl);
        const responseJSON = await response.json();
        setRoles(responseJSON); // Guardamos los roles en el estado
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
        const { name, value } = e.target;
        setNuevoUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Enviar el formulario para agregar un nuevo usuario
    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8080/apiv1/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoUsuario),
        });

        if (response.ok) {
            // Si la respuesta es exitosa, actualizamos la lista de usuarios
            fetchUsuarios();
            handleCloseModal(); // Cerrar el modal después de agregar el usuario
        } else {
            // Si hay un error
            console.error('Error al agregar el usuario');
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
                            <th>Password</th>
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
                                <td>{usu.password}</td>
                                <td>{usu.correo}</td>
                                <td>{usu.telefono}</td>
                                <td>{usu.img}</td>
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
                            <div className="modal-header">
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
                                    {/* Select de Roles */}
                                    <div className="form-group">
                                        <label>Rol</label>
                                        <select
                                            className="form-control"
                                            name="idRol"
                                            value={nuevoUsuario.idRol}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar Rol</option>
                                            {roles.map((rol) => (
                                                <option key={rol.idRol} value={rol.idRol}>
                                                    {rol.nombre}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Select de Estado */}
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            className="form-control"
                                            name="idEstado"
                                            value={nuevoUsuario.idEstado}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar Estado</option>
                                            <option value="1">Activo</option>
                                            <option value="2">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCloseModal}
                                    >
                                        Cerrar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Agregar Usuario
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
