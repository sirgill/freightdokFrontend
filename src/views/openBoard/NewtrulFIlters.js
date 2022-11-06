import { Grid, Stack, TextField, FormControl, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import RadioButtonsGroup from "../../components/Atoms/form/RadioButtons";
import AutoComplete from "../../components/Atoms/form/AutoComplete";
import Input from "../../components/Atoms/form/Input";
import DatePicker from "@mui/lab/DatePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { LocalizationProvider } from "@mui/lab";

const radioConfig = {
    title: '',
    defaultValue: 'city',
    name: 'origin',
    options: [
        { label: 'City', value: 'origin_city' },
        { label: 'State', value: 'origin_states[]' },
    ]
}
const radioConfig2 = {
    title: '',
    defaultValue: 'city',
    name: 'destination',
    options: [
        { label: 'City', value: 'destination_city' },
        { label: 'State', value: 'destination_states[]' },
    ]
}

const options = [
    { label: 'Select', value: null },
    { label: 'Reefer', value: 'Reefer' },
    { label: 'Dry Van', value: 'Dry Van' },
    // { label: 'Dry Van or Reefer', value: 'Dry Van & Reefer' },
]

const serialize = (obj = {}) => {
    const str = [];
    for (let p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

const getQueryString = (form) => {
    const str = serialize(form);
    console.log(str);
    return str
}

const NewTrulFilters = ({ getNewTrulList, pageSize, pageIndex, setParams }) => {
    const [form, setForm] = useState({})
    const onChange = ({ name, value }) => {
        setForm({ ...form, [name]: value });
    }

    const handleRadioChange = useCallback(({ name, value }) => {

        setForm({ ...form, [name + 'Radio']: value })
    }, [form])


    const onSubmit = (e) => {
        e.preventDefault();
        let obj = {}
        if (form['originRadio']) {
            obj[form['originRadio']] = form.origin || ''
        }
        if (form['destinationRadio']) {
            obj[form['destinationRadio']] = form.destination || ''
        }
        if (form['equipments[]']) {
            obj['equipments[]'] = form['equipments[]']
        }
        let params = getQueryString(obj);
        setParams(params);
        getNewTrulList(pageSize, pageIndex, params)
    }

    return (
        <Grid container gap={2} component={'form'} noValidate onSubmit={onSubmit} flexWrap={'wrap'}>
            <Stack>
                <Input name='origin' label='Origin' onChange={onChange} />
                <FormControl sx={{ m: 0.5 }} variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Stack>
                <Input name='destination' label='Destination' onChange={onChange} />
                <FormControl sx={{ m: 0.5 }} variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig2}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Stack>
                <AutoComplete
                    options={options}
                    value={form['equipments[]'] || null}
                    label='Equipment'
                    size={'small'}
                    onChange={onChange}
                    name='equipments[]'
                    sx={{ minWidth: 200, width: 'inherit' }}
                />
            </Stack>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack>
                    <DatePicker
                        label={'Pick Up Date Range'}
                        value={form['pickupDate']}
                        name={'pickup'}
                        onChange={(newValue) => {
                            setForm({ ...form, pickupDate: newValue });
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
                            setForm({ ...form, dropDate: newValue });
                        }}
                        renderInput={(params) => <TextField {...params} variant='outlined' size={'small'} />}
                    />
                </Stack>
            </LocalizationProvider>
            <Stack>
                <Button type={'submit'} variant='contained' onClick={() => {
                    // alert(JSON.stringify(form))
                }} >Search</Button>
            </Stack>
        </Grid>
    )
}

export default NewTrulFilters;