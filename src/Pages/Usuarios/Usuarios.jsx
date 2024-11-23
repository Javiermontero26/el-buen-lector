import React, { useState, useEffect } from 'react';
import "../Usuarios/Usuarios.css";

const Usuarios = () => {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [action, setAction] = useState('');

    // Abrir modal según el tipo de acción
    const openModal = (actionType) => {
        if (actionType === 'add') {
            setModalTitle('Agregar Nuevo Usuario');
            setModalContent(
                <div>
                    <form>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" className="form-control" placeholder="Nombre" />
                        </div>
                        <div className="form-group">
                            <label>Correo</label>
                            <input type="email" className="form-control" placeholder="Correo" />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <select className="form-control">
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                        </div>
                    </form>
                </div>
            );
        } else if (actionType === 'edit') {
            setModalTitle('Editar Usuario');
            setModalContent(
                <div>
                    <form>
                        <div className="form-group">
                            <label>Nombre</label>
                            <input type="text" className="form-control" defaultValue="Javier" />
                        </div>
                        <div className="form-group">
                            <label>Correo</label>
                            <input type="email" className="form-control" defaultValue="javiermontero@gmail.com" />
                        </div>
                        <div className="form-group">
                            <label>Rol</label>
                            <select className="form-control">
                                <option>Admin</option>
                                <option>User</option>
                            </select>
                        </div>
                    </form>
                </div>
            );
        } else if (actionType === 'delete') {
            setModalTitle('Eliminar Usuario');
            setModalContent(
                <div>
                    <p>¿Estás seguro de que deseas eliminar este usuario?</p>
                </div>
            );
        }
        setAction(actionType);
        setShowModal(true);
    };

    // Cerrar modal
    const closeModal = () => {
        setShowModal(false);
        setModalTitle('');
        setModalContent('');
    };

    // Inicializar DataTables después de que el componente se monte
    useEffect(() => {
        // Usar jQuery para inicializar DataTables
        $(document).ready(function () {
            $('#usuariosTable').DataTable();
        });
    }, []);

    return (
        <div className="container">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <div className="table-title">
                        <div className="row">
                            <div className="col-xs-5">
                                <h2>Lista de <b>Usuarios</b></h2>
                            </div>
                            <div className="col-xs-7">
                                <button type="button" className="btn btn-primary" onClick={() => openModal('add')}>
                                    <i className="material-icons"></i> <span>Agregar Nuevo Usuario</span>
                                </button>
                                <button type="button" className="btn btn-primary">
                                    <i className="material-icons"></i> <span>Exportar PDF</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <table id="usuariosTable" className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Nombres</th>
                                <th>Apellidos</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>admin</td>
                                <td>Javier</td>
                                <td>Fiestas Montero</td>
                                <td>javiermontero@gmail.com</td>
                                <td>Admin</td>
                                <td><span className="status text-success mb-2">•</span> Active</td>
                                <td>
                                    <span className="edit" title="Editar" onClick={() => openModal('edit')}>
                                        <i className="material-icons">&#xE254;</i>
                                    </span>
                                    <span className="delete" title="Eliminar" onClick={() => openModal('delete')}>
                                        <i className="material-icons">&#xE872;</i>
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{modalTitle}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {modalContent}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Cerrar</button>
                                {action !== 'delete' && (
                                    <button type="button" className="btn btn-primary">Guardar cambios</button>
                                )}
                                {action === 'delete' && (
                                    <button type="button" className="btn btn-danger">Eliminar</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Usuarios;
