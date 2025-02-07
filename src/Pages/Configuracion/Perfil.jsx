import React, { useState, useEffect } from 'react';

const Configuracion = () => {
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('accessToken');

  const [usuario, setUsuario] = useState(null);  // Estado para almacenar los datos del usuario
  const [isEditing, setIsEditing] = useState(false);  // Estado para saber si el perfil está en modo edición
  const [isLoading, setIsLoading] = useState(false);  // Estado para manejar la carga

  if (!token) {
    alert('No estás autorizado. Por favor, inicia sesión nuevamente.');
    return;
  }

  // Método para obtener los datos del usuario por su nombre
  const getUsuarioPorNombre = async () => {
    setIsLoading(true);  // Empezar el estado de carga
    try {
      const response = await fetch(`http://localhost:8080/apiv1/usuarios/listar/${userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }

      const data = await response.json();
      console.log('Usuario obtenido:', data); // Verificar los datos del usuario obtenidos
      if (!data.idUsuario) {
        throw new Error('El idUsuario no está presente en la respuesta');
      }
      setUsuario(data);  // Establecer los datos del usuario en el estado
    } catch (error) {
      console.error('Error al obtener usuario:', error.message);
    } finally {
      setIsLoading(false);  // Terminar el estado de carga
    }
  };

  useEffect(() => {
    getUsuarioPorNombre();
  }, []); // Solo se ejecuta una vez, al montar el componente

  // Manejar el cambio de valor en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      [name]: value,  // Actualizar directamente el estado 'usuario'
    }));
  };

  // Alternar entre el modo edición y el modo vista
  const toggleEditing = () => {
    setIsEditing(!isEditing);  // Alternar entre edición y vista
  };

  // Método para guardar los cambios
  const handleSaveChanges = async () => {
    try {
      if (!usuario || !usuario.idUsuario) {
        throw new Error('No se pudo obtener el ID del usuario');
      }

      const updatedData = { ...usuario };
      delete updatedData.password;  // No enviar la contraseña

      // Usar el idUsuario que obtuvimos del GET
      const response = await fetch(`http://localhost:8080/apiv1/usuarios/actualizar/${usuario.idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar los datos: ${response.statusText}`);
      }

      const data = await response.json();
      setUsuario(data);  // Actualizar los datos del usuario con la respuesta
      setIsEditing(false);  // Desactivar el modo de edición

      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center p-3">MI PERFIL</h1>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        usuario && (
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-12">
              <div className="card">
                <div className="card-body">
                  <div className="mb-3" hidden>
                    <strong>ID Usuario:</strong>
                    <p>{usuario.idUsuario}</p>
                  </div>

                  <div className="mb-3">
                    <strong>Nombre:</strong>
                    <input
                      type="text"
                      name="nombre"
                      value={usuario.nombre}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <strong>Apellidos:</strong>
                    <input
                      type="text"
                      name="apellidos"
                      value={usuario.apellidos}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <strong>Correo:</strong>
                    <input
                      type="email"
                      name="correo"
                      value={usuario.correo}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="mb-3">
                    <strong>Teléfono:</strong>
                    <input
                      type="text"
                      name="telefono"
                      value={usuario.telefono}
                      onChange={handleChange}
                      className="form-control"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="mb-3">
                    <strong>Rol:</strong>
                    <p>{usuario.rol.nombre}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Estado:</strong>
                    <p>{usuario.estado.nombre}</p>
                  </div>

                  {/* Botones de acción */}
                  <div className="d-flex justify-content-between">
                    {isEditing ? (
                      <button
                        className="btn btn-success"
                        onClick={handleSaveChanges}
                      >
                        Guardar Cambios
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={toggleEditing}
                        is disabled
                      >
                        Editar Perfil
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Configuracion;
