import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthorSearchForm from '../components/AuthorSearchForm.jsx';
import BlueprintsTable from '../components/BlueprintsTable.jsx';
import BlueprintCanvas from '../components/BlueprintCanvas.jsx';
import {
  deleteBlueprint,
  fetchByAuthor,
  openBlueprint,
  selectCurrentBlueprint,
  selectDeleteError,
  selectFetchError,
  selectFetchStatus,
  selectPlansByAuthor,
  selectTop5ByPoints,
} from '../features/blueprints/blueprintsSlice.js';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [author, setAuthor] = useState(null);
  const plans = useSelector(selectPlansByAuthor(author ?? ''));
  const status = useSelector(selectFetchStatus);
  const error = useSelector(selectFetchError);
  const current = useSelector(selectCurrentBlueprint);
  const top5 = useSelector(selectTop5ByPoints);
  const deleteError = useSelector(selectDeleteError);

  function handleSearch(searchedAuthor) {
    setAuthor(searchedAuthor);
    dispatch(fetchByAuthor(searchedAuthor));
  }

  function handleOpen(name) {
    dispatch(openBlueprint({ author, name }));
  }

  function handleEdit(name) {
    navigate(`/edit/${encodeURIComponent(author)}/${encodeURIComponent(name)}`);
  }

  function handleDelete(name) {
    if (!window.confirm(`¿Eliminar el plano "${name}"? Esta acción no se puede deshacer.`)) return;
    dispatch(deleteBlueprint({ author, name }));
  }

  function handleRetry() {
    if (author) dispatch(fetchByAuthor(author));
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <h2 className="h4 mb-3">Planos por autor</h2>
          <AuthorSearchForm onSearch={handleSearch} isLoading={status === 'loading'} />

          {status === 'failed' && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <span>{error}</span>
              <button className="btn btn-sm btn-outline-danger" onClick={handleRetry}>
                Reintentar
              </button>
            </div>
          )}

          {deleteError && <div className="alert alert-danger py-2">{deleteError}</div>}

          {author && status !== 'failed' && (
            <BlueprintsTable
              plans={plans}
              onOpen={handleOpen}
              onEdit={handleEdit}
              onDelete={handleDelete}
              activeName={current?.name}
            />
          )}

          {top5.length > 0 && (
            <div className="mt-4">
              <h3 className="h6 text-muted">Top 5 por número de puntos</h3>
              <ol className="small">
                {top5.map((p) => (
                  <li key={`${p.author}-${p.name}`}>
                    {p.name} ({p.author}) — {p.pointCount} puntos
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="col-md-6">
          <h2 className="h4 mb-3">Plano actual</h2>
          <p className="fw-semibold" data-testid="current-blueprint-name">
            {current ? current.name : 'Ningún plano seleccionado'}
          </p>
          <BlueprintCanvas points={current?.points ?? []} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
