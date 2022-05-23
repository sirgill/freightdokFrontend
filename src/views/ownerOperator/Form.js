import DialogTitle from "@mui/material/DialogTitle";
import {blue} from "../../components/layout/ui/Theme";
import DialogContent from "@mui/material/DialogContent";
import InputField from "../../components/Atoms/form/InputField";
import Grid from "@mui/material/Grid";
import SubmitButton from "../../components/Atoms/form/SubmitButton";
import Dialog from "@mui/material/Dialog";
import React, {Fragment} from "react";
import {Button} from "@material-ui/core";
import {useSelector} from "react-redux";
import FormModal from "./FormModal";

const Form = ({isEdit = false}) => {
    const [open, setOpen] = React.useState(false),
        [form, setForm] = React.useState({});
    const user = useSelector(state => state.auth)

    const handleClickOpen = () => {
        setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    }

    return (
        <Fragment>
            {(user && user.role === "afterhours") || (!isEdit &&
                <Button
                    color="primary"
                    onClick={handleClickOpen}
                    style={{marginBottom: "20%"}}
                    variant={'contained'}
                >
                    Add Owner-Op
                </Button>
            )}
            {open && <FormModal />}
        </Fragment>
    )
}

export default Form;