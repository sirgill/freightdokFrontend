import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React, {useEffect, useState} from "react"
import styled from "@mui/material/styles/styled";
import {Select} from "../index";

const StyledPagination = styled(Pagination)(({theme}) => ({
    "& .MuiPaginationItem-root": {
        [theme.breakpoints.down("md")]: {
            height: "1.8rem",
            width: "1rem"
        }
    }
}));

const StyledStack = styled(Stack)(({theme}) => ({
    [theme.breakpoints.down("sm")]: {
        justifyContent: 'center'
    },
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
        '& .pageSizeSelect': {
        width: 80
        }
}))

const TablePagination = ({data = [], onPageChange, page = 1, count = 0, limit = 1, onPageSizeChange, isLoading}) => {
    const [length, setLength] = useState(0);

    useEffect(() => {
        if (Array.isArray(data)) {
            setLength(data.length);
        }
    }, [data]);

    const onChange = (e, pgNum) => {
        if (+page !== +pgNum && typeof onPageChange === 'function') {
            onPageChange(e, +pgNum)
        }
    }

    const handlePageSize = ({value}) => {
        if(typeof onPageSizeChange === 'function'){
            onPageSizeChange({value});
        }
    }

    if (count <= 5) {
        return null;
    }
    return (
        <StyledStack direction='row' alignItems={'center'}>
            <Typography sx={{color: '#525F7F'}} fontSize={12}>Showing {length} of {count} entries</Typography>
            <Stack direction='row' alignItems='center'>
                <Select
                    disabled={isLoading}
                    name='pageSize'
                    label=''
                    value={limit}
                    options={[
                        {id: 5, label: 5},
                        {id: 10, label: 10},
                        {id: 20, label: 20},
                        {id: 50, label: 50},
                        {id: 100, label: 100},
                    ]}
                    className='pageSizeSelect'
                    onChange={handlePageSize}
                />
                <StyledPagination
                    disabled={isLoading}
                    count={Math.ceil(count / limit)}
                    color="primary"
                    variant="contained"
                    page={page}
                    size="medium"
                    onChange={onChange}
                />
            </Stack>
        </StyledStack>
    )
}

export default TablePagination
