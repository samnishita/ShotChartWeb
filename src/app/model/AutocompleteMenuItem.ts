export interface AutocompleteMenuItem {
    id: string;
    label: string;
}

export const generateYearsArray = (yearStrings: string[]): AutocompleteMenuItem[] => {
    let menuItems: AutocompleteMenuItem[] = yearStrings.map(year => ({
        id: year + "-menu-item",
        label: year
    }));
    return menuItems;
}