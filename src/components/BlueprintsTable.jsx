function BlueprintsTable({ plans = [], onOpen, activeName }) {
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
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onOpen(plan.name)}>
                Open
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default BlueprintsTable;
