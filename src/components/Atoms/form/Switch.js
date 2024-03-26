import React from 'react';
import {FormControl, FormControlLabel, Switch as MuiSwitch} from "@mui/material";
import {styled} from "@mui/material/styles";

const SwitchStyled = styled(MuiSwitch)(({theme}) => ({
        width: 50,
        height: 27,
        padding: 7,
        '& .MuiSwitch-switchBase': {

        },
        '& .MuiSwitch-thumb': {
            width: 20,
            height: 20,
            '&:before': {

            }
        },
        '&.MuiSwitch-track': {

        }
    })
)

const Switch = ({label, name, placement = 'start', value, onChange, disabled, sx, shouldDisplay = true}) => {
    const handleChange = (e) => {
        const {name, checked} = e.target;
        if (onChange) onChange({name, value: checked});
    }

    return <FormControl component='fieldset' sx={{display: shouldDisplay ? 'inline' : 'none', ...sx}}>
        <FormControlLabel
            control={<SwitchStyled
                color={'primary'}
                onChange={handleChange}
                checked={!!value}
                name={name}
            />}
            label={label}
            labelPlacement={placement}
            disabled={disabled}
        />
    </FormControl>
}

export default Switch;