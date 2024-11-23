import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('role');

    if (!isAuthenticated || (allowedRoles.length > 0 && !allowedRoles.includes(userRole))) {
        return <Navigate to="/el_buen_lector" replace />;
    }

    return children;
};

export default ProtectedRoute;
