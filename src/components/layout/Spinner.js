import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {Box} from "@mui/material";


export default function CircularIndeterminate() {
  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '& > * + *': {
        marginLeft: 2,
      },
    }}>
      <CircularProgress />
    </Box>
  );
}
