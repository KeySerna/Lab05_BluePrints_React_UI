import '@testing-library/jest-dom';

// jsdom no implementa CanvasRenderingContext2D; se mockea lo mínimo
// que BlueprintCanvas necesita para poder renderizar en los tests.
HTMLCanvasElement.prototype.getContext = function getContext() {
  return {
    clearRect: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    arc: () => {},
    fill: () => {},
  };
};
