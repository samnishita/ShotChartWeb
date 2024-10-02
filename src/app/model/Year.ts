import { AutocompleteMenuItem } from "./AutocompleteMenuItem";

export interface Year extends AutocompleteMenuItem {
    yearStart: number;
    yearEnd: number;
    yearDisplay: string;
}

export const generateYearsArray = (yearStrings: string[]): Year[] => {
    const regex = /^(.*?)-/;
    let menuItems: Year[] = [];
    for (let i = 0; i < yearStrings.length; i++) {
        let year: string = yearStrings[i];
        let matched: RegExpMatchArray | null = year.match(regex);
        let yearStart = (matched && matched.length > 0) ? +matched[0] : -1;
        let yearEnd = (matched && matched.length > 1) ? +matched[1] : -1;
        menuItems.push({
            id: year + "-menu-item",
            label: year,
            yearStart: yearStart,
            yearEnd: yearEnd,
            yearDisplay: year
        })
    }
    return menuItems;
}