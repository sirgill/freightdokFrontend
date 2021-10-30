import React, { useState } from 'react';
import EditIcon from "@material-ui/icons/Edit";
import IconButton from '@material-ui/core/IconButton';
import LoadDetailModal from '../loads/LoadDetailModal';

export default function InvocieEditItem ({ invoice }) {

    const [modalEdit, enableEdit] = useState(false);
    const [open, setOpen] = useState(false);

    const handleEditLoad = () => {
        setOpen(true);
        enableEdit(true);
    };

    return(
        <React.Fragment>
            <IconButton>
                <EditIcon color="primary" onClick={() => handleEditLoad()}/>
            </IconButton>
            <LoadDetailModal 
                modalEdit={modalEdit}
                open={open}
                load={invoice} 
                handleClose={()=>{
                    setOpen(false);
                    enableEdit(false);
                }}
            />
        </React.Fragment>
        
    )
}