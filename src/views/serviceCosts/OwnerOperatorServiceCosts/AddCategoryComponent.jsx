import {Input} from "../../../components/Atoms";
import {Box, Button, Menu, MenuItem, Typography} from "@mui/material";
import React, {memo, useCallback, useMemo, useRef, useState} from "react";
import useMutation from "../../../hooks/useMutation";
import {CREATE_ADDITIONAL_CATEGORY, REMOVE_ADDITIONAL_SERVICE_COSTS} from "../../../config/requestEndpoints";
import {notification} from "../../../actions/alert";
import {styled, alpha} from "@mui/material/styles";
import {KeyboardArrowDown} from "@mui/icons-material";
import {showDelete} from "../../../actions/component.action";

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

function CustomizedMenus({data = [], onRefetch}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const afterSuccessCb = ({success}) => {
        success && onRefetch && onRefetch()
        handleClose()
    }
    const onMenuClick = (item) => {
        showDelete({
            message: <Box>
                <Typography variant='h6'>{`Are you sure you want to delete column ${item}?`}</Typography>
                <Typography variant='subtitle2' color='text.secondary' align='center' sx={{mt: 2}}>
                    This will remove the column from every record.
                </Typography>
            </Box>,
            uri: REMOVE_ADDITIONAL_SERVICE_COSTS, afterSuccessCb,
            body: {key: item}
        })();
    }

    const menus = useMemo(() => {
        const arr = []
        data.forEach(item => {
            const {additionalCosts} = item || {};
            for(let key in additionalCosts){
                if(!arr.includes(key)){
                    arr.push(key);
                }
            }
        })
        return arr.map(item => <MenuItem key={item} onClick={onMenuClick.bind(this, item)} disableRipple>{item}</MenuItem>)
    }, [data]);

    return (
        <Box sx={{display: menus.length ? 'flex' : 'none'}}>
            <Button
                id="demo-customized-button"
                aria-controls={open ? 'demo-customized-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                variant="contained"
                disableElevation
                color='error'
                onClick={handleClick}
                endIcon={<KeyboardArrowDown />}
            >
                Delete
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {menus}
            </StyledMenu>
        </Box>
    );
}

const AddCategoryComponent = ({visible, onRefetch, data, showAlert, onCloseAlert}) => {
    const [input, setInput] = useState(''),
        ref = useRef(null);
    const {mutation, loading} = useMutation(CREATE_ADDITIONAL_CATEGORY);

    const onSubmit = useCallback((e) => {
        e.preventDefault();
        let valid = true;
        data.forEach(col => {
            const {additionalCosts} = col || {};
            if(additionalCosts.hasOwnProperty(input)){
                valid = false;
            }
        })
        if(!valid) {
            ref.current.focus();
            return showAlert({message: input + ' is already present as a Cost. Please check the Category provided.'});
        }
        mutation({category: input}, 'post')
            .then(({success, data}) => {
                onCloseAlert()
                if(success){
                    notification(data.message);
                    onRefetch();
                    setInput('');
                } else {
                    showAlert({message: data.message});
                }
            })
    }, [input, mutation, onRefetch])

    const onBlur = ({value}) => {
        setInput(value.trim());
    }

    if(!visible) {
        return null;
    }

    return <Box sx={{display: 'flex', gap: 1.5}} component='form' onSubmit={onSubmit}>
        <Input onBlur={onBlur} isCapitalize label='Add Category' value={input} onChange={({value}) => setInput(value)} inputRef={ref} />
        <Button variant='contained' type='submit' disabled={loading || input.length < 3}>{'Add'}</Button>
        <CustomizedMenus data={data} onRefetch={onRefetch}/>
    </Box>
}

export default memo(AddCategoryComponent);