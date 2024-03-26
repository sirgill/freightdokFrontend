import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import React, {useEffect, useState} from "react"
import styled from "@mui/material/styles/styled";

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
    flexWrap: 'wrap'
}))

const TablePagination = ({data = [], onPageChange, page = 0, count = 0, limit = 1}) => {
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
        <StyledStack direction='row' alignItems={'center'}>
            {count > 10 &&
            <Typography sx={{color: '#525F7F'}} fontSize={12}>Showing {data.length} of {count} entries</Typography>}
            {data.length !== count && <StyledPagination
                count={Math.ceil(count / limit)}
                color="primary"
                variant="contained"
                page={page + 1}
                size="medium"
                onChange={onChange}
            />}
        </StyledStack>
    )
}

export default TablePagination
