import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BlueprintCanvas from '../src/components/BlueprintCanvas.jsx';

describe('BlueprintCanvas', () => {
  it('renders a canvas element with the expected id and dimensions', () => {
    render(<BlueprintCanvas points={[{ x: 0, y: 0 }, { x: 10, y: 10 }]} />);

    const canvas = screen.getByTestId('blueprint-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '520');
    expect(canvas).toHaveAttribute('height', '360');
  });

  it('renders without crashing when there are no points', () => {
    render(<BlueprintCanvas points={[]} />);
    expect(screen.getByTestId('blueprint-canvas')).toBeInTheDocument();
  });

  it('calls onAddPoint with canvas-relative coordinates when clicked (dibujo interactivo)', () => {
    const onAddPoint = vi.fn();
    render(<BlueprintCanvas points={[]} onAddPoint={onAddPoint} />);
    const canvas = screen.getByTestId('blueprint-canvas');

    // jsdom no calcula layout real; getBoundingClientRect se mockea para
    // simular un lienzo posicionado en (0,0) sin escalado.
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 520, height: 360 });

    fireEvent.click(canvas, { clientX: 100, clientY: 50 });

    expect(onAddPoint).toHaveBeenCalledWith({ x: 100, y: 50 });
  });

  it('does not throw when clicked without onAddPoint (modo solo lectura)', () => {
    render(<BlueprintCanvas points={[]} />);
    const canvas = screen.getByTestId('blueprint-canvas');
    canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 520, height: 360 });
    expect(() => fireEvent.click(canvas, { clientX: 10, clientY: 10 })).not.toThrow();
  });
});
