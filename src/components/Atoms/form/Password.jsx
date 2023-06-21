import { FormControl, IconButton, InputAdornment, TextField } from '@mui/material';
import React from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Password = ({ onChange, name, label = 'Password', errors = {} }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const hasError = !!errors[name],
        errorText = errors[name];

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (onChange) onChange({ name, value });
    }

    return (
        <FormControl variant="outlined" fullWidth>
            <TextField
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                label={label}
                error={hasError}
                helperText={hasError ? errorText : ''}
                size='small'
                onChange={handleChange}
                name={name}
                InputProps={{
                    endAdornment: <InputAdornment position="end" >
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                        >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>

                }}

            />
        </FormControl >
    )
}

export default Password