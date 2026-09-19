import { useEffect, useRef } from 'react';

const CANVAS_WIDTH = 520;
const CANVAS_HEIGHT = 360;

/**
 * Lienzo que dibuja consecutivamente los segmentos de recta de un
 * blueprint (arreglo de puntos {x, y}) y marca cada punto.
 */
function BlueprintCanvas({ points = [] }) {
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

  return (
    <canvas
      id="blueprint-canvas"
      data-testid="blueprint-canvas"
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border rounded bg-white"
    />
  );
}

export default BlueprintCanvas;
