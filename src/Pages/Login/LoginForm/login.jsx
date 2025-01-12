import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginForm/login.css';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { messages } from '../LoginForm/logindatadays';
import logologin from '../LoginForm/logoblanco.png';

const Login = () => {
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

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [messageOfTheDay, setMessageOfTheDay] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      navigate('/el_buen_lector/Pages/Dasboard/Dasboard');
    }

    const dayOfWeek = new Date().getDay();
    const randomMessageIndex = Math.floor(Math.random() * messages[dayOfWeek].length);
    const message = messages[dayOfWeek][randomMessageIndex];
    setMessageOfTheDay(message);
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    notyf.dismissAll();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Decodifica el token JWT manualmente
        const token = data.accessToken;
        const decodedToken = parseJwt(token); // Decodifica el JWT
        const rol = decodedToken.rol;  // Obtiene el rol del token

        // Almacena el token y el rol en localStorage
        localStorage.setItem('accessToken', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userName', usuario);
        localStorage.setItem('role', rol);

        notyf.success('¡Has iniciado sesión exitosamente!');

        setTimeout(() => {
          navigate('/el_buen_lector/Pages/Dasboard/Dasboard');
        }, 1000);
      } else {
        const errorMessage = data.message || 'Usuario y/o contraseña incorrectos.';
        notyf.error(errorMessage);
      }
    } catch (error) {
      console.error('Error en la petición de login:', error);
      notyf.error('Hubo un error al intentar iniciar sesión. Por favor, inténtalo de nuevo.');
    }
  };

  // Función para decodificar el JWT
  function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Asegura que el token sea válido para atob
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  return (
    <div className="container-fluid vh-100">
      <div className="row vh-100">
        <div className="col-8 p-0 hide-on-small">
          <img
            className="w-100 h-100"
            src="https://media.admagazine.com/photos/6585f181bbe8ec0403994e1f/16:9/w_2560%2Cc_limit/the-library-b2-hotel-zurich.jpg"
            alt="Imagen de fondo"
          />
        </div>

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

            <div className="mb-3 mt-5">
              <input
                type="text"
                className="form-control rounded"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                className="form-control rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 mt-3">
              Comencemos
            </button>

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
