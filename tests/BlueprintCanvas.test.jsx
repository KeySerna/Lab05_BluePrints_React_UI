import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
});
