import {Box, Skeleton, Typography} from "@mui/material";
import Widget from "../../../../layout/Widget";
import EnhancedTable from "../../../../components/Atoms/table/Table";
import Grid2 from "@mui/material/Unstable_Grid2";
import moment from "moment/moment";
import {getPresentableDateRange} from "../../../../utils/utils";
import {useDispatch, useSelector} from "react-redux";
import {memo, useEffect} from "react";
import {getHistoricalPerformance} from "../../../../actions/businessIntelligence.action";

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
    return <Box sx={{width: '100%', border: '1px solid #e5e5e5', borderRadius: '.5rem', px: 2, pt: .5}}>
        <Typography fontWeight='bold' sx={{px: .5}}>{dateRange}</Typography>
        <Box sx={{
            '.enhanced-table': {
                '.tableContainer': {
                    boxShadow: 'none',
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

const Historical = () => {
    const startDate = moment().subtract(1, 'weeks').startOf('week');
    const endDate = moment().subtract(1, 'weeks').endOf('week')

    const startDate_2 = moment().subtract(2, 'weeks').startOf('week')
    const endDate_2 = moment().subtract(2, 'weeks').endOf('week')

    const startDate_3 = moment().subtract(3, 'weeks').startOf('week');
    const endDate_3 = moment().subtract(2, 'weeks').endOf('week')

    const dispatch = useDispatch();
    const {loading, data= []} = useSelector(state => state.businessIntelligence.historicalPerformance);

    useEffect(() => {
        if(!data.length){
            dispatch(getHistoricalPerformance([
                {startDate, endDate},
                {startDate: startDate_2, endDate: endDate_2},
                {startDate: startDate_3, endDate: endDate_3}
            ]))
        }
    }, [data]);

    const comp = data.map(item => {
        const {data, dateRange: {startDate, endDate} = {}} = item;
        return <HistoricalPerformance dateRange={getPresentableDateRange(startDate, endDate)} data={[data]} />
    }) || [];

    const loadingComp = Array.from({length: 3}, () => <LoadingHistorical />)

    return <Widget title='Historical Performance' titleSx={{fontSize: 16, mb: 2}} sx={{border: 'none'}}>
        <Grid2 spacing={1} container gap={1} sx={{overflow: 'auto', height: '100%', width: '100%'}}>
            {loading ? loadingComp : comp}
        </Grid2>
    </Widget>
}

export default memo(Historical);