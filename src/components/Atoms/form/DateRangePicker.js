import { DateRangePicker as Picker } from "react-date-range";
import moment from "moment";
import { endOfDay, startOfDay, startOfWeek, startOfMonth, startOfQuarter, startOfYear } from 'date-fns'
import 'react-date-range/dist/theme/default.css'; // theme css file
import 'react-date-range/dist/styles.css'; // main style file
import React, {Fragment, useEffect, useState} from "react";
import {
    Box,
    InputAdornment,
    IconButton,
    Popover,
    TextField
} from "@mui/material";
import { DateRange } from "@mui/icons-material";
import './dateRangePicker.css'

const staticRanges = [
    {
        label: 'Today',
        isSelected: () => false,
        range: () => ({
            startDate: startOfDay(new Date()),
            endDate: endOfDay(new Date()),
        })
    },
    {
        label: 'This Week',
        isSelected: () => false,
        range: () => ({
            startDate: startOfWeek(new Date()),
            endDate: endOfDay(new Date()),
        })
    },
    {
        label: 'This Month',
        isSelected: () => false,
        range: () => ({
            startDate: startOfMonth(new Date()),
            endDate: endOfDay(new Date()),
        })
    },
    {
        label: 'This Quarter',
        isSelected: () => false,
        range: () => ({
            startDate: startOfQuarter(new Date()),
            endDate: endOfDay(new Date()),
        })
    },
    {
        label: 'This Year',
        isSelected: () => false,
        range: () => ({
            startDate: startOfYear(new Date()),
            endDate: endOfDay(new Date()),
        })
    }
]

const getDateString = (s, e) => {
    return moment(s).format('MM/DD/YYYY') + ' - ' + moment(e).format('MM/DD/YYYY')
}

const DateRangePicker = ({ value, onChange, label, name, pickerProps={} }) => {
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const id = open && Boolean(anchorEl) ? 'transition-popper' : undefined;
    const [selectionRange, setSelectionRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    })
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date());
    const [textField, setTextField] = useState(getDateString())

    useEffect(() => {
        if(value){
            const {startDate, endDate} = value;
            setSelectionRange(value)
            setTextField(getDateString(startDate, endDate));
        }
    }, [value])

    function handleSelect(ranges) {
        const { selection: { startDate, endDate } = {} } = ranges;
        setStartDate(() => startDate)
        setEndDate(() => endDate)
        setTextField(getDateString(startDate, endDate))
        setSelectionRange({ startDate, endDate, key: 'selection' })
        if (onChange) onChange({ name, value: { startDate, endDate } })
    }


    const togglePicker = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(!open)
    }

    return (
        <Fragment>
            <TextField
                name={name}
                value={textField}
                label={label}
                size={'small'}
                InputProps={{
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle Date range picker"
                            onClick={togglePicker}
                            edge="end"
                            aria-describedby={id}
                        >
                            <DateRange />
                        </IconButton>
                    </InputAdornment>
                }}
                readOnly
            />
            <Popover id={id} open={open} anchorEl={anchorEl} onClose={togglePicker} anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}>
                <Box sx={{
                    p: 1,
                    bgcolor: 'background.paper',
                    '&.rdrStaticRangeLabel': { fontSize: "14px!important" },
                    '& .rdrDayNumber span::after': {
                        bottom: '1px !important'
                    }
                }}
                >
                    <Picker
                        ranges={[selectionRange]}
                        onChange={handleSelect}
                        className={'basePicker'}
                        staticRanges={staticRanges}
                        {...pickerProps}
                    />
                </Box>
            </Popover>
        </Fragment>
    )
}

export default DateRangePicker