import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AppShell from './components/layout/AppShell.jsx';
import ReaderPage from './pages/ReaderPage.jsx';
import UploadPage from './pages/UploadPage.jsx';
import AdminLoginPage from './components/auth/AdminLoginPage.jsx';
import RequireAdmin from './components/auth/RequireAdmin.jsx';
import { checkSession } from './store/authSlice.js';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ReaderPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/upload"
          element={
            <RequireAdmin>
              <UploadPage />
            </RequireAdmin>
          }
        />
      </Routes>
    </AppShell>
  );
}
