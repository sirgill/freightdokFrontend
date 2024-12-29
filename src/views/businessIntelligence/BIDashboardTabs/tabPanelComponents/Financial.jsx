import {Box, Typography} from "@mui/material";
import Widget from "../../../../layout/Widget";
import Grid2 from "@mui/material/Unstable_Grid2";
import {getDollarPrefixedPrice} from "../../../../utils/utils";


function Expense({value, expenseName, isExpense, isNetExpense, containerSx={}}) {
    return <Grid2 container sx={{borderTop: isNetExpense ? '1px solid #e3e3e3' : 'none', mt: isNetExpense ? 2 : 0, ...containerSx}}>
        <Grid2 flex={1} p={2}>
            <Typography variant='body1' fontWeight={isNetExpense?'bold': 'normal'}>{expenseName}</Typography>
        </Grid2>
        <Grid2 p={2}>
            <Typography sx={{fontWeight: 'bold', fontSize: '1.2rem'}} color={isNetExpense ? 'success' : (isExpense ? 'error' : 'inherit')}>
                {value ? getDollarPrefixedPrice(value, isExpense) : '--'}
            </Typography>
        </Grid2>
    </Grid2>;
}

const Financial = ({presentableDateRange}) => {
    return <Box>
        <Widget title={presentableDateRange} variant={'elevation'} titleSx={{mb: 2}}>
            <Box p={1}>
                <Expense expenseName='Total Revenue' value={3765} containerSx={{bgcolor: '#f9fafb'}}/>
                <Expense expenseName='Dispatch Fee (8%)' isExpense value={301}/>
                <Expense expenseName='EFS Advances' isExpense value={8} containerSx={{bgcolor: '#f9fafb'}}/>
                <Expense expenseName='Net Settlement' isNetExpense value={3455}/>
            </Box>
        </Widget>
    </Box>
}

export default Financial;