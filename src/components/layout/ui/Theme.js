import { createTheme } from '@material-ui/core/styles';
import 'typeface-roboto';
import './Theme.css';

const font = "myriad-pro, sans-serif";

export const blue = "#4691FF",
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
      color: "#1891FC",
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

export const themeNew = createTheme({
  palette: {
    primary: {
      main: 'rgb(0, 123, 255)',
    },
    success: {
      main: 'rgb(40, 167, 69)'
    }
  },
  typography: {
    fontFamily: ['Myriad-Pro Regular',  "Sans-serif"].join(','),
    button: {
      textTransform: 'none'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: 10,
          minWidth: 80,
          height: 25
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
