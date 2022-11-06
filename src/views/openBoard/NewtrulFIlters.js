import {Grid, Stack, TextField, FormControl, Button} from "@mui/material";
import React, {useCallback, useState} from "react";
import RadioButtonsGroup from "../../components/Atoms/form/RadioButtons";
import AutoComplete from "../../components/Atoms/form/AutoComplete";
import Input from "../../components/Atoms/form/Input";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import {LocalizationProvider} from "@mui/lab";

const radioConfig = {
    title: '',
    defaultValue: 'city',
    name: 'origin',
    options: [
        {label: 'City', value: 'city'},
        {label: 'State', value: 'state'},
    ]
}
const radioConfig2 = {
    title: '',
    defaultValue: 'city',
    name: 'destination',
    options: [
        {label: 'City', value: 'city'},
        {label: 'State', value: 'state'},
    ]
}

const options = [
    {label: '-- Select Equipment --', value: null},
    {label: 'Reefer', value: 'reefer'},
    {label: 'Dry Van', value: 'dryVan'},
    {label: 'Dry Van or Reefer', value: 'dryVanReefer'},
]

const serialize = (obj={}) => {
    const str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

const getQueryString = (form) => {
    const str = serialize(form);
    console.log(str)
}

const NewTrulFilters = () => {
    const [form, setForm] = useState({  })

    const onChange = ({name, value}) => {
        setForm({...form, [name]: value});
    }

    const handleRadioChange = useCallback(({name, value}) => {
        setForm({...form, [name+'Radio']: value})
    }, [form])
    console.log(form)

    const onSubmit = (e) => {
        e.preventDefault();
        getQueryString(form);
    }

    return (
        <Grid container gap={2} component={'form'} noValidate onSubmit={onSubmit} flexWrap={'wrap'}>
            <Stack>
                <Input name='origin' label='Origin' onChange={onChange} />
                <FormControl sx={{ m: 0.5}}  variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Stack>
                <Input name='destination' label='Destination' onChange={onChange} />
                <FormControl sx={{ m: 0.5 }}  variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig2}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Stack>
                <AutoComplete
                    options={options}
                    value={form['equipment'] || null}
                    label='Equipment'
                    size={'small'}
                    onChange={onChange}
                    name='equipment'
                    sx={{minWidth: 200, width: 'inherit'}}
                />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack>
                    <DatePicker
                        label={'Pick Up Date Range'}
                        value={form['pickupDate']}
                        name={'pickup'}
                        onChange={(newValue) => {
                            setForm({...form, pickupDate: newValue});
                        }}
                        renderInput={(params) => <TextField {...params} variant='outlined' size={'small'} />}
                    />
                </Stack>
                <Stack>
                    <DatePicker
                        label={'Drop Off Date Range'}
                        value={form['dropDate']}
                        name={'drop'}
                        onChange={(newValue) => {
                            setForm({...form, dropDate: newValue});
                        }}
                        renderInput={(params) => <TextField {...params} variant='outlined' size={'small'} />}
                    />
                </Stack>
            </LocalizationProvider>
            <Stack>
                <Button type={'submit'} variant='contained'>Search</Button>
            </Stack>
        </Grid>
    )
}

export default NewTrulFilters;