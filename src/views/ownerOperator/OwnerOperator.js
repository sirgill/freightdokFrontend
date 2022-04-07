import React, {Fragment, useEffect} from "react";
import {Button} from "@mui/material";
import EnhancedTable from "../../components/Atoms/table/Table";
import {useSelector} from "react-redux";
import axios from "axios";

const OwnerOperator = () => {

    useEffect(() => {
        axios({
            method: 'post',
            url: 'https://api.navisphere.com/v1/oauth/token',
            data: {
                "client_id": "0oah9sno3fT68waXq357",
                "client_secret": "dExV7FfIod7zNjt_N6lUG44TLTcwvJ-IInImQbrr",
                "audience": "https://inavisphere.chrobinson.com",
                "grant_type": "client_credentials"
            }
        }).then(res => {
            console.log(res);
        });
    }, [])

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