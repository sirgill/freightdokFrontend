// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import React, { useEffect, useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

export default function Asynchronous({ label = '', placeholder = '', handleChange, name = '', value: defaultValue = '' }) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const [value, setValue] = useState();
    const [selectedopts, setSelectedOpts] = useState();

    React.useEffect(() => {
        if (handleChange) {
            handleChange({ name, value: selectedopts ? selectedopts : value })
        }
    }, [value, selectedopts]);


    const onChange = async (e) => {
        const val = e.target.value
        setValue(val);
    }

    useEffect(() => {
        if (value) {
            fetchWarehouses(value)
        }
    }, [value]);

    const fetchWarehouses = async (value) => {
        const { data, status } = await axios.get('/api/warehouse/search?text=' + value);
        if (status === 200) {
            const opt = data.map(item => {
                const { _id: id = '', name = '', address, city, zip, state } = item;
                return {
                    id, name, address, city, zip, state
                }
            })
            setOptions(opt);
        }
    }
    return (
        <Autocomplete
            id="asynchronous"
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => {

                localStorage.setItem("shipperName", value.name);
                return option.name === value.name
            }}
            getOptionLabel={(option) => option.name}
            options={options}
            inputValue={defaultValue || value}
            onChange={(event, newValue) => {
                console.log('newValuenewValue', newValue);
                setSelectedOpts(newValue)
            }}
            onInputChange={(event, newInputValue) => {
                setValue(newInputValue)
            }}
            loading={false}
            clearOnBlur={false}
            renderInput={(params) => (
                <TextField
                    {...params}
                    // onChange={onChange}
                    label={label}
                    variant="standard"
                    placeholder={placeholder}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
}
