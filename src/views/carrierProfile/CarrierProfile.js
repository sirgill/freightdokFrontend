import React from 'react';
import EnhancedTable from "../../components/Atoms/table/Table";

const CarrierProfile = () => {
    const data = [{
        companyName: 'test',
        ein: '121212',
        dot: 'test'
    }]

    const tableConfig = {
        rowCellPadding: 'inherit',
        columns: [
            {
                id: 'companyName',
                label: 'Company Name'
            },
            {
                id: 'ein',
                label: 'EIN#'
            },
            {
                id: 'dot',
                label: 'DOT#'
            },
            {
                id: 'operatingStatus',
                label: 'Operating Status'
            },
            {
                id: '',
                label: 'General Liability'
            },
            {
                id: '',
                label: 'Auto Liability'
            },
            {
                id: '',
                label: 'Cargo Liability'
            },
        ]
    }
    return (
        <>
            <EnhancedTable data={data} config={tableConfig} />
        </>
    )
}

export default CarrierProfile;