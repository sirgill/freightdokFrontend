import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import _ from 'lodash'
import PropTypes from "prop-types";
import { requestGet } from "../../utils/request";
import { notification } from "../../actions/alert";


/*
* {parentOnClear} - Boolean: Use this flag in parent to reset the states
* */
const SearchAutoComplete = ({ label = '', name, onSelect, parentOnClear }) => {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);

    const fetch = React.useMemo(
        () =>
            _.debounce((request, callback) => {
                requestGet({ uri: '/api/searchLocationAutocomplete?search=' + request.input })
                    .then(r => callback(r.data, r.success));
            }, 500),
        [],
    );

    useEffect(() => {
        let active = true;
        if (onSelect) {
            onSelect({ selectedObj: value, value: inputValue, name })
        }

        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results = {}, success) => {
            if (active) {
                let newOptions = [];

                if (!success) {
                    notification(results.error_message, 'error');
                }

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    const { predictions = [] } = results;
                    newOptions = [...newOptions, ...predictions];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    useEffect(() => {
        if (parentOnClear) {
            setValue(null);
            setInputValue('');
        }
    }, [parentOnClear])

    return (
        <Autocomplete
            id="searchAutocomplete"
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.description
            }
            filterOptions={(x) => x}
            options={options}
            autoComplete
            includeInputInList
            filterSelectedOptions
            value={value}
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);
                setValue(newValue);
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} label={label} size='small' fullWidth />
            )}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        <Grid container alignItems="center">
                            <Grid item>
                                <Box
                                    component={LocationOnIcon}
                                    sx={{ color: 'text.secondary', mr: 2 }}
                                />
                            </Grid>
                            <Grid item xs>
                                <Typography variant="body2" color="text.primary">
                                    {option.description}
                                </Typography>
                            </Grid>
                        </Grid>
                    </li>
                );
            }}
        />
    );
}

export default SearchAutoComplete;

SearchAutoComplete.prototype = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onSelect: PropTypes.func,
    parentOnClear: PropTypes.bool
}