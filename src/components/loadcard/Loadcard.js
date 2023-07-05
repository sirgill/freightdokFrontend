import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CurrentDayLoads  from '../loads/CurrentDayLoads';

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
