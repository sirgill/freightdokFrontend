import {Avatar, Box, IconButton, Menu, MenuItem, Typography} from "@mui/material";
import {Tooltip} from "./index";
import React, {memo} from 'react'
import {getUserDetail} from "../../utils/utils";
import {logout} from "../../actions/auth";
import {useDispatch} from "react-redux";
import {withRouter} from "react-router-dom";
import {LOGIN_LINK} from "../constants";

function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(name) {
    let userName = ''
    if(!!name.split(' ')[0]){
        userName = (name.split(' ')[0][0])
    }
    if(!!name.split(' ') && name.split(' ')[1]){
        userName += (name.split(' ')[1][0]);
    }
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: userName
    };
}

const UserMenu = ({history}) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const {user: {name = ''} = {}} = getUserDetail();
    const dispatch = useDispatch();
    const settings = [{title: 'Logout', onClick: onLogout}];

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = (callback) => {
        setAnchorElUser(null);
        if(typeof callback === 'function') callback();
    };

    function onLogout() {
        dispatch(logout);
        history.replace(LOGIN_LINK);
    }

    return <Box>
        <Tooltip title="Open settings" placement='bottom'>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar {...stringAvatar(name||'')} />
            </IconButton>
        </Tooltip>
        <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu.bind(null)}
        >
            {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={handleCloseUserMenu.bind(null, setting.onClick)}>
                    <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
            ))}
        </Menu>
    </Box>
}

export default withRouter(memo(UserMenu, () => true))