import {memo, useEffect, useState} from "react";
import cn from 'classnames';
import {Autocomplete, FormControl, TextField} from "@mui/material";

const AutoCompleteField = ({classNameRoot, disabled, label, hasError, labelKey, selectSx, className, placeholder, errorText, ...rest}) => {
    const labelId = 'autocomplete-label-' + label;
    return (
        <div className={cn(classNameRoot, {'fieldDisabled': disabled})}>
            {/*{!!label && <InputLabel id={labelId} sx={{pb: '5px'}}>{label}</InputLabel>}*/}
            <FormControl fullWidth>
                <Autocomplete
                    renderInput={params => <TextField placeholder={placeholder} error={hasError} label={label} {...params} />}
                    getOptionLabel={option => option[labelKey]}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    id={labelId}
                    classes={{paper: className}}
                    sx={selectSx}
                    {...rest}
                />
            </FormControl>
        </div>
    )
}

const AutoCompletePure = memo(AutoCompleteField)

const AutoComplete = (props) => {
    const {
        label,
        name,
        valueKey = 'value',
        labelKey = 'label',
        errors = {},
        disablePortal = true,
        onChange,
        disabled = false,
        value,
        options = [],
        className,
        classNameRoot,
        disableClearable = true,
        selectSx = {},
        placeholder,
        ...rest
    } = props;

    const [inputValue, setInputValue] = useState(null)
    const hasError = !!errors[name] || false,
        errorText = errors[name] || '';

    const handleChange = (e, value) => {
        if (onChange) onChange({name, value: value ? value[valueKey] : ""})
    }

    useEffect(() => {
        const val = Array.isArray(options) ? options.find(opt => opt[valueKey] === value) || null : null
        setInputValue(val)
    }, [value, options, valueKey])

    return (
        <AutoCompletePure
            {...rest}
            value={inputValue}
            options={options}
            label={label}
            selectSx={selectSx}
            labelKey={labelKey}
            valueKey={valueKey}
            hasError={hasError}
            disabled={disabled}
            errorText={errorText}
            className={className}
            onChange={handleChange}
            placeholder={placeholder}
            classNameRoot={classNameRoot}
            disablePortal={disablePortal}
            disableClearable={disableClearable}
        />
    )
}

export default AutoComplete