import Modal from "../ownerOperator/Modal";
import {useHistory} from 'react-router-dom';
import InputField from "../../components/Atoms/form/InputField";
import React, {useState} from "react";
import {Button, Grid, Typography, Stack, IconButton} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {bookNow} from "../../actions/openBoard.action";

const Form = (props) => {
    const {location: {state: row = {}} = {}} = props,
        history = useHistory(),
        {loadNumber = ''} = row;
    let defaultCost = 0;
    const config = {
        showClose: true
    };
    if (row.hasOwnProperty("availableLoadCosts")) {
        const {availableLoadCosts = []} = row || {};
        const [item] = availableLoadCosts || [];
        if (item) {
            defaultCost = item.sourceCostPerUnit || 0
        }
    }
    const [amount, setAmount] = useState(defaultCost);
    const onChange = (e) => {
        const text = e.target.value;
        setAmount(text);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        Object.assign(row, {
            defaultEmail: "vy4693@gmail.com",
            env: "dev",
            bidAmount: amount,
        });
        const afterSubmit = (data) => {
            if(data?.success){
                history.goBack();
            }
        }
        bookNow(row, afterSubmit);
    };

    const onSubtract = () => {
        if (amount > 0)
            setAmount(amount - 1)
    }

    const onAdd = () => {
        console.log(amount)
        if (amount) {
            setAmount(parseInt(amount) + 1)
        }
    }

    return (
        <Modal config={config}>
            <Grid sx={{px: 3}} justifyContent="center" display="flex">
                <form onSubmit={onSubmit} style={{textAlign: 'center'}} className={'form_bidding'}>
                    <Typography sx={{fontSize: 32}}>
                        C.H Robinson
                    </Typography>
                    <Typography sx={{fontSize: 32}}>
                        Load Number: {loadNumber}
                    </Typography>
                    <Stack direction={'row'} sx={{py: 5}} alignItems={'end'} gap={'10px'} justifyContent={'center'}>
                        <IconButton onClick={onSubtract} disabled={amount <=0}>
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
                    </Stack>
                    <Button variant="contained" color="success" onClick={onSubmit} sx={{px: 3, py: 2, fontSize: 16}}>
                        Submit Bid
                    </Button>
                </form>
            </Grid>
        </Modal>
    );
};

export default Form;
