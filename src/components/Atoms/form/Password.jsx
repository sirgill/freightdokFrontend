import {FormControl, IconButton, InputAdornment, TextField} from '@mui/material';
import React from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PropTypes from "prop-types";

const Password = ({onChange, name, label = 'Password', value, errors = {}, startAdornment, ...rest}) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!errors[name],
        errorText = errors[name];

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (onChange) onChange({name, value});
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <TextField
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                label={label}
                value={value}
                error={hasError}
                helperText={hasError ? errorText : ''}
                size='small'
                onChange={handleChange}
                name={name}
                InputProps={{
                    startAdornment,
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>

                }}
                {...rest}
            />
        </FormControl>
    )
}

Password.proptype = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Password