import React, {Fragment} from "react";
import {Button} from "@mui/material";
import EnhancedTable from "../../components/Atoms/table/Table";
import {useSelector} from "react-redux";

const OwnerOperator = () => {
    const tableConfig = {
        rowCellPadding: 'inherit',
        emptyMessage: 'No Owner Operator Found',
        columns: [
            {
                id: 'firstName',
                label: 'First Name'
            },
            {
                id: 'lastName',
                label: 'Last Name'
            },
            {
                id: 'phoneNumber',
                label: 'Phone Number'
            },
            {
                id: 'delete',
                renderer: ({row}) => {
                    return <Fragment>
                        <Button variant='outlined' color='error'>
                            Delete
                        </Button>
                        <Button variant='outlined' color='primary'>
                            Delete
                        </Button>
                    </Fragment>
                }
            }
        ]
    }

    return (
        <div>
            <EnhancedTable config={tableConfig} data={[]} loading={false}/>
        </div>
    )
}

export default OwnerOperator;