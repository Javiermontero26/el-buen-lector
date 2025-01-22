import React, { useEffect, useState } from 'react';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const Usuarios = () => {
    const url = 'http://localhost:8080/apiv1/usuarios/listar';
    const rolesUrl = 'http://localhost:8080/apiv1/roles/listar';
    const addUsuarioUrl = 'http://localhost:8080/apiv1/usuarios/add';
    const updateUsuarioUrl = 'http://localhost:8080/apiv1/usuarios/actualizar';
    const estadosUrl = 'http://localhost:8080/apiv1/estados/listar';
    const deleteUsuarioUrl = 'http://localhost:8080/apiv1/usuarios/eliminar';

    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [estados, setEstados] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoUsuario, setNuevoUsuario] = useState({
        nombre: '',
        apellidos: '',
        usuario: '',
        password: '',
        correo: '',
        telefono: '',
        idRol: '',
        idEstado: '',
    });
    const [editingUsuarioId, setEditingUsuarioId] = useState(null);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

    const notyf = new Notyf();

    const fetchUsuarios = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseJSON = await response.json();
            setUsuarios(responseJSON);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
        }
    };

    const fetchRoles = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(rolesUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseJSON = await response.json();
            setRoles(responseJSON);
        } catch (error) {
            console.error('Error al obtener roles:', error);
        }
    };

    const fetchEstados = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(estadosUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseJSON = await response.json();
            setEstados(responseJSON);
        } catch (error) {
            console.error('Error al obtener estados:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
        fetchEstados();
    }, []);

    const handleDelete = async () => {
        if (!usuarioAEliminar) return;

        const token = localStorage.getItem('accessToken');
        try {
            const response = await fetch(`${deleteUsuarioUrl}/${usuarioAEliminar}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchUsuarios();
                setShowModal(false);
                notyf.success('Usuario eliminado exitosamente!');
            } else {
                notyf.error('Error al eliminar el usuario. Por favor, inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            notyf.error('Error al eliminar el usuario. Por favor, inténtalo nuevamente.');
        }
    };

    const handleConfirmDelete = (idUsuario) => {
        setUsuarioAEliminar(idUsuario);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUsuarioAEliminar(null);
    };

    const handleOpenModal = (usuario = null) => {
        setShowModal(true);
        if (usuario) {
            setNuevoUsuario({
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                usuario: usuario.usuario,
                password: '',
                correo: usuario.correo,
                telefono: usuario.telefono,
                idRol: usuario.rol.idRol,
                idEstado: usuario.estado.idEstado,
            });
            setEditingUsuarioId(usuario.idUsuario);
        } else {
            setNuevoUsuario({
                nombre: '',
                apellidos: '',
                usuario: '',
                password: '',
                correo: '',
                telefono: '',
                idRol: '',
                idEstado: '',
            });
            setEditingUsuarioId(null);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNuevoUsuario((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('accessToken');
        const urlToUse = editingUsuarioId ? `${updateUsuarioUrl}/${editingUsuarioId}` : addUsuarioUrl;
        const method = editingUsuarioId ? 'PUT' : 'POST';

        try {
            const response = await fetch(urlToUse, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(nuevoUsuario),
            });

            if (response.ok) {
                fetchUsuarios();
                handleCloseModal();
                if (method === 'POST') {
                    notyf.success('Usuario agregado exitosamente!');
                } else if (method === 'PUT') {
                    notyf.success('Usuario actualizado exitosamente!');
                }
            } else {
                notyf.error('Error al guardar el usuario. Por favor, inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al enviar los datos del usuario:', error);
            notyf.error('Error al enviar los datos del usuario. Por favor, inténtalo nuevamente.');
        }
    };

    const handleEdit = (usuario) => {
        handleOpenModal(usuario);
    };

    return (
        <div className="container mt-4">
            <div className="card border-top-0 mb-2">
                <div className="card-header bg-primary border-top p-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="m-0 text-white">Lista de Usuarios</h2>
                        <button className="btn btn-light" onClick={() => handleOpenModal()}>Agregar Usuario</button>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table className="table table-striped" id="tablaUsuarios">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Usuario</th>
                            <th>Correo</th>
                            <th>Telefono</th>
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
                                <td>{usu.rol.nombre}</td>
                                <td>{usu.estado.nombre}</td>
                                <td>
                                    <span className="edit" title="Editar" onClick={() => handleEdit(usu)}>
                                        <i className="material-icons">&#xE254;</i>
                                    </span>
                                    <span className="delete" title="Eliminar" onClick={() => handleConfirmDelete(usu.idUsuario)}>
                                        <i className="material-icons">&#xE872;</i>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && usuarioAEliminar && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirmación de eliminación</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ¿Estás seguro de que deseas eliminar al usuario <strong>{usuarios.find(usu => usu.idUsuario === usuarioAEliminar)?.nombre}</strong>?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                <button type="button" className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && !usuarioAEliminar && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingUsuarioId ? 'Editar Usuario' : 'Agregar Usuario'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Nombre</label>
                                        <input type="text" className="form-control" name="nombre" value={nuevoUsuario.nombre} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Apellidos</label>
                                        <input type="text" className="form-control" name="apellidos" value={nuevoUsuario.apellidos} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Usuario</label>
                                        <input type="text" className="form-control" name="usuario" value={nuevoUsuario.usuario} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Contraseña</label>
                                        <input type="password" className="form-control" name="password" value={nuevoUsuario.password} onChange={handleChange} required={editingUsuarioId ? false : true} />
                                    </div>
                                    <div className="form-group">
                                        <label>Correo</label>
                                        <input type="email" className="form-control" name="correo" value={nuevoUsuario.correo} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input type="text" className="form-control" name="telefono" value={nuevoUsuario.telefono} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Rol</label>
                                        <select className="form-control" name="idRol" value={nuevoUsuario.idRol} onChange={handleChange} required>
                                            <option value="">Selecciona un rol</option>
                                            {roles.map((rol) => (
                                                <option key={rol.idRol} value={rol.idRol}>{rol.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select className="form-control" name="idEstado" value={nuevoUsuario.idEstado} onChange={handleChange} required>
                                            <option value="">Selecciona un estado</option>
                                            {estados.map((estado) => (
                                                <option key={estado.idEstado} value={estado.idEstado}>{estado.nombre}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">
                                        {editingUsuarioId ? 'Actualizar Usuario' : 'Guardar Usuario'}
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
