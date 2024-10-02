import { createTheme, PaletteColorOptions } from "@mui/material";
const appPrimaryPaletteColors: PaletteColorOptions = {
    dark: "#19003a",
    main: "#9090ff",
    light: "pink",
    contrastText: "white"
}

const appSecondaryPaletteColors: PaletteColorOptions = {
    main: "#fff"
}

const primaryFontColor: string = "white";
const menuBorder: string = '.125rem solid white';
const menuBorderRadius: string = "0.5rem";


export const appTheme = createTheme({
    palette: {
        primary: appPrimaryPaletteColors,
        secondary: appSecondaryPaletteColors
    },
    components: {
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: primaryFontColor
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: primaryFontColor,
                    '&.Mui-focused': {
                        color: primaryFontColor,
                    },
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: primaryFontColor,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: primaryFontColor,
                    },
                },
                notchedOutline: {
                    border: menuBorder,
                    borderRadius: menuBorderRadius
                },
            },
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    color: primaryFontColor,
                },
                icon: {
                    color: primaryFontColor,
                },
            },
        },
        MuiButton: {
            
            styleOverrides: {
                root: {
                    color: primaryFontColor,
                    '&.active-button': {
                        backgroundColor: "rgba(144, 144, 255, 0.6)",
                        '&:hover': {
                            backgroundColor: "rgba(144, 144, 255, 0.4)"
                        }
                    },
                    '&:hover':{
                        backgroundColor: "rgba(144, 144, 255, 0.2)"
                    }

                }
            }
        }
    },
});
