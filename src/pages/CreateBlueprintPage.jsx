import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BlueprintCanvas from '../components/BlueprintCanvas.jsx';
import { createBlueprint, selectCreateError, selectCreateStatus } from '../features/blueprints/blueprintsSlice.js';

function CreateBlueprintPage() {
  const dispatch = useDispatch();
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [points, setPoints] = useState([]);
  const status = useSelector(selectCreateStatus);
  const error = useSelector(selectCreateError);

  function handleAddPoint(point) {
    setPoints((prev) => [...prev, point]);
  }

  function handleRemoveLastPoint() {
    setPoints((prev) => prev.slice(0, -1));
  }

  function handleClearPoints() {
    setPoints([]);
  }

  function handleSubmit(event) {
    event.preventDefault();
    dispatch(createBlueprint({ author, blueprint: { name, points } }));
  }

  return (
    <div className="container">
      <h2 className="h4 mb-3">Crear nuevo plano</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label" htmlFor="author">
                Autor
              </label>
              <input
                id="author"
                className="form-control"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                Nombre del plano
              </label>
              <input
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <p className="text-muted small mb-2">
              Haz clic sobre el lienzo para agregar puntos ({points.length} agregado{points.length === 1 ? '' : 's'}).
            </p>
            <div className="d-flex gap-2 mb-3">
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleRemoveLastPoint}
                disabled={points.length === 0}
              >
                Deshacer último punto
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={handleClearPoints}
                disabled={points.length === 0}
              >
                Limpiar
              </button>
            </div>
            {error && <div className="alert alert-danger py-2">{error}</div>}
            {status === 'succeeded' && <div className="alert alert-success py-2">Plano creado correctamente.</div>}
            <button type="submit" className="btn btn-primary" disabled={status === 'loading' || points.length === 0}>
              {status === 'loading' ? 'Guardando…' : 'Guardar'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <BlueprintCanvas points={points} onAddPoint={handleAddPoint} />
        </div>
      </div>
    </div>
  );
}

export default CreateBlueprintPage;
