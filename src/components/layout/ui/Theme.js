import {createTheme} from '@material-ui/core/styles';
import {createTheme as muiCreateTheme} from "@mui/material/styles";
import 'typeface-roboto';
import './Theme.css';

const font = "myriad-pro, sans-serif";

export const blue = "#0091ff",
    successIconColor = '#2DCE89',
    errorIconColor = '#F97A5D';
const white = "#FFFFFF";

export const theme = createTheme({
    palette: {
        common: {
            blue: `${blue}`,
            white: `${white}`,
        },
        primary: {
            main: `${blue}`
        },
        secondary: {
            main: `${white}`
        }
    },
    typography: {
        fontFamily: ['Myriad-Pro Light', 'Myriad-Pro Regular', "Myriad-Pro Bold"].join(','),
        tab: {
            fontweight: 700,
            color: "#0091ff",
            fontFamily: font,
            fontSize: '1.1rem',
            textTransform: "none"
        },
        h2: {
            fontFamily: font,
            fontWeight: 700,
            fontSize: '2.5rem',
            color: `${blue}`
        },
        button: {
            textTransform: 'none'
        }
    }
});

export const SUCCESS_COLOR = 'rgb(40, 167, 69)',
    PRIMARY_BLUE = 'rgb(0, 145, 255)';

export const themeNew = muiCreateTheme({
    palette: {
        text: {
            primary: '#000',
            secondary: '#6f6f6f'
        },
        primary: {
            main: PRIMARY_BLUE,
        },
        success: {
            main: SUCCESS_COLOR
        },
    },
    typography: {
        fontFamily: ['Myriad-Pro Regular', "Sans-serif"].join(','),
        button: {
            textTransform: 'none'
        },
    },
    components: {
        MuiTableSortLabel: {
            styleOverrides: {
                root: {
                    fontFamily: 'inherit',
                    fontWeight: '800',
                }
            }
        },
        MuiInputLabel: {
            styleOverrides: {
                asterisk: {
                    color: "red"
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                color: {
                    secondary: {
                        color: 'blue'
                    }
                }
            }
        },
        MuiAlert: {
            styleOverrides: {
                standardSuccess: {
                    color: SUCCESS_COLOR,
                    border: `1px solid ${SUCCESS_COLOR}`
                },
                standardInfo: ({}) => {
                    return {
                        borderStyle: "solid",
                        borderWidth: '1px'
                    }
                }
            }
        },
        MuiDialogContent: {
            styleOverrides: {
                root: {
                    borderTop: 'none'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: ({theme}) => {
                    return {
                        // '&: disabled': {
                        //     color: theme.palette.error.contrastText,
                        //     backgroundColor: theme.palette.error.light,
                        //     opacity: .6
                        // }
                    }
                },
                containedPrimary: {
                    '&:hover': {
                        color: '#fff'
                    }
                }
            },
            outlined: {}
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:disabled': {
                        opacity: .6,
                        cursor: 'default',
                        pointerEvents: 'auto'
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: 16,
                    fontWeight: 400,
                    borderBottom: '1px solid #0000000D',
                    paddingLeft: '1rem',
                    align: 'left',
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    fontWeight: 600
                }
            }
        },
        MuiSelect: {
            styleOverrides: {
                select: {
                    border: `1px solid`,
                    paddingTop: '8px'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    border: '1px solid #cfcfcf'
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: white
                }
            }
        }
    }
});
