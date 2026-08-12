import { Navigate } from 'react-router-dom';
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (allowedRole) {
    const isAuthorized =
      user.user_type === allowedRole ||
      (allowedRole === 'admin' && ['super_admin', 'admin'].includes(user.user_type));
    if (!isAuthorized) {
      const defaultPath =
        user.user_type === 'super_admin'
          ? '/super-admin'
          : user.user_type === 'admin'
          ? '/admin'
          : '/employee';
      return <Navigate to={defaultPath} replace />;
    }
  }
  return children;
};
export default ProtectedRoute;
