import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Background from "./dashboard/ProfileBackground.svg";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { StyleSheet } from "@react-pdf/renderer";
import { KeyboardTimePicker, KeyboardDatePicker } from "@material-ui/pickers";

export const RegisterInput = ({ label, name, value, onChange, type }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type ? type : "text"}
        className="form-control"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
      />
    </div>
  );
};

export const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#1891FC",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#1891FC",
    },
    "& .MuiInput-underline:before": {
      borderColor: "#1891FC",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1891FC",
      },
      "&:hover fieldset": {
        borderColor: "#1891FC",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1891FC",
      },
    },
  },
})(TextField);

export const CSSDatePicker = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#1891FC",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#1891FC",
    },
    "& .MuiInput-underline:before": {
      borderColor: "#1891FC",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1891FC",
      },
      "&:hover fieldset": {
        borderColor: "#1891FC",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1891FC",
      },
    },
  },
})(KeyboardDatePicker);

export const CSSTimePicker = withStyles({
  root: {
    "& label.Mui-focused": {
      color: "#1891FC",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#1891FC",
    },
    "& .MuiInput-underline:before": {
      borderColor: "#1891FC",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#1891FC",
      },
      "&:hover fieldset": {
        borderColor: "#1891FC",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#1891FC",
      },
    },
  },
})(KeyboardTimePicker);

const drawerWidth = 275;
export const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginTop: 0,
    margin: 0,
  },
  select: {
    "&:before": {
      borderColor: "#1891FC",
    },
    width: 195,
    padding: 0,
    margin: 0,
  },
  root: {
    display: "flex",
  },
  profile: {
    height: "19.82em",
    backgroundImage: `url(${Background})`,
    backgroundRepeat: "no-repeat",
    // backgroundSize: '275px 275px'
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
    overflowY: "scroll",
    height: 500,
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    [theme.breakpoints.down("xs")]: {
      color: "#1891FC",
    },
  },
  // tab: {
  //   ...theme.typography.tab,
  //   color: 'black',
  //   fontSize: 25
  // },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  loadSearchbar: {
    width: "100%",
    textAlign: "right",
    padding: "10px 0",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    overflow: "hidden",
  },
  content: {
    flex: "1 0 auto",
    padding: theme.spacing(3),
  },
  contentLoadList: {
    flex: "1 0 auto",
    padding: "10px",
    marginTop: 10,
  },
  // logout: {
  //   marginLeft: "15px"
  // },

  loads: {
    backgroundColor: "FFFFFF",
  },
  // loadboard: {
  //   backgroundColor: "#808080",
  // },
  loadcard: {},
  // accountcircle: {
  //   backgroundColor: "black",

  // },
  avatar: {
    marginTop: 10,
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  username: {
    marginTop: 5,
    color: "#FFFFFF",
  },
  dashboardContainer: {
    height: "100%",
  },
  fab: {
    position: "absolute",
    right: 20,
    // bottom:   0
  },
  table: {
    minWidth: 700,
  },
  TableContainer: {
    borderBottom: "none",
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    width: "400px",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    height: "400px",
  },
  invoicesRoot: {
    flexGrow: 1,
    flexDirection: "row",
    textAlign: "center",
  },
  modalBody: {
    width: "100%",
    minHeight: "324px",
  },
  modalFooter: {
    width: "100%",
  },
  btn_container: {
    textAlign: "end",
  },
  footer: {
    backgroundColor: theme.palette.common.white,
    width: "100%",
    zIndex: 1302,
    position: "relative",
  },
  mainContainer: {
    position: "absolute",
  },
  link: {
    color: "#1891FC",
    fontFamily: "Myriad Pro",
    fontSize: "0.75rem",
    fontWeight: 300,
    textDecoration: "none",
  },
  gridItem: {
    margin: "3em",
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
  tabContainer: {
    marginLeft: "auto",
  },

  tab: {
    ...theme.typography.tab,
    minWidth: 10,
    marginLeft: "15px",
  },

  drawerIconContainer: {
    marginLeft: "auto",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  drawerIcon: {
    color: "#1891FC",
    height: "30px",
    width: "30px",
  },
  drawerItem: {
    ...theme.typography.tab,
    color: "#1891FC",
    opacity: 0.7,
  },
  drawerItemSelected: {
    "& .MuiListItemText-root": {
      opacity: 1,
    },
  },
  appbarNavbar: {
    zIndex: theme.zIndex.modal + 1,
  },
  outside: {
    position: "relative",
    marginTop: "15%",
  },
  bottomRight: {
    position: "absolute",
    bottom: "10px",
    right: "10px",
  },
  bottomLeft: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
  },
  footerLoadListBar: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
}));

export const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 5,
    padding: 5,
    textAlign: "center",
  },
});

export const TextFieldHelper = ({
  nameNType,
  label,
  value,
  onChange,
  style,
  autoComplete,
}) => {
  return (
    <div className="form-group">
      <CssTextField
        id="outlined-basic"
        type={nameNType}
        className="form-control"
        name={nameNType}
        label={label}
        onChange={onChange}
        value={value}
        style={style}
        autoComplete={autoComplete ? autoComplete : "on"}
      />
    </div>
  );
};

export const ListItemHelper = ({ onClick, icon, primary, to, component }) => {
  return (
    <ListItem button onClick={onClick} to={to} component={component}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText primary={primary} />
    </ListItem>
  );
};
