import { Button, FormControl, Grid, Stack } from "@mui/material";
import React, { useCallback, useState } from "react";
import moment from "moment";
import AutoComplete from "../../components/Atoms/form/AutoComplete";
import RadioButtonsGroup from "../../components/Atoms/form/RadioButtons";
import DateRangePicker from "../../components/Atoms/form/DateRangePicker";
import SearchAutoComplete from "../../components/Atoms/SearchAutoComplete";
import Input from "../../components/Atoms/form/Input";
import { geoLocationService } from "../../actions/warehouse";
import {serialize} from "../../utils/utils";

const radioConfig = {
    title: '',
    defaultValue: 'origin_states[]',
    name: 'origin',
    options: [
        { label: 'City', value: 'origin_city' },
        { label: 'State', value: 'origin_states[]' },
    ]
}
const radioConfig2 = {
    title: '',
    defaultValue: 'destination_states[]',
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

const getQueryString = (form) => {
    let _form = { ...form };
    if (_form['originGeoLocation']) {
        delete _form.originGeoLocation
    }
    if (_form['destinationGeoLocation']) {
        delete _form.destinationGeoLocation
    }

    if (!_form['originRadius']) {
        delete _form.originRadius
    }
    if (!_form['destinationRadius']) {
        delete _form.destinationRadius
    }
    return serialize(_form)
}

const FORM_DEFAULT = { originRadio: 'origin_city', destinationRadio: 'destination_city', destination_radius: '', origin_radius: '' }
const NewtrulFilters = ({ getNewTrulList, setFilters, pageSize, pageIndex, setParams, defaultParams }) => {
    const [form, setForm] = useState(FORM_DEFAULT);
    const [parentOnClear, setParentOnClear] = useState(false)

    const onChange = ({ name, value }) => {
        if (name === 'pickup') {
            const { startDate, endDate } = value;
            let obj = {
                pick_up_start_date: startDate,
                pick_up_end_date: endDate
            }
            return setForm({ ...form, ...obj })
        } else if (name === 'dropOff') {
            const { startDate, endDate } = value;
            let obj = {
                drop_off_start_date: startDate,
                drop_off_end_date: endDate
            }
            return setForm({ ...form, ...obj })
        }
        setForm({ ...form, [name]: value });
    }

    const handleRadioChange = useCallback(({ name, value }) => {
        setForm({ ...form, [name + 'Radio']: value })
    }, [form])

    const onSubmit = async (e) => {
        e.preventDefault();
        const dates = ["pick_up_start_date", "pick_up_end_date", "drop_off_start_date", "drop_off_end_date"]
        let obj = { ...form }
        if (form['originRadio']) {
            obj[form['originRadio']] = form.origin || ''
        }
        if (form['destinationRadio']) {
            obj[form['destinationRadio']] = form.destination || ''
        }
        if (form['equipments[]']) {
            obj['equipments[]'] = form['equipments[]']
        }

        dates.forEach(dt => {
            if (form[dt]) {
                obj[dt] = moment(form[dt]).format('YYYY-MM-DD')
            }
        })
        delete obj.originRadio
        delete obj.destinationRadio
        if (obj.destination) {
            const { data: { data, success } = {} } = await geoLocationService({ address: obj.destination });
            if (success) {
                obj['destinationGeoLocation'] = data;
            }
        }
        if (obj.origin) {
            const { data: { data, success } = {} } = await geoLocationService({ address: obj.origin });
            if (success) {
                obj['originGeoLocation'] = data;
            }
        }
        const filters = { ...obj, pageSize, pageIndex }
        setFilters(filters)
        let params = getQueryString(obj);
        setParams(params);
        getNewTrulList(filters, params);
    }

    const onClear = () => {
        setForm(() => FORM_DEFAULT)
        setParentOnClear(true);
        setFilters(defaultParams);
        setTimeout(() => {
            getNewTrulList(defaultParams);
            setParentOnClear(false);
        }, 200)
    }

    return (
        <Grid container gap={1} component={'form'} noValidate onSubmit={onSubmit} flexWrap={'wrap'}>
            <Stack>
                <SearchAutoComplete label='Origin' onSelect={onChange} name='origin' parentOnClear={parentOnClear} />
                <FormControl sx={{ m: 0.5 }} variant="standard">
                    <RadioButtonsGroup
                        parentValue={form['originRadio']}
                        config={radioConfig}
                        onChange={handleRadioChange}
                    />
                </FormControl>
            </Stack>
            <Input
                type={'number'}
                label='Radius'
                sx={{ width: 100 }}
                placeholder='Miles'
                inputProps={{ min: 1 }}
                value={form['origin_radius']}
                onChange={onChange}
                name='origin_radius'
                fullWidth={false}
            />
            <Stack>
                <SearchAutoComplete name='destination' label='Destination' onSelect={onChange}
                    parentOnClear={parentOnClear} />
                <FormControl sx={{ m: 0.5 }} variant="standard">
                    <RadioButtonsGroup
                        config={radioConfig2}
                        onChange={handleRadioChange}
                        parentValue={form['destinationRadio']}
                    />
                </FormControl>
            </Stack>
            <Input
                type={'number'}
                label='Radius'
                sx={{ width: 100 }}
                placeholder='Miles'
                inputProps={{ min: 1 }}
                value={form['destination_radius']}
                onChange={onChange}
                name='destination_radius'
                fullWidth={false}
            />
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
            <Stack>
                <DateRangePicker label={'Pick Up Date Range'} name='pickup' onChange={onChange} />
            </Stack>
            <Stack>
                <DateRangePicker name='dropOff' onChange={onChange} label='Drop Off Date Range' />
            </Stack>
            <Stack>
                <Button type={'submit'} variant='contained'>Search</Button>
            </Stack>
            <Stack>
                <Button onClick={onClear} variant='outlined'>Clear</Button>
            </Stack>
        </Grid>
    )
}

export default NewtrulFilters;