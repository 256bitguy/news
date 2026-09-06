import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkSession } from '../../store/authSlice.js';

export default function RequireAdmin({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user, status } = useSelector((s) => s.auth);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(checkSession());
    }
  }, [dispatch, status]);

  if (status === 'idle' || status === 'checking') {
    return (
      <p className="text-sm text-slate py-16 text-center">Checking session…</p>
    );
  }

  const isAdmin = user?.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
