import { render, screen, act, waitFor, wait } from '@testing-library/react';
import App from './App';
import userEvent from '@testing-library/user-event';
import { shallow, configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SimpleSearchBox from './SimpleSearchBox';

configure({ adapter: new Adapter() })

test('All simple buttons and dropdowns render', () => {
    render(<App />)
    const shouldExist = ["year-dd-button", "year-dd", "player-dd-button", "player-dd",
        "season-type-dd-button", "season-type-dd", "view-selection-dd-button", "view-selection-dd"]
    shouldExist.forEach(each => expect(screen.getByTestId(each)).toBeInTheDocument())
});

test("Buttons render", async () => {
    const doNothingFunc = () => { }
    let box
    await waitFor(() => {
        const mockGetSearchData = jest.fn(() =>
            new Promise((resolve, reject) => {
                resolve({
                    activeplayers: [{ id: 1, firstname: "Bob", lastname: "Smith" }, { id: 2, playerfirstname: "Kevin", playerlastname: "Jones" }],
                    singleseason: [{ preseason: 1, reg: 1, playoffs: 0 }]
                })
            })
        );
        box = render(<SimpleSearchBox testid="SimpleSearchBox-test"
            updateLatestSimpleViewType={doNothingFunc}
            latestSimpleViewType={"Classic"}
            setTitle={doNothingFunc()} setIsLoading={doNothingFunc}
            setAllSearchData={doNothingFunc}
            isCurrentViewSimple={true}
            handleDDButtonClick={doNothingFunc}
            currentYear={"2020-21"}
            getSearchData={mockGetSearchData}
            initPlayers={{ "Bob Smith": [1, "Bob", "Smith"], "Kevin Jones": [2, "Kevin", "Jones"] }}
            initPlayersReverseMap={{ 1: [1, "Bob", "Smith"], 2: [2, "Kevin", "Jones"] }}
            selectedPlayer={{ id: 1, playerfirstname: "Bob", playerlastname: "Smith" }}
            setSelectedPlayer={doNothingFunc}
            selectedSeason={"Regular Season"}
            setSelectedSeason={doNothingFunc}
            selectedYear={"2019-20"}
            setSelectedYear={doNothingFunc}
            setTextAreaText={doNothingFunc}
            textAreaText={{ id: null, text: "" }}
            size={[1000, 1000]}
            isMobile={false}
            setShotPercentageData={doNothingFunc}
        />)
    })
    expect(screen.getByTestId("player-dd-textarea")).toHaveValue("Bob Smith")
})


