import {Box, Typography} from "@mui/material";

const Error404 = () => {
    return <Box>
        <Typography variant='h2' align='center' fontWeight={600}>404: Not Found</Typography>
        <Typography align='center' variant='h5'>Seems this User role is not configured. Please connect with Admin</Typography>
    </Box>
}

export default Error404