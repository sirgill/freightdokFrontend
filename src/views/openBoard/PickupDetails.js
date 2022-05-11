import {Stack, Typography} from '@mui/material';
import React, {Fragment} from "react";

const Details = ({title = '', location = '', name, type = '', date, appointment='', avgLoadTime=''}) => {
    return <>
        <Typography sx={{fontSize: 24}}>{title}</Typography>
        <Typography sx={{fontSize: 24}}>{name}</Typography>
        <Typography sx={{fontSize: 24}}>{location}</Typography>
        {type && <Stack direction={'row'} justifyContent={'center'}>
            <Typography sx={{fontSize: 24, mr: 1}}>{type}: </Typography>
            <Typography sx={{fontSize: 24}}>{date}</Typography>
        </Stack>}
        {appointment && <Stack direction={'row'} justifyContent={'center'}>
            <Typography sx={{fontSize: 24, mr: 1}}>Appointment: </Typography>
            <Typography sx={{fontSize: 24}}>{appointment}</Typography>
        </Stack>}
        {avgLoadTime && <Stack direction={'row'} justifyContent={'center'}>
            <Typography sx={{fontSize: 24, mr: 1}}>Average Load Time: </Typography>
            <Typography sx={{fontSize: 24}}>{avgLoadTime}</Typography>
        </Stack>}
    </>
}

export default Details;