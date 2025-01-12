import React, { useState, useEffect } from 'react';

const Configuracion = () => {
  // Obtener el nombre de usuario desde localStorage
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('accessToken');  // Obtener el token desde localStorage

  const [usuario, setUsuario] = useState(null);  // Estado para almacenar los datos del usuario
  const [isEditing, setIsEditing] = useState(false);  // Estado para saber si el perfil está en modo edición
  const [formData, setFormData] = useState({});  // Estado para almacenar los datos del formulario (editable)

  // Método para hacer la solicitud GET a la API
  const getUsuarioPorNombre = async () => {
    try {
      // Verifica que el userName y token estén disponibles
      if (!userName || !token) {
        throw new Error("Nombre de usuario o token no encontrados en localStorage");
      }

      // Realiza la solicitud GET con el nombre del usuario y el token de autorización
      const response = await fetch(`http://localhost:8080/apiv1/usuarios/listar/${userName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Agregar el token al encabezado Authorization
        },
      });

      if (!response.ok) {
        throw new Error('Usuario no encontrado');
      }

      const data = await response.json();  // Parsear la respuesta a JSON
      setUsuario(data);  // Establecer los datos del usuario en el estado
      setFormData(data);  // Inicializar los datos del formulario con los datos del usuario
    } catch (error) {
      setError(error.message);  // Establecer el mensaje de error en el estado
    }
  };

  // Llamar a la API cuando el componente se monte
  useEffect(() => {
    getUsuarioPorNombre();  // Llamamos al método para obtener el usuario por nombre
  }, []);  // El array vacío significa que esto solo se ejecuta una vez, al montar el componente

  // Manejar el cambio de valor en los campos editables
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Alternar entre modo edición y modo vista
  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  // Simular el guardado de los cambios (por ejemplo, hacer una solicitud PATCH o PUT)
  const handleSaveChanges = () => {
    // Aquí podrías hacer una solicitud PATCH o PUT para guardar los cambios
    // Por ahora, solo vamos a deshabilitar los campos nuevamente.
    console.log("Guardando cambios...", formData);
    setIsEditing(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center p-3">MI PERFIL</h1>

      {/* Mostrar los datos del usuario */}
      {usuario && (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-12">
            <div className="card">
              <div className="card-body">
                <div className="text-center mb-4">
                  {/* Imagen de perfil */}
                  {usuario.img && (
                    <img
                      src={`http://localhost:8080/apiv1/usuarios/images/${usuario.img}`}
                      alt={usuario.nombre}
                      className="img-fluid rounded-circle w-25"
                    />
                  )}
                </div>

                <div className="mb-3">
                  <strong>ID Usuario:</strong>
                  <p>{usuario.idUsuario}</p>
                </div>

                <div className="mb-3">
                  <strong>Nombre:</strong>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
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
                    value={formData.apellidos}
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
                    value={formData.correo}
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
                    value={formData.telefono}
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
                    >
                      Editar Perfil
                    </button>
                  )}

                  {!isEditing && (
                    <button
                      className="btn btn-secondary"
                      onClick={toggleEditing}
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracion;
