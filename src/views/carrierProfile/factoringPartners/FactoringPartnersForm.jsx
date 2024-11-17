import Modal from "../../../components/Atoms/Modal";
import React, {useState} from "react";
import {Box, Grid} from "@mui/material";
import {Input} from "../../../components/Atoms";

const Form = () => {
    const [form, setForm] = useState({})

    const onChange = ({name, value}) => {
        setForm({ ...form , [name]: value });
    }

    return <Grid component='form' container>
        <Grid item xs={12}>
            <Input name='name' value='' onChange={onChange} />
        </Grid>
    </Grid>
}

const FactoringPartnersForm = () => {
    return <Modal
        config={{
            title: 'Update Factoring Partner'
        }}
    >
        <Box>
            <Form />
        </Box>
    </Modal>
}

export default FactoringPartnersForm;