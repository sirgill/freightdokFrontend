import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import {Button, Typography} from "@mui/material";
import Input from "../../components/Atoms/form/Input";

function Filters({onChange, name1, name2, label1 = '', label2 = '', dateLabel = '',onSubmit}) {
    const [value, setValue] = React.useState(null);
    const [value2, setValue2] = React.useState(null);
    const [error, setErrors] = useState('');

    useEffect(() => {
        if (!value || !value2) return
        if (new Date(value2) < new Date(value)) {
            return setErrors(label2 + ' cannot be less than ' + label1)
        }
        if (onChange) {
            onChange(value, value2)
        }
        setErrors('')
    }, [value, value2, label1, label2])

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={'row'} spacing={2} alignItems={'baseline'} component='form' onSubmit={onSubmit} noValidate>
                <Stack direction='row' spacing={2}>
                    <Input name='origin' label='Origin' onChange={onChange}/>
                    <Input name='destination' label='Destination' onChange={onChange}/>
                    <Stack>
                        <Stack direction={'row'} alignItems={'baseline'} gap={'30px'}>
                            <DatePicker
                                label={label1}
                                value={value}
                                name={name1}
                                onChange={(newValue) => {
                                    setValue(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} variant='outlined' size={'small'}/>}
                            />
                            <Typography>To</Typography>
                            <DatePicker
                                label={label2}
                                value={value2}
                                name={name2}
                                onChange={(newValue) => {
                                    setValue2(newValue);
                                }}
                                renderInput={(params) => <TextField {...params} variant='outlined' size={'small'}/>}
                            />
                        </Stack>
                        {error && <Typography sx={{fontSize: 12, color: 'red'}}>{error}</Typography>}
                    </Stack>
                </Stack>
                <Button type='submit' variant='contained'>Search</Button>
            </Stack>
        </LocalizationProvider>
    );
}

export default Filters
