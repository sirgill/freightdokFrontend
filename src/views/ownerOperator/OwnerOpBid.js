import InputField from "../../components/Atoms/form/InputField";
import {useState} from "react";
import Modal from "./Modal";

const OwnerOpBid = (props) => {
    const config = {
        title: "Owner Op details"
    }
    const [amount, setAmount] = useState();
    const onChange = (e) => {
        setAmount(e.target.value);
    }

    return (
        <Modal config={config}>
            <InputField
                name='bidAmount'
                label='Bid Amount'
                onChange={onChange}
            />
        </Modal>
    )
}

export default OwnerOpBid;