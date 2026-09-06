import { NavLink, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutAdmin } from '../../store/authSlice.js';
import { formatLong } from '../../utils/date.js';
import { toISODate } from '../../utils/date.js';

const navLinkClasses = ({ isActive }) =>
  [
    'px-4 py-2 text-sm tracking-wideish uppercase border-b-2 transition-colors',
    isActive
      ? 'border-gold text-ink'
      : 'border-transparent text-slate hover:text-ink',
  ].join(' ');

function AdminControl() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  if (user?.role === 'admin') {
    return (
      <div className="flex items-center gap-3 text-xs text-slate">
        <Link to="/upload" className="hover:text-ink transition-colors">
          Publish desk
        </Link>
        <span className="text-ink/15">·</span>
        <button
          onClick={() => dispatch(logoutAdmin())}
          className="hover:text-incorrect transition-colors"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Link
      to="/admin/login"
      className="text-xs text-slate hover:text-ink transition-colors"
    >
      Admin
    </Link>
  );
}

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-ink/10 bg-paper sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 pt-6 pb-3 flex items-start justify-between">
          <div>
            <p className="text-xs text-slate tracking-wideish uppercase mb-1">
              Penverse
            </p>
            <h1 className="font-display text-3xl font-semibold text-ink leading-none">
              Current Affairs
            </h1>
            <p className="text-xs text-slate mt-1.5">
              {formatLong(toISODate(new Date()))}
            </p>
          </div>
          <AdminControl />
        </div>
        <nav className="max-w-5xl mx-auto px-6 flex gap-2">
          <NavLink to="/" end className={navLinkClasses}>
            Today's edition
          </NavLink>
        </nav>
      </header>
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-ink/10 py-4">
        <p className="max-w-5xl mx-auto px-6 text-xs text-slate">
          Penverse Current Affairs · a daily briefing built for exam prep
        </p>
      </footer>
    </div>
  );
}
