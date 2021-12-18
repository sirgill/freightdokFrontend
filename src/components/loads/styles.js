import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
export const useStyles = makeStyles((theme) => ({
  root: {
    // display: "flex",
    minWidth: 200,
    maxWidth: 350,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "grey",
    // boxShadow: "1px 3px 1px #9E9E9E",
  },
  cardcontent: {
    flexDirection: "row",
    wrap: "wrap",
    minWidth: 100,
    maxWidth: 150,
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 5,
    "&:last-child": {
      paddingBottom: 5,
    },
  },
  pickup: {
    fontSize: 12,
    alignItems: "center",
  },
  h4: {
    margin: 0,
    padding: 0,
  },
  loadp: {
    display: "flex",
    margin: 0,
    padding: 0,
    paddingLeft: 150,
    alignItems: "center",
  },
  playIcon: {
    height: 38,
    width: 30,
    marginLeft: 0,
  },
  textField: {
    "& input": {
      color: "#000000",
    },
    "& input:disabled": {
      color: "#000000",
    },
  },
  textFieldDialog: {
    "& input": {
      color: "#000000",
    },
    "& input:disabled": {
      color: "#000000",
    },
  },
  textFieldDialogPickup: {
    "& input": {
      color: "#000000",
    },
    "& input:disabled": {
      color: "#000000",
    },
    marginLeft: "75px",
  },
  textFieldDialogDrop: {
    "& input": {
      color: "#000000",
    },
    "& input:disabled": {
      color: "#000000",
    },
    marginLeft: "25px",
  },
  resize: {
    fontSize: 12,
  },
  resizeDialog: {
    fontSize: 14,
  },

  newLoad: {
    margin: 0,
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: "50%",
    left: "50%",
    width: "80%",
    transform: "translate(-50%, -50%)",
    overflowY: "auto",
    height: "calc(100vh - 50px)",
  },
  rootLoadDetailModal: {
    flexGrow: 1,
    flexDirection: "row",
    textAlign: "center",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  resizeDialog: {
    fontSize: 14,
  },
}));
