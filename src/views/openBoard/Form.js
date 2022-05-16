import Modal from "../ownerOperator/Modal";
import InputField from "../../components/Atoms/form/InputField";
import { useState } from "react";
import { Button, Grid, Typography, Stack, IconButton } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { bookNow } from "../../actions/openBoard.action";

const Form = (props) => {
  const { location: { state: row = {} } = {} } = props,
      {loadNumber = ''} = row;
  const config = {
    showClose: true
  };
  const [amount, setAmount] = useState(0);
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
    bookNow(row);
  };

  const onSubtract = () => {
    if(amount > 0)
      setAmount(amount - 1)
  }

  const onAdd = () => {
      if(Number.isInteger(amount)){
        setAmount(amount + 1)
      }
  }

  return (
    <Modal config={config}>
      <Grid sx={{ px: 3 }} justifyContent="center" display="flex">
        <form onSubmit={onSubmit} style={{textAlign: 'center'}} className={'form_bidding'}>
          <Typography sx={{fontSize: 32}}>
            C.H Robinson
          </Typography>
          <Typography sx={{fontSize: 32}}>
            Load Number: {loadNumber}
          </Typography>
          <Stack direction={'row'} sx={{py: 5}} alignItems={'center'} gap={'10px'} justifyContent={'center'}>
            <IconButton onClick={onSubtract}>
              <RemoveIcon />
            </IconButton>
            <div className='dollarInput'>
              <span className='dollarSign'>$</span>
              <InputField
                  name="bidAmount"
                  label=""
                  onChange={onChange}
                  type="number"
                  value={amount}
                  className={''}
              />
            </div>
            <IconButton onClick={onAdd}>
              <AddIcon />
            </IconButton>
          </Stack>
          <Button variant="contained" color="success" onClick={onSubmit}>
            Submit Bid
          </Button>
        </form>
      </Grid>
    </Modal>
  );
};

export default Form;
