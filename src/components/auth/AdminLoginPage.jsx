import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, clearAuthError } from '../../store/authSlice.js';

export default function AdminLoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || '/upload';

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password })).then((action) => {
      if (action.meta.requestStatus === 'fulfilled') {
        navigate(from, { replace: true });
      }
    });
  };

  return (
    <div className="max-w-sm mx-auto py-16">
      <div className="text-center mb-8">
        <p className="text-xs text-slate tracking-wideish uppercase mb-1">
          Restricted
        </p>
        <h2 className="font-display text-2xl text-ink">Admin sign-in</h2>
        <p className="text-sm text-slate mt-2">
          Publishing access for the Current Affairs desk.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-slate mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>
        <div>
          <label className="block text-xs text-slate mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
            className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gold"
          />
        </div>

        {error && <p className="text-sm text-incorrect">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-ink text-paper text-sm font-medium px-5 py-2.5 rounded-md hover:bg-ink-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
