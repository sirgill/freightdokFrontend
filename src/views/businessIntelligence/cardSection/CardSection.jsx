import {Box, Grid, Paper, Skeleton, Typography} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import {PRIMARY_BLUE, SUCCESS_COLOR} from "../../../components/layout/ui/Theme";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import React from "react";

const Card = ({icon: Icon, title, loading = false, value = '$45,000'}) => {
    return <Grid container sx={{p: 2, borderRadius: 4, width: 'fit-content', boxShadow: '0px 0px 32px #8898AA26'}} component={Paper} elevation={0}>
        <Grid item sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} xs={12}>
            {loading ? <Skeleton animation="wave" sx={{width: '100%', mr: 2}} /> : <Typography variant='body1' color='#787878'>{title}</Typography>}
            {loading ? <Skeleton animation="wave" width={20} height={16} variant="circular" /> : Icon}
        </Grid>
        <Grid item>
            {loading ? <Skeleton animation="wave" sx={{width: '100%', minWidth: 130}} /> : <Typography fontWeight='bold' variant='h5'>{value}</Typography>}
        </Grid>
    </Grid>
}

const OwnerOperatorCardsConfig = [
    {title: 'Revenue', icon: AttachMoneyIcon, iconStyles: {color: SUCCESS_COLOR} },
    {title: 'Loads', icon: LocalShippingOutlinedIcon, iconStyles: {color: PRIMARY_BLUE}},
    {title: 'Average Rate', icon: TrendingUpOutlinedIcon, iconStyles: {color: 'violet'}},
    {title: 'Total Miles', icon: MapOutlinedIcon, iconStyles: {color: 'orange'}},
    {title: 'Rate per Mile', icon: CalendarTodayOutlinedIcon, iconStyles: {color: 'darkturquoise'}},
]

const CardSection = () => {
    const cards = OwnerOperatorCardsConfig.map(config => {
        const Icon = config.icon,
            iconStyles = config.iconStyles || {}
        return <Card title={config.title} key={config.title} icon={<Icon sx={iconStyles} />} />
    })
    return <Box sx={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
        {cards}
    </Box>
}

export default CardSection