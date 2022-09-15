import React, {useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from '@mui/lab/DatePicker';
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import ReplayIcon from '@mui/icons-material/Replay';
import {IconButton, Typography} from "@mui/material";
import InputField from "../../components/Atoms/form/InputField";

function Filters({ onChange, name1, name2, label1 = '', label2 = '', onRefresh, dateLabel = '', loading=false, vendor }) {
    const [value, setValue] = React.useState(null);
    const [value2, setValue2] = React.useState(null);
    const [error, setErrors] = useState('');

    useEffect(() => {
        if(!value || !value2) return
        if(new Date(value2) < new Date(value)){
            return setErrors(label2 + ' cannot be less than ' + label1)
        }
        if(onChange) {
            onChange(value, value2)
        }
        setErrors('')
    }, [value, value2])

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Stack direction={'row'} alignItems={'baseline'} gap={'30px'} justifyContent={'space-between'}>
                <Stack>
                    <Stack direction={'row'} alignItems={'baseline'} gap={'30px'}>
                        {dateLabel && <Typography sx={{fontSize: 14}}>{dateLabel}:</Typography>}
                        <DatePicker
                            label={label1}
                            value={value}
                            name={name1}
                            onChange={(newValue) => {
                                setValue(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} variant='standard' />}
                        />
                        <Typography>To</Typography>
                        <DatePicker
                            label={label2}
                            value={value2}
                            name={name2}
                            onChange={(newValue) => {
                                setValue2(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} variant='standard' />}
                        />
                    </Stack>
                    {error && <Typography sx={{fontSize: 12, color: 'red'}}>{error}</Typography>}
                </Stack>
                <Stack direction={'row'}>
                    <Stack>
                        <InputField
                            // label={'Select Vendor'}
                            type={'select'}
                            options={[{id: 'chrobinson', label : 'CH Robinson'},
                                {id: 'newTrul', label: 'New Trul'}
                            ]}
                            value={vendor}
                            onChange={onChange.bind(this, 'select')}
                        />
                    </Stack>
                    <Stack>
                        <IconButton title='Refresh' onClick={onRefresh}>
                            <ReplayIcon className={loading ? 'rotateIcon': ''} />
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
        </LocalizationProvider>
    );
}

export default Filters
