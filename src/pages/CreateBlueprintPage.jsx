import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlueprint, selectCreateError, selectCreateStatus } from '../features/blueprints/blueprintsSlice.js';

function CreateBlueprintPage() {
  const dispatch = useDispatch();
  const [author, setAuthor] = useState('');
  const [name, setName] = useState('');
  const [pointsText, setPointsText] = useState('30,30\n120,60\n180,140');
  const status = useSelector(selectCreateStatus);
  const error = useSelector(selectCreateError);

  function parsePoints(text) {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [x, y] = line.split(',').map((n) => Number(n.trim()));
        return { x, y };
      })
      .filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const points = parsePoints(pointsText);
    dispatch(createBlueprint({ author, blueprint: { name, points } }));
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="h4 mb-3">Crear nuevo plano</h2>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label" htmlFor="author">
            Autor
          </label>
          <input id="author" className="form-control" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Nombre del plano
          </label>
          <input id="name" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="points">
            Puntos (uno por línea, formato x,y)
          </label>
          <textarea
            id="points"
            className="form-control"
            rows={5}
            value={pointsText}
            onChange={(e) => setPointsText(e.target.value)}
          />
        </div>
        {error && <div className="alert alert-danger py-2">{error}</div>}
        {status === 'succeeded' && <div className="alert alert-success py-2">Plano creado correctamente.</div>}
        <button type="submit" className="btn btn-primary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Guardando…' : 'Guardar'}
        </button>
      </form>
    </div>
  );
}

export default CreateBlueprintPage;
