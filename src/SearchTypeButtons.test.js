import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
    const app = render(<App />);
});

test("Renders advanced view", () => {
    UserEvent.click(screen.getByTestId("advanced-link"))
    expect(screen.queryByTestId("SimpleSearchBox-test")).toBeNull()
    expect(screen.queryByTestId("ShootingBezier-simple-test")).toBeNull()
    expect(screen.queryByTestId("ShotView-simple-test")).toBeNull()
    expect(screen.queryByTestId("ShotPercentageView-simple-test")).toBeNull()
    expect(screen.queryByTestId("AdvancedSearchBox-test")).toBeInTheDocument()
    expect(screen.queryByTestId("ShootingBezier-advanced-test")).toBeInTheDocument()
    expect(screen.queryByTestId("ShotView-advanced-test")).toBeInTheDocument()
    expect(screen.queryByTestId("ShotPercentageView-advanced-test")).toBeInTheDocument()
})

test("Renders simple view after advanced view", () => {
    UserEvent.click(screen.getByTestId("advanced-link"))
    jest.useFakeTimers();
    setTimeout(() => {
        UserEvent.click(screen.getByTestId("simple-link"))
        expect(screen.queryByTestId("SimpleSearchBox-test")).toBeInTheDocument()
        expect(screen.queryByTestId("ShootingBezier-simple-test")).toBeInTheDocument()
        expect(screen.queryByTestId("ShotView-simple-test")).toBeInTheDocument()
        expect(screen.queryByTestId("ShotPercentageView-simple-test")).toBeInTheDocument()
        expect(screen.queryByTestId("AdvancedSearchBox-test")).toBeNull()
        expect(screen.queryByTestId("ShootingBezier-advanced-test")).toBeNull()
        expect(screen.queryByTestId("ShotView-advanced-test")).toBeNull()
        expect(screen.queryByTestId("ShotPercentageView-advanced-test")).toBeNull()
    }, 200);

})