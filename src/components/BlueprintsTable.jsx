import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../features/auth/authSlice.js';

function BlueprintsTable({ plans = [], onOpen, onEdit, onDelete, activeName }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (plans.length === 0) {
    return <p className="text-muted">No hay planos para mostrar todavía.</p>;
  }

  return (
    <table className="table table-striped table-hover align-middle">
      <thead>
        <tr>
          <th scope="col">Nombre del plano</th>
          <th scope="col">Número de puntos</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody>
        {plans.map((plan) => (
          <tr key={plan.name} className={plan.name === activeName ? 'table-active' : ''}>
            <td>{plan.name}</td>
            <td>{plan.points.length}</td>
            <td className="text-end">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onOpen(plan.name)}>
                  Open
                </button>
                {isAuthenticated && onEdit && (
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(plan.name)}>
                    Editar
                  </button>
                )}
                {isAuthenticated && onDelete && (
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onDelete(plan.name)}>
                    Eliminar
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BlueprintsTable;
