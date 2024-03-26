import {useEffect, useRef, useState} from "react";
import {FormControl, FormHelperText, FormLabel, Grid, TextField} from "@mui/material";

const OTPInput = ({length = 6, onChange, name, errors={}}) => {
    const [otp, setOtp] = useState(new Array(length).fill(''));
    const refs = useRef([]),
        errorText = errors[name];

    const handleChange = (index, e) => {
        const {value} = e.target;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);
        if(newOtp.join('').length === length){
            onChange && onChange({value: newOtp.join(''), name})
        }
        //if next element exists then focus it.
        if (newOtp[index] && index <= length-1 && refs.current[+index + 1]) {
            const nextField = refs.current[+index + 1]
            nextField && nextField.focus();
        }
        //if prev element exists focus on it.
        else if(!newOtp[index]) {
            if(index === 0){
                return refs.current[0].focus()
            }
            const prevField = refs.current[+index - 1];
            prevField && prevField.focus();
        }
    }


    const onClick = (index) => {
        refs.current[index].setSelectionRange(1,1)
    }

    useEffect(() => {
        if (refs.current[0]) {
            refs.current[0].focus()
        }
    }, [])

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && index > 0 && !otp[index]) {
            const prevField = refs.current[index - 1];
            prevField && prevField.focus();
        }
    };

    return <FormControl aria-autocomplete='none'>
        <FormLabel error={!!errorText} sx={{fontSize: 14}}>OTP</FormLabel>
        <Grid container width={'100%'} spacing={1}>
            {otp.map((value, index) => {
                return <Grid item xs={12 / length}>
                    <TextField
                        key={`${index}`}
                        onClick={onClick.bind(this, index)}
                        inputRef={ref => refs.current[index] = ref}
                        value={value}
                        onChange={handleChange.bind(this, index)}
                        autoComplete='false'
                        size='small'
                        error={!!errorText}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        sx={{
                            '.MuiInputBase-root': {
                                width: 37
                            }
                        }}
                    />
                </Grid>
            })}
        </Grid>
        {errorText && <FormHelperText error={!!errorText}>{errorText}</FormHelperText>}
    </FormControl>
}

export default OTPInput;