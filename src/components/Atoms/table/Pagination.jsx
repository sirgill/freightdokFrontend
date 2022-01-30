import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React, {useEffect, useState} from "react"

const TablePagination = ({data = [], onPageChange, page, count, limit = 1}) => {
    const [length, setLength] = useState(0);

    useEffect(() => {
        if (Array.isArray(data)) {
            setLength(data.length);
        }
    }, [data]);

    const onChange = (e, pgNum) => {
        if (onPageChange) {
            onPageChange(e, pgNum)
        }
    }

    if (length < 10 && count < 10) {
        return null;
    }
    return (
        <Stack direction='row' sx={{display: 'flex', justifyContent: 'space-between', p: 3}} alignItems={'center'}>
            {count > 10 && <Typography sx={{color: '#525F7F'}} fontSize={13}>Showing {data.length} of {count} entries</Typography>}
            <Pagination
                count={Math.ceil(count / limit)}
                color="primary"
                variant="contained"
                page={page + 1}
                size="medium"
                onChange={onChange}
            />
        </Stack>
    )
}

export default TablePagination
