import Modal from "../../ownerOperator/Modal";
import {Button, Grid, IconButton, Stack, Typography} from "@mui/material";
import InputField from "../../../components/Atoms/form/InputField";
import AddIcon from "@mui/icons-material/Add";
import React, {Fragment, useEffect, useState} from "react";
import RemoveIcon from "@mui/icons-material/Remove";

const AmountComponent = ({value, name, handleChange}) => {
    const [amount, setAmount] = useState(value)

    const onSubtract = () => {
        if (amount > 0)
            setAmount(amount - 1)
    }

    const onAdd = () => {
        setAmount(parseInt(amount) + 1)
    }
    const onChange = (e) => {
        const text = e.target.value;
        setAmount(text);
    };

    useEffect(() => {
        if (handleChange) {
            handleChange({name, value: amount})
        }
    }, [amount, handleChange]);

    return <Fragment>
        <IconButton onClick={onSubtract} disabled={amount <= 0}>
            <RemoveIcon/>
        </IconButton>
        <div className='dollarInput'>
            <InputField
                name="bidAmount"
                label="Amount ($)"
                onChange={onChange}
                type="number"
                value={amount}
                className={''}
            />
        </div>
        <IconButton onClick={onAdd}>
            <AddIcon/>
        </IconButton>
    </Fragment>
}

const CHRobinsonBid = (props) => {
    const {location: {state = {}} = {}} = props,
        {loadNumber = '', bidAmount = ''} = state;
    const onSubmit = () => {

    }

    return <Modal>
        <Grid sx={{px: 3}} justifyContent="center" display="flex">
            <form onSubmit={onSubmit} style={{textAlign: 'center'}} className={'form_bidding'}>
                <Typography sx={{fontSize: 32}}>
                    {'C.H Robinson'}
                </Typography>
                <Typography sx={{fontSize: 32}}>
                    Load Number: {loadNumber}
                </Typography>
                <Stack gap={2} direction={'row'} justifyContent='center' my={2}>
                    <Button variant='contained' color="error" sx={{px: 5}}>Reject</Button>
                    <Button variant='contained' color="success" sx={{px: 5}}>Accept</Button>
                </Stack>
                <Typography>OR</Typography>
                <Stack direction={'row'} sx={{py: 2}} alignItems={'end'} gap={'10px'} justifyContent={'center'}>
                    <AmountComponent value={bidAmount} />
                </Stack>
                <Button variant="contained" color="success" sx={{px: 3, py: 1, fontSize: 16}}>
                    Submit Bid
                </Button>
            </form>
        </Grid>
    </Modal>
}

export default CHRobinsonBid