import {Route, Switch} from "react-router-dom";
import {OPEN_BOARD} from "../components/client/routes";
import LoadModuleAsync from "../components/Atoms/LoadModuleAsync";
import React, {useMemo} from "react";
import OpenBoardIcon from '../assets/icons/openBoard.svg'

import MiniDrawer from "./Navbar";

const Loads = LoadModuleAsync(() => import("../components/loads/Loads"));
const OpenBoard = LoadModuleAsync(() => import("../views/openBoard/OpenBoard.js"));

const routes = [
    {
        id: 'openBoard',
        title: 'Open Board',
        link: OPEN_BOARD,
        component: OpenBoard,
        icon: OpenBoardIcon
    }
]

const Dashboard = ({match: {path} = {}, history}) => {
    const links = useMemo(() => {
        return routes.map(route => <Route path={path + route.link} component={route.component} />)
    }, [])
    return <>
        <MiniDrawer routes={routes}>
            <Switch>
                {links}
                {/*<Route path="/loads" component={Loads}/>*/}
            </Switch>
        </MiniDrawer>
    </>
}

export default Dashboard;

// const classes = useStyles();
// const [mobileOpen, setMobileOpen] = React.useState(false);
// const goToHome = useCallback(() => {
//     history.push('/home')
// }, [])
//
// const drawer = (
//     <Fragment>
//         <div className={classes.profile}>
//             <Grid
//                 container
//                 justify="center"
//             >
//                 <Grid item xs={12}>
//                     <Typography onClick={goToHome} align='center' sx={{
//                         color: '#fff',
//                         fontWeight: 900,
//                         fontSize: 25,
//                         cursor: 'pointer'
//                     }}>freightdok</Typography>
//                 </Grid>
//             </Grid>
//         </div>
//         <List sx={{px: 3, height: 'calc(100% - 277px)', overflow: 'auto', mt: 2}}>
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("Open Load Board");
//                 // }}
//                 icon={OpenBoardIcon}
//                 primary={"Open Load Board"}
//             />
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("My Bids");
//                 // }}
//                 icon={Mybids}
//                 primary={"My Bids"}
//             />
//             <ListItemHelper
//                 // onClick={() => {
//                 //     setListBarType("My Loads");
//                 // }}
//                 icon={MyLoads}
//                 primary={"My Loads"}
//             />
//         </List>
//     </Fragment>
// );
// return <>
//     <nav className={classes.drawer} aria-label="mailbox folders">
//         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
//         <Hidden smUp implementation="css">
//             <Drawer
//                 // container={container}
//                 variant="temporary"
//                 anchor={theme.direction === "rtl" ? "right" : "left"}
//                 open={mobileOpen}
//                 // onClose={handleDrawerToggle}
//                 classes={{paper: classes.drawerPaper}}
//                 ModalProps={{
//                     keepMounted: true, // Better open performance on mobile.
//                 }}
//             >
//                 {drawer}
//             </Drawer>
//         </Hidden>
//         <Hidden xsDown implementation="css">
//             <Drawer
//                 classes={{paper: classes.drawerPaper}}
//                 variant="permanent"
//                 open
//             >
//                 {drawer}
//             </Drawer>
//         </Hidden>
//     </nav>
