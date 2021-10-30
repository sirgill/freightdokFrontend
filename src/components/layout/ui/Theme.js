import { createMuiTheme } from '@material-ui/core/styles';
import 'typeface-roboto';
import  './Theme.css';

const font = "myriad-pro, sans-serif";

const blue = "#1891FC";
const white = "#FFFFFF";

export default createMuiTheme({
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
    }
  },

});
