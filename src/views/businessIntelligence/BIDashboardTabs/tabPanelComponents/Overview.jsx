import {Box} from "@mui/material";
import Widget from "../../../../layout/Widget";
import Table from "../../../../components/Atoms/table/Table";

const Overview = () => {
    return <Box>
        <Widget title='Recent Loads' titleSx={{fontSize: 16}} sx={{border: 'none'}}>
            <Box
                sx={{
                    background: '#fff',
                    '.enhanced-table': {
                        '.tableContainer': {
                            boxShadow: 'none',
                            border: '1px solid #e5e5e5'
                        }
                    }
                }}
            >
                <Table />
            </Box>
        </Widget>
    </Box>
}

export default Overview;