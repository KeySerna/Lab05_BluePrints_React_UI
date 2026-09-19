import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import BlueprintCanvas from '../components/BlueprintCanvas.jsx';
import {
  clearCurrent,
  deleteBlueprint,
  openBlueprint,
  selectCurrentBlueprint,
  selectDeleteError,
  selectDeleteStatus,
  selectUpdateError,
  selectUpdateStatus,
  updateBlueprint,
} from '../features/blueprints/blueprintsSlice.js';

/** Página protegida: edita los puntos de un plano existente (PUT) o lo elimina (DELETE). */
function EditBlueprintPage() {
  const { author, name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const current = useSelector(selectCurrentBlueprint);
  const updateStatus = useSelector(selectUpdateStatus);
  const updateError = useSelector(selectUpdateError);
  const deleteStatus = useSelector(selectDeleteStatus);
  const deleteError = useSelector(selectDeleteError);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    dispatch(openBlueprint({ author, name }));
    return () => dispatch(clearCurrent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [author, name]);

  useEffect(() => {
    if (current?.author === author && current?.name === name) {
      setPoints(current.points);
    }
  }, [current, author, name]);

  function handleAddPoint(point) {
    setPoints((prev) => [...prev, point]);
  }

  function handleRemoveLastPoint() {
    setPoints((prev) => prev.slice(0, -1));
  }

  async function handleSave(event) {
    event.preventDefault();
    const result = await dispatch(updateBlueprint({ author, name, points }));
    if (updateBlueprint.fulfilled.match(result)) {
      navigate('/');
    }
  }

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar el plano "${name}" de ${author}? Esta acción no se puede deshacer.`)) return;
    const result = await dispatch(deleteBlueprint({ author, name }));
    if (deleteBlueprint.fulfilled.match(result)) {
      navigate('/');
    }
  }

  if (!current) {
    return (
      <div className="container">
        <p className="text-muted">Cargando plano…</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="h4 mb-3">
        Editar plano: <span className="fw-semibold">{name}</span> ({author})
      </h2>
      <div className="row">
        <div className="col-md-6">
          <p className="text-muted small mb-2">
            Haz clic sobre el lienzo para agregar más puntos ({points.length} en total).
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
          </div>

          {updateError && <div className="alert alert-danger py-2">{updateError}</div>}
          {updateStatus === 'succeeded' && <div className="alert alert-success py-2">Cambios guardados.</div>}
          {deleteError && <div className="alert alert-danger py-2">{deleteError}</div>}

          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={handleSave} disabled={updateStatus === 'loading'}>
              {updateStatus === 'loading' ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={handleDelete}
              disabled={deleteStatus === 'loading'}
            >
              {deleteStatus === 'loading' ? 'Eliminando…' : 'Eliminar plano'}
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <BlueprintCanvas points={points} onAddPoint={handleAddPoint} />
        </div>
      </div>
    </div>
  );
}

export default EditBlueprintPage;
