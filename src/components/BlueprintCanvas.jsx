import { useEffect, useRef } from 'react';

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 360;

/**
 * Lienzo que dibuja consecutivamente los segmentos de recta de un
 * blueprint (arreglo de puntos {x, y}) y marca cada punto.
 *
 * Modo interactivo: cuando se pasa `onAddPoint`, un clic sobre el
 * lienzo agrega un punto en esa posición (dibujo interactivo).
 */
function BlueprintCanvas({ points = [], onAddPoint }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (points.length === 0) return;

    ctx.strokeStyle = '#0d6efd';
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();

    ctx.fillStyle = '#dc3545';
    points.forEach((point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points]);

  function handleClick(event) {
    if (!onAddPoint) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / (rect.width || canvas.width);
    const scaleY = canvas.height / (rect.height || canvas.height);
    const x = Math.round((event.clientX - rect.left) * scaleX);
    const y = Math.round((event.clientY - rect.top) * scaleY);
    onAddPoint({ x, y });
  }

  return (
    <canvas
      id="blueprint-canvas"
      data-testid="blueprint-canvas"
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={`border rounded bg-white${onAddPoint ? ' cursor-crosshair' : ''}`}
      onClick={handleClick}
      role={onAddPoint ? 'button' : undefined}
      aria-label={onAddPoint ? 'Lienzo interactivo: haz clic para agregar un punto' : undefined}
    />
  );
}

export default BlueprintCanvas;
