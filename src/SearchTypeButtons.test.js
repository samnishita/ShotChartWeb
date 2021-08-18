import { render, screen } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import App from './App';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SearchTypeButtons from './SearchTypeButtons';
configure({ adapter: new Adapter() })

test("Renders advanced view", () => {
    render(<App />)
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