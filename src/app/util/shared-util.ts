export const generateYearsFromCurrentYearNumber = (currentYearNumber: number): string[] => {
    let seasons: string[] = [];
    for (let i = 1996; i < currentYearNumber; i++) {
        seasons.push(buildYearString(i));
    }
    return seasons;
}

export const buildYearString = (yearNumber: number): string => {
    let first: string = yearNumber.toString();
    let last: string | undefined = (yearNumber + 1).toString().match(/.{2}$/)?.toString();
    let second: string = last ? last : "";
    // let nextYearShort: number = ((yearNumber + 1) - 1900) % 100;
    // let second: string = (nextYearShort < 10 ? "0" + nextYearShort : nextYearShort).toString();
    return first + "-" + second;
}

export const sleep = (ms:number) => new Promise<void>((resolve) => {
    setTimeout(() => {
        // console.log("SLEEPING");
        resolve()
    }, ms);
});
