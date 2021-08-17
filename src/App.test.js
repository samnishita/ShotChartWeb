import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  const app = render(<App />);
});

test('Renders App with Header and footer', () => {
  expect(screen.getByTestId("App-test")).toBeInTheDocument()
  expect(screen.getByTestId("Header-test")).toBeInTheDocument()
  expect(screen.getByTestId("footer-test")).toBeInTheDocument()
});

test("Renders initial view", () => {
  expect(screen.getByTestId("SimpleSearchBox-test")).toBeInTheDocument()
  expect(screen.getByTestId("ShootingBezier-simple-test")).toBeInTheDocument()
  expect(screen.getByTestId("ShotView-simple-test")).toBeInTheDocument()
  expect(screen.getByTestId("ShotPercentageView-simple-test")).toBeInTheDocument()
  expect(screen.queryByTestId("AdvancedSearchBox-test")).toBeNull()
  expect(screen.queryByTestId("ShootingBezier-advanced-test")).toBeNull()
  expect(screen.queryByTestId("ShotView-advanced-test")).toBeNull()
  expect(screen.queryByTestId("ShotPercentageView-advanced-test")).toBeNull()
})



