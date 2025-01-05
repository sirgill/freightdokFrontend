import { Box, Typography } from "@mui/material";
import Widget from "../../../../layout/Widget";
import Table from "../../../../components/Atoms/table/Table";
import _ from "lodash";
import { readableDateTime } from "../../../../utils/utils";

const config = {
    rowCellPadding: 'normal',
    columns: [
        {
            id: 'loadNumber',
            label: 'Loads #'
        },
        {
            id: 'pickup',
            label: 'Pickup',
            valueFormatter: (val) => {
                return _.get(val, '[0].pickupCity', '') + `, ` + _.get(val, '[0].pickupState', '')
            }
        },
        {
            id: 'drop',
            label: 'Delivery',
            valueFormatter: (val) => _.get(val, '[0].dropCity', '') + `, ` + _.get(val, '[0].dropState', '')
        },
        {
            id: 'miles',
            label: 'Miles',
        },
        {
            id: 'rate',
            label: 'Rate',
            isCostCell: true
        },
        {
            id: '$/mile',
            label: '$/Mile',
        },
        {
            id: 'updatedAt',
            label: 'Last Updated On',
            valueFormatter: readableDateTime
        }
    ]
}
const Overview = ({ data, loading, isRefetching, presentableDateRange }) => {
    return <>
        <Box>
            <Widget title='Recent Loads' titleSx={{ fontSize: 16 }} sx={{ border: 'none' }}>
                <Typography align='right' fontWeight='bold'>Performance metrics ({presentableDateRange})</Typography>
                <Box
                    sx={{
                        background: '#fff',
                        '.enhanced-table': {
                            '.tableContainer': {
                                boxShadow: 'none',
                                border: '1px solid #e5e5e5',
                                height: 400
                            }
                        }
                    }}
                >
                    <Table loading={loading} data={data} config={config} isRefetching={isRefetching} />
                </Box>
                <Typography color='text.secondary'>Total: {data?.length}</Typography>
            </Widget>
        </Box>
    </>
}

export default Overview;