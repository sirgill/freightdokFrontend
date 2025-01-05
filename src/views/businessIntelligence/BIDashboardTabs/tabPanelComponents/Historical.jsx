import {Box, Skeleton, Typography} from "@mui/material";
import Widget from "../../../../layout/Widget";
import EnhancedTable from "../../../../components/Atoms/table/Table";
import Grid2 from "@mui/material/Unstable_Grid2";
import {getPresentableDateRange} from "../../../../utils/utils";
import {useSelector} from "react-redux";
import {memo, useEffect} from "react";
import {Alert} from "../../../../components/Atoms";
import {closeBIAlert} from "../../../../actions/businessIntelligence.action";
import {BI_HISTORICAL_PERFORMANCE_ERROR} from "../../../../actions/types";

const tableConfig = {
    rowCellPadding: 'normal',
    headerCellSx: {
        fontWeight: 'none',
        color: '#606060',
        backgroundColor: 'none',
        border: 'none',
        py: 0
    },
    rowCellSx: {
        border: 'none',
        fontWeight: 'bold'
    },
    columns: [
        {
            id: 'revenue',
            label: 'Revenue',
        },
        {
            id: 'loadCount',
            label: 'Loads'
        },
        {
            id: 'miles',
            label: 'Miles'
        },{
            id: 'averageRate',
            label: 'Avg Rate',
        },
        {
            id: 'rateMile',
            label: 'Rate/Mile',
        }
    ]
}

function LoadingHistorical() {
    return <Box sx={{my: 1, width: '100%'}}>
        <Skeleton width={'100%'} animation="wave"  />
        <Skeleton width={'100%'} animation="wave"  />
    </Box>;
}

function HistoricalPerformance({dateRange, data, loading}) {
    return <Box sx={{width: '100%', border: '1px solid #e5e5e5', borderRadius: '.5rem', px: 2, pt: 1}}>
        <Typography fontWeight='bold' sx={{px: .5}}>{dateRange}</Typography>
        <Box sx={{
            '.enhanced-table': {
                '.tableContainer': {
                    boxShadow: 'none',
                    mb: 0
                }
            }
        }}>
            {loading ? <LoadingHistorical />
                : <EnhancedTable
                config={tableConfig}
                data={data}
            />}
        </Box>
    </Box>;
}

const Historical = ({fetchHistoricalTabData}) => {
    const {loading, data= [], error} = useSelector(state => state.businessIntelligence.historicalPerformance);

    useEffect(() => {
        if(!data.length){
            fetchHistoricalTabData();
        }
    }, [data]);

    const comp = data.map(item => {
        const {data, dateRange: {startDate, endDate} = {}} = item;
        return <HistoricalPerformance dateRange={getPresentableDateRange(startDate, endDate)} data={[data]} />
    }) || [];

    const loadingComp = Array.from({length: 3}, () => <LoadingHistorical />)

    return <Widget title='Historical Performance' titleSx={{fontSize: 16, mb: 2}} sx={{border: 'none'}}>
        <Alert config={error} inStyles={{m:'auto', mb:1, width: 'fit-content'}} onClose={closeBIAlert.bind(null, BI_HISTORICAL_PERFORMANCE_ERROR)} />
        <Grid2 spacing={1} container gap={1} sx={{overflow: 'auto', height: '100%', width: '100%'}}>
            {loading ? loadingComp : comp}
        </Grid2>
    </Widget>
}

export default memo(Historical);