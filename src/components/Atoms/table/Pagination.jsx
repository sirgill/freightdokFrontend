import Pagination from "@mui/material/Pagination"
import { useState, useEffect } from "react"

const TablePagination = ({ data = [] }) => {
    const [length, setLength] = useState(0);

    useEffect(() => {
        if (Array.isArray(data)) {
            setLength(data.length);
        }
    }, [data]);

    if (length <= 10) {
        return null;
    }
    return (
        <Pagination
            count={10}
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ display: 'flex', justifyContent: 'end' }}
        />
    )
}

export default TablePagination
