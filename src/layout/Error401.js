import {Box, Typography} from "@mui/material";

const Error401 = () => {
    return <Box>
        <Typography variant='h2' align='center' fontWeight={600}>401: Unauthorized</Typography>
        <Typography align='center' variant='h5'>You are not authorized to view this page.</Typography>
    </Box>
}

export default Error401