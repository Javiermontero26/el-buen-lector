import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginForm/login.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { messages } from '../LoginForm/logindatadays';
import logologin from '../LoginForm/logoblanco.png';

const Login = () => {

    // Propiedades de las Alertas
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

  // Credenciales válidas para administrador y almacenerooo
  const validCredentials = {
    username: 'admin',
    password: '123',
    role: 'admin',
  };

  const validCredentialsAlmacen = {
    username: 'almacenero',
    password: '12345',
    role: 'almacen',
  };

  // Estado del componentes
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [messageOfTheDay, setMessageOfTheDay] = useState('');

  // Navegación
  const navigate = useNavigate();

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
  }, [navigate]);

  // Manejo del formulario de inicio de sesión
  const handleSubmit = (event) => {
    event.preventDefault();
    notyf.dismissAll(); // Cierra todas las notificaciones activas

    if (
      (username === validCredentials.username && password === validCredentials.password) ||
      (username === validCredentialsAlmacen.username && password === validCredentialsAlmacen.password)
    ) {
      const role = username === validCredentials.username ? 'admin' : 'almacen';
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', role);
      localStorage.setItem('userName', username);

      notyf.success('¡Has iniciado sesión exitosamente!');

      // Redirigir según el rol
      setTimeout(() => {
        navigate(role === 'admin' ? '/el_buen_lector/Pages/Dasboard/Dasboard' : '/el_buen_lector/Pages/Libros/Libros');
      }, 1000);
    } else {
      notyf.error('Usuario y/o contraseña incorrectos.');
    }
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
            <button type="submit" className="btn btn-dark w-100 mt-3">
              Comencemos
            </button>

            {/* Enlace de "Olvidé mi contraseña" */}
            <div className="text-center mt-3">
              <a href="#" className="text-white fw-bold">
                Olvidé mi contraseña
              </a>
              {/* <Link to="#" className="text-white fw-bold">Olvidé mi contraseña</Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
