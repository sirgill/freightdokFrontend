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
