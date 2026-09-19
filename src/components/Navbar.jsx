import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectIsAuthenticated } from '../features/auth/authSlice.js';

function Navbar() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Blueprints
        </Link>
        <div className="d-flex gap-3">
          <Link className="nav-link text-white" to="/">
            Inicio
          </Link>
          <Link className="nav-link text-white" to="/new">
            Nuevo plano
          </Link>
          {isAuthenticated ? (
            <button className="btn btn-sm btn-outline-light" onClick={() => dispatch(logout())}>
              Cerrar sesión
            </button>
          ) : (
            <Link className="nav-link text-white" to="/login">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
