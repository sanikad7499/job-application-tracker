import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          Ledger<span className="brand-mark">.</span>
        </Link>
        <div className="topbar-actions">
          {user && <span className="topbar-email">{user.email}</span>}
          <button className="btn-text" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
