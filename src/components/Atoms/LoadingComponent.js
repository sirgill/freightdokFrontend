import {Stack} from "@mui/material";
import Spinner from "../layout/Spinner";
import React from "react";

const LoadingComponent = () => {
    return <Stack m={'auto'}>
        <Spinner color={'primary'} sx={{width: '100%'}} className='items-center' />
    </Stack>
}

export default LoadingComponent;