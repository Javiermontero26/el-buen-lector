import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Si la secion es true la sesion se inicio correctamente
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
        return <Navigate to="/el_buen_lector/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
