import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CompanyText from "../components/Atoms/CompanyText";
import BackgroundImage from '../assets/images/ProfileBackground.png'
import NavLinks from "./NavLinks";
import {Tooltip, UserMenu} from "../components/Atoms";
import {useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {useEffect} from "react";

const drawerWidth = 240;

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => {
    return {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }
});

const Drawer = styled(MuiDrawer, {shouldForwardProp: (prop) => prop !== 'open'})(
    ({theme, open}) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const Title = ({routes, basePath}) => {
    const {title = 'Dashboard'} = routes.find(route => window.location.pathname.includes(basePath + `/${route.id}`)) || ''
    return title;
}

function MiniDrawer({children, routes = [], basePath}) {
    const [open, setOpen] = React.useState(true);
    const theme = useTheme();
    const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'));

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (isSmallDevice && open) {
            setOpen(false)
        }
    }, [isSmallDevice])


    return (
        <Box sx={{display: 'flex', height: 'inherit'}} className='sidebar-container'>
            <CssBaseline/>
            <AppBar position="fixed" open={open}>
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex' }, alignItems: 'center' }}>
                        <Tooltip title={open ? 'Minimize Sidebar' : 'Maximize Sidebar'} placement='bottom'>
                            <IconButton
                                color="primary"
                                aria-label="open drawer"
                                onClick={open ? handleDrawerClose : handleDrawerOpen}
                                edge="start"
                                sx={{
                                    marginRight: 3,
                                }}
                            >
                                {open ? <ChevronLeftIcon/> : <MenuIcon/>}
                            </IconButton>
                        </Tooltip>
                        <Typography variant="h6" noWrap component="div" color='text.primary' fontWeight='bold'>
                            <Title routes={routes} basePath={basePath}/>
                        </Typography>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <UserMenu />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open} PaperProps={{sx: {
                overflow: 'hidden'
                }}}>
                <Box sx={{height: 277, background: `url(${BackgroundImage})`}}>
                    <CompanyText
                        style={{
                            color: '#fff',
                            fontWeight: 900,
                            fontSize: 25,
                            cursor: 'pointer',
                            padding: 3,
                        }}
                        onClick={() => {
                        }}
                    />
                </Box>
                <Box sx={{overflow: 'hidden', overflowY: 'auto', height: `calc(100% - ${277}px)`}}>
                    <NavLinks open={open} config={routes} basePath={basePath} />
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <DrawerHeader/>
                {children}
            </Box>
        </Box>
    );
}

export default (MiniDrawer);