import Modal from "../ownerOperator/Modal";
import InputField from "../../components/Atoms/form/InputField";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import { bookNow } from "../../actions/openBoard.action";

const Form = (props) => {
  const { location: { state: row = {} } = {} } = props;
  const config = {
    title: "Enter Bidding Amount",
  };
  const [amount, setAmount] = useState();
  const onChange = (e) => {
    setAmount(e.target.value);
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

  return (
    <Modal config={config}>
      <Grid sx={{ px: 3 }} justifyContent="center" display="flex">
        <form onSubmit={onSubmit}>
          <InputField
            name="bidAmount"
            label="Bid Amount"
            onChange={onChange}
            type="number"
            value={amount}
          />
          <Button variant="contained" color="success" onClick={onSubmit}>
            Send Bid
          </Button>
        </form>
      </Grid>
    </Modal>
  );
};

export default Form;
