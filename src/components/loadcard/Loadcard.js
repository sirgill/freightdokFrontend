import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CurrentDayLoads  from '../loads/CurrentDayLoads';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import ArrowForwardRoundedIcon from '@material-ui/icons/ArrowForwardRounded';


import theme from "../layout/ui/Theme";

const useStyles = makeStyles((theme) => ({

  root: {
    display: 'flex',
    minWidth: 200,
    maxWidth: 350
 },

}));


export const Loadcard = props => {
  const classes = useStyles();
  const theme = useTheme();


  return (


          <CurrentDayLoads />

    
  )
}
