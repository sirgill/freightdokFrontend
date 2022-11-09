import {Grid, Stack, FormControl, Button} from "@mui/material";
import React, {useCallback, useState} from "react";
import moment from "moment";
import AutoComplete from "../../components/Atoms/form/AutoComplete";
import Input from "../../components/Atoms/form/Input";
import RadioButtonsGroup from "../../components/Atoms/form/RadioButtons";
import DateRangePicker from "../../components/Atoms/form/DateRangePicker";

const radioConfig = {
    title: '',
    defaultValue: 'origin_states[]',
    name: 'origin',
    options: [
        {label: 'City', value: 'origin_city'},
        {label: 'State', value: 'origin_states[]'},
    ]
}
const radioConfig2 = {
    title: '',
    defaultValue: 'destination_states[]',
    name: 'destination',
    options: [
        {label: 'City', value: 'destination_city'},
        {label: 'State', value: 'destination_states[]'},
    ]
}

const options = [
    {label: 'Select', value: null},
    {label: 'Reefer', value: 'Reefer'},
    {label: 'Dry Van', value: 'Dry Van'},
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

const NewtrulFilters = ({getNewTrulList, pageSize, pageIndex, setParams}) => {
    const [form, setForm] = useState({});

    const onChange = ({name, value}) => {
        if (name === 'pickup') {
            const {startDate, endDate} = value;
            let obj = {
                pick_up_start_date: startDate,
                pick_up_end_date: endDate
            }
            return setForm({...form, ...obj})
        } else if (name === 'dropOff') {
            const {startDate, endDate} = value;
            let obj = {
                drop_off_start_date: startDate,
                drop_off_end_date: endDate
            }
            return setForm({...form, ...obj})
        }
        setForm({...form, [name]: value});
    }

    const handleRadioChange = useCallback(({name, value}) => {

        setForm({...form, [name + 'Radio']: value})
    }, [form])

    // console.log(form)
    const onSubmit = (e) => {
        e.preventDefault();
        const {pick_up_start_date, pick_up_end_date, drop_off_start_date, drop_off_end_date} = form;
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
        if (pick_up_start_date.getTime() !== pick_up_end_date.getTime()) {
            obj['pick_up_date_range'] = `${moment(pick_up_start_date).format('YYYY-MM-DD')}`
        }
        let params = getQueryString(obj);
        setParams(params);
        getNewTrulList(pageSize, pageIndex, params)
    }

    return (
        <Grid container gap={1} component={'form'} noValidate onSubmit={onSubmit} flexWrap={'wrap'}>
            <Stack>
                <Input name='origin' label='Origin' onChange={onChange}/>
                <FormControl sx={{m: 0.5}} variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Stack>
                <Input name='destination' label='Destination' onChange={onChange}/>
                <FormControl sx={{m: 0.5}} variant="standard">
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
                    sx={{minWidth: 200, width: 'inherit'}}
                />
            </Stack>
            <Stack>
                <DateRangePicker label={'Pick Up Date Range'} name='pickup' onChange={onChange}/>
            </Stack>
            <Stack>
                <DateRangePicker name='dropOff' onChange={onChange} label='Drop Off Date Range'/>
            </Stack>
            <Stack>
                <Button type={'submit'} variant='contained'>Search</Button>
            </Stack>
        </Grid>
    )
}

export default NewtrulFilters;