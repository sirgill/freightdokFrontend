import {Box, Skeleton, Typography} from "@mui/material";
import Widget from "../../../../layout/Widget";
import Grid2 from "@mui/material/Unstable_Grid2";
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {Alert} from "../../../../components/Atoms";
import {closeBIAlert} from "../../../../actions/businessIntelligence.action";
import {BI_FINANCIAL_ERROR} from "../../../../actions/types";


function Expense({loading, value, expenseName, isExpense, isNetExpense, containerSx={}}) {
    return <Grid2 container sx={{borderTop: isNetExpense ? '1px solid #e3e3e3' : 'none', mt: isNetExpense ? 2 : 0, ...containerSx}}>
        <Grid2 flex={1} p={2}>
            {loading ? <Skeleton animation="wave" sx={{width: '100%', mr: 2}} /> : <Typography variant='body1' fontWeight={isNetExpense ? 'bold' : 'normal'}>{expenseName}</Typography>}
        </Grid2>
        <Grid2 p={2}>
            {loading ? <Skeleton animation="wave" sx={{width: '100%', mr: 2}} /> : <Typography sx={{fontWeight: 'bold', fontSize: '1.2rem'}}
                         color={isNetExpense ? 'success' : (isExpense ? 'error' : 'inherit')}>
                {value || '--'}
            </Typography>}
        </Grid2>
    </Grid2>;
}

const Financial = ({presentableDateRange, getFinancialsTabData}) => {
    const {loading, data= {}, error} = useSelector(state => state.businessIntelligence.financials);
    const {efsAdvances, revenue, lease = '--', net, leaseCost} = data;

    useEffect(() => {
        getFinancialsTabData();
    }, []);


    return <Box>
        <Widget title={presentableDateRange} variant={'elevation'} titleSx={{mb: 2}}>
            <Box p={1}>
            <Alert config={error} inStyles={{m: 'auto', mb: 1, width: 'fit-content'}} onClose={closeBIAlert.bind(null, BI_FINANCIAL_ERROR)}/>
                <Expense loading={loading} expenseName='Total Revenue' value={revenue} containerSx={{bgcolor: '#f9fafb'}}/>
                <Expense loading={loading} expenseName={`Dispatch Fee (${lease}%)`} isExpense value={leaseCost}/>
                <Expense loading={loading} expenseName='EFS Advances' isExpense value={efsAdvances} containerSx={{bgcolor: '#f9fafb'}}/>
                <Expense loading={loading} expenseName='Net Settlement' isNetExpense value={net}/>
            </Box>
        </Widget>
    </Box>
}

export default Financial;