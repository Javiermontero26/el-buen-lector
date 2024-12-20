import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginForm/login.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { messages } from '../LoginForm/logindatadays';
import logologin from '../LoginForm/logoblanco.png';

const Login = () => {
  
  // Propiedades de las Alertas para Iniciar Sesion
  const notyf = new Notyf({
    duration: 3000,
    position: { x: 'center', y: 'top' },
    types: [
      { type: 'success', background: '#4CAF50' },
      { type: 'error', background: '#F44336' },
    ],
    dismissible: true,
    maxNotifications: 1,
  });

  // Estado del componente
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageOfTheDay, setMessageOfTheDay] = useState('');
  const [loading, setLoading] = useState(false);  // Para manejar el estado de cargaaaa
  const [usuarios, setUsuarios] = useState([]);  // Estado para los usuarios

  // Navegación
  const navigate = useNavigate();

  // Obtener los usuarios desde la API al cargar el componente
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/el_buen_lector/Pages/Dasboard/Dasboard');
    }

    // Mostrar mensaje del día
    const dayOfWeek = new Date().getDay();
    const randomMessageIndex = Math.floor(Math.random() * messages[dayOfWeek].length);
    const message = messages[dayOfWeek][randomMessageIndex];
    setMessageOfTheDay(message);

    // Obtener usuarios desde la API
    const fetchUsuarios = async () => {
      try {
        const response = await fetch('http://localhost:8080/apiv1/usuarios/listar');
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        notyf.error('Error al obtener los usuarios.');
      }
    };

    fetchUsuarios();
  }, [navigate]);

  // Manejo del formulario de inicio de sesión
  const handleSubmit = async (event) => {
    event.preventDefault();
    notyf.dismissAll(); // Cierra todas las notificaciones activas

    // Mostrar cargando
    setLoading(true);

    // Buscar el usuario en la lista de usuarios
    const usuario = usuarios.find(
      (user) => user.usuario === username && user.password === password
    );

    if (usuario) {
      // Guardamos la información del usuario en el localStorage
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', usuario.rol.nombre);  // El rol lo obtenemos del usuario
      localStorage.setItem('userName', usuario.usuario);

      notyf.success('¡Has iniciado sesión exitosamente!');

      // Redirigimos al dashboard según el rol
      setTimeout(() => {
        navigate('/el_buen_lector/Pages/Dasboard/Dasboard');
      }, 1000);
    } else {
      // Si no se encuentra el usuario o la contraseña no coincide
      notyf.error('Usuario y/o contraseña incorrectos.');
    }

    setLoading(false);  // Termina el estado de carga
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row vh-100">
        {/* Imagen de fondo */}
        <div className="col-8 p-0 hide-on-small">
          <img
            className="w-100 h-100"
            src="https://media.admagazine.com/photos/6585f181bbe8ec0403994e1f/16:9/w_2560%2Cc_limit/the-library-b2-hotel-zurich.jpg"
            alt="Imagen de fondo"
          />
        </div>

        {/* Formulario de login */}
        <div
          className="col-12 col-md-4 d-flex align-items-center justify-content-center vh-100 full-width-on-small"
          style={{ background: 'linear-gradient(135deg, #5de0e6, #004aad)' }}
        >
          <form className="text-center p-4 rounded w-100" style={{ maxWidth: '400px' }} onSubmit={handleSubmit}>
            <div className="text-center mb-4">
              <img className="img-fluid" src={logologin} alt="logo" />
              <hr className="text-white w-75 mx-5" />
              <h2 className="mb-3 mt-5 text-white h3 fw-bold">{messageOfTheDay}</h2>
            </div>

            {/* Campo de usuario */}
            <div className="mb-3 mt-5">
              <input
                type="text"
                className="form-control rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
              />
            </div>

            {/* Campo de contraseña */}
            <div className="mb-3">
              <input
                type="password"
                className="form-control rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {/* Botón de envío */}
            <button type="submit" className="btn btn-dark w-100 mt-3" disabled={loading}>
              {loading ? 'Cargando...' : 'Comencemos'}
            </button>

            {/* Enlace de "Olvidé mi contraseña" */}
            <div className="text-center mt-3">
              <a href="#" className="text-white fw-bold">
                Olvidé mi contraseña
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
