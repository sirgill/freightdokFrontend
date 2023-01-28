import {Fragment, memo, useState} from "react";
import {FormControl, FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Tooltip} from "@mui/material";

const RadioButtonsGroupControlled = (props) => {
    const {
        name, value, handleChange, radioTitle, options = [], labelPlacement = 'end',
        className, defaultValue, disabled: alldisabled = false, displayAsRow = true, classNameGrp = ''
    } = props;

    let radios = []
    options.forEach((option, i) => {
        const {
            label = '',
            value,
            info,
            tooltipText = '',
            shouldDisplay = true,
            disabled = false,
            labelClassName = '',
            labelSx = {}
        } = option;
        if (shouldDisplay && shouldDisplay === 'function') {
            const show = shouldDisplay(props)
            if (!show) return;
        }
        radios.push(
            <Fragment key={i}>
                <Tooltip title={tooltipText} arrow>
                    <FormControlLabel
                        control={<Radio/>}
                        label={label}
                        disabled={alldisabled || disabled}
                        value={value}
                        labelPlacement={labelPlacement}
                        className={labelClassName ? `${labelClassName} ${className}` : className}
                        role='radio'
                        componentsProps={{
                            typography: {
                                sx: labelSx
                            }
                        }}
                    />
                </Tooltip>
                {info && <span className='radioInfo'>{info}</span>}
            </Fragment>
        )
    })

    return (
        <FormControl component='fieldset'>
            <FormLabel component='legend'>{radioTitle}</FormLabel>
            <RadioGroup
                aria-label={radioTitle}
                name={name}
                value={value}
                onChange={handleChange}
                row={displayAsRow}
                defaultValue={defaultValue}
                className={classNameGrp}
            >
                {radios}
            </RadioGroup>
        </FormControl>
    )
}

const RadioButtonPure = memo(RadioButtonsGroupControlled)

const RadioButtonsGroup = ({config = {}, onChange, containerSx, parentValue}) => {
    const {title, options = [], defaultValue = '', ...rest} = config;
    const [value, setValue] = useState(defaultValue);

    const handleChange = (e) => {
        const {target: {name, value, type} = {}} = e;
        setValue(value);
        if (onChange) onChange({value, name, type});
    }

    return (
        <Grid container sx={containerSx}>
            <RadioButtonPure
                handleChange={handleChange}
                value={parentValue || value}
                radioTitle={title}
                options={options}
                {...rest}
            />
        </Grid>
    )
}

export default RadioButtonsGroup