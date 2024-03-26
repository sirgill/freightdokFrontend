import {Tooltip} from "../components/Atoms";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import List from "@mui/material/List";
import * as React from "react";
import {useMemo} from "react";
import {NavLink, withRouter} from "react-router-dom";
import styled from "@mui/material/styles/styled";

const LinkComponent = styled(NavLink)(() => ({
    color: '#000',
    '&:hover': {
        textDecoration: 'none',
        color: '#000'
    }
}))

const NavLinks = ({open, config: routes = [], basePath, ...rest}) => {
    const {location} = rest;

    const links = useMemo(() => {
        return routes.map(route => {
            const {id, title, icon: Icon} = route;
            const url = basePath + `/${id}`;
            const isSelected = location.pathname.includes(url)
            return <Tooltip key={id} title={!open ? title : undefined} sx={{fontSize: '1em'}}>
                    <ListItemButton
                        sx={{
                            minHeight: 48,
                            justifyContent: open ? 'initial' : 'center',
                            px: 2.5,
                            '&.active': {background: ''}
                        }}
                        component={LinkComponent}
                        to={url}
                        selected={isSelected}
                        isActive={(match, location) => {
                            if (!match) {
                                return false;
                            }
                            if(match.url === location.pathname){
                                document.title = 'freightdok: ' + title;
                            }

                            // only consider an event active if its event id is an odd number
                            const eventID = parseInt(match.params.eventID);
                            return !isNaN(eventID) && eventID % 2 === 1;
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                minWidth: 0,
                                mr: open ? 3 : 'auto',
                                justifyContent: 'center',
                            }}
                        >
                            <img src={Icon} alt={title}/>
                        </ListItemIcon>
                        <ListItemText sx={{opacity: open ? 1 : 0}} primary={title} />
                </ListItemButton>
            </Tooltip>
        })
    }, [routes, location, basePath, open]);

    return <List>
        {links}
    </List>
}

export default withRouter(NavLinks);