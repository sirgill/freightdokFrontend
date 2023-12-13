import {FormControl, FormHelperText, InputLabel, MenuItem, Select as MuiSelect} from "@mui/material";
import PropTypes from "prop-types";
import {useMemo} from "react";

const Select = ({ options = [], labelKey = 'label', valueKey = 'id', label, value, name, onChange, errors={},
                    renderValue = null }) => {
    const hasError = !!errors[name],
        errorText = errors[name];
    const items = useMemo(() => {
        return (options || []).map(item => {
            return <MenuItem value={item[valueKey]} key={item[valueKey]}>
                {item[labelKey]}
            </MenuItem>
        })
    }, [options])

    const handleChange = (e) => {
        const {name, value} = e.target;
        if(onChange){
            onChange({name, value});
        }
    }

    return  <FormControl error={hasError} fullWidth size='small'>
        <InputLabel id="demo-simple-select-error-label">{label}</InputLabel>
        <MuiSelect
            name={name}
            labelId="demo-simple-select-error-label"
            id="demo-simple-select-error"
            value={value}
            label="Age"
            onChange={handleChange}
            renderValue={renderValue}
            sx={{
                '.MuiOutlinedInput-input': {
                    border: 'none !important'
                }
            }}
        >
            <MenuItem value="">
                <em>None</em>
            </MenuItem>
            {items}
        </MuiSelect>
        {hasError && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
}

Select.proptype = {
    options: PropTypes.array.isRequired,
    labelKey: PropTypes.string,
    valueKey: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errors: PropTypes.object,
    renderValue: PropTypes.node
}

export default Select;