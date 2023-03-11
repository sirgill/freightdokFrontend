import { createTheme } from '@material-ui/core/styles';
import {createTheme as muiCreateTheme} from "@mui/material/styles";
import 'typeface-roboto';
import './Theme.css';

const font = "myriad-pro, sans-serif";

export const blue = "#0091ff",
  successIconColor= '#2DCE89',
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
    fontFamily: ['Myriad-Pro Light', 'Myriad-Pro Regular',  "Myriad-Pro Bold"].join(','),
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

export const themeNew = createTheme({
  palette: {
    primary: {
      main: PRIMARY_BLUE,
    },
    success: {
      main: SUCCESS_COLOR
    }
  },
  typography: {
    fontFamily: ['Myriad-Pro Regular',  "Sans-serif"].join(','),
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderTop: 'none'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 80,
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
    }
  }
});
