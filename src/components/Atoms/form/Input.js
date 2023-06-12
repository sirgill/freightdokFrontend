import React, {memo} from 'react'
import _ from 'lodash';
import {FormControl, TextField} from "@mui/material";

const InputFieldPure = ({
                            errorText,
                            handleBlur,
                            handleChange,
                            hasError,
                            className,
                            name,
                            value,
                            InputProps,
                            readOnly,
                            inputProps,
                            ...rest
                        }) => {
    return <FormControl component=''>
        <TextField
            name={name}
            error={hasError}
            onChange={handleChange}
            onBlur={handleBlur}
            className={className}
            InputProps={{
                className: '',
                ...InputProps
            }}
            size='small'
            inputProps={{readOnly, ...inputProps}}
            {...rest}
        />
    </FormControl>
}

const InputField = memo(InputFieldPure)

const Input = (props) => {
    const {
        label, name, errors = {}, onChange, value, className, classNameRoot, isCapitalize = false, inputProps = {},
        type = 'text', onBlur, InputProps, readOnly, ...rest
    } = props;
    const hasError = errors[name] || false,
        errorText = errors[name]

    const handleChange = (e) => {
        let {name, value} = e.target;
        if (isCapitalize) {
            value = value.capitalize()
        }
        if (onChange) onChange({name, value});
    }

    const handleBlur = (e) => {
        const {name, value} = e.target
        if (type === 'number') {
            const {max, min} = inputProps;
            if (max && value > max) {
                _.isFunction(onChange) && onChange({name, value: max})
            } else if (max && value < min) {
                _.isFunction(onChange) && onChange({name, value: min})
            }
        }
        if (onBlur) onBlur({name, value})
    }

    return (
        <InputField
            value={value}
            name={name}
            label={label}
            hasError={hasError}
            errorText={errorText}
            handleChange={handleChange}
            handleBlur={handleBlur}
            className={className}
            InputProps={InputProps}
            inputProps={inputProps}
            readOnly={readOnly}
            type={type}
            {...rest}
        />
    )

}

export default Input;