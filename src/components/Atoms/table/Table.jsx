import {
    DialogContentText,
    Grid,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, Typography
} from '@mui/material';
import _ from 'lodash';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import React, {Fragment, memo, useEffect, useMemo, useState} from 'react';
import {withRouter} from 'react-router-dom';
import TablePagination from './Pagination';
import Spinner from "../../layout/Spinner";
import {Delete, Refresh} from "@mui/icons-material";
import Dialog from "../Dialog";
import {styled} from "@mui/material/styles";

const Cell = styled(TableCell)(({theme}) => ({
    [theme.breakpoints.down('xs')]: {
        fontSize: 12,
        padding: '0 8px',
    }
}))
const DeleteIcon = styled(Delete)(({theme}) => ({
    [theme.breakpoints.down('xs')]: {
        fontSize: 14,
    }
}))

function Headers({columns = [], config = {}}) {
    const {headerCellSx = {}, hasDelete} = config;
    const headers = useMemo(() => {
        return columns.map((column, index) => {
            const {label = '', id = '', visible = true} = column || {};
            // eslint-disable-next-line array-callback-return
            if (!visible) return;
            return (
                    <Cell padding={'normal'} sx={{color: '#000', fontWeight: 800, ...headerCellSx}}
                           key={id || index}>{label}</Cell>
            )
        })
    }, [columns, headerCellSx])
    return <TableRow>
        {headers}
        {hasDelete && <Cell padding={'none'} sx={{headerCellSx}}/>}
    </TableRow>;
}

const getTableCell = ({row = [], columns = {}, config = {}, handleRowClick, rowIndex, handleDelete}) => {
    const {
        hasDelete = false,
        hover = false,
        rowCellPadding = 'none',
        onRowClick = undefined,
        rowStyleCb
    } = config;
    let rowStyle = {}
    if (rowStyleCb) {
        rowStyle = rowStyleCb({row}) || {};
    }
    const rowClickHandler = (e) => {
            e.preventDefault();
            if (_.isFunction(handleRowClick)) handleRowClick(row)
        },
        deleteCell = <Cell sx={{}} padding={'none'} component="th" scope="row">
            <IconButton onClick={handleDelete.bind(this, row._id, row)}>
                <DeleteIcon sx={{color: "rgb(220, 0, 78)"}}/>
            </IconButton>
        </Cell>;

    const cell = columns.map((column, i) => {
        const {id = '', renderer, emptyState = '', valueFormatter} = column || {};
        let cell;
        if(valueFormatter && _.isFunction(valueFormatter)){
            cell = valueFormatter(row[id]);
        }
        else if (_.isFunction(renderer)) {
            cell = renderer({row}, rowIndex) || emptyState;
        } else {
            cell = row[id] || emptyState;
        }
        return <Cell key={id + i} padding={rowCellPadding} component="th" scope="row">
            {cell}
        </Cell>
    });

    return <TableRow key={rowIndex} hover={!!onRowClick} onClick={rowClickHandler}
                     sx={!!onRowClick ? {cursor: 'pointer', ...rowStyle} : {}}>
        {cell}
        {hasDelete && deleteCell}
    </TableRow>;
}

const TableData = ({columns, data = [], config = {}, handleRowClick, handleDelete}) => {

    return (data || []).map((row, index) => {
        const {dataKey = ''} = config;
        if (dataKey) {
            row = row[dataKey];
        }
        return getTableCell({row, columns, config, handleRowClick, rowIndex: index, handleDelete})
    })
}


const EnhancedTable = ({config = {}, data = [], history, loading = false, onRefetch}) => {
    data = data || [];
    const [tableState, setTableState] = useState({}),
        [dialog, setDialog] = useState({ open: false, config: {} }),
        {
            columns = [],
            onRowClick,
            hasOnClickUrl = true,
            onPageChange,
            page,
            count,
            limit,
            emptyMessage = '',
            onRowClickDataCallback,
            showRefresh = false,
            onDelete,
            deleteMessage
        } = config,
        ref = React.useRef([]);

    const handleRowClick = (row) => {
        if (hasOnClickUrl && onRowClick) {
            const url = onRowClick(row);
            if (onRowClickDataCallback) {
                row = onRowClickDataCallback(row)
            }
            history.push(url, row);
        } else if (onRowClick) {
            onRowClick(row)
        }
    }

    const handleDelete = (id, row, e) => {
        e.stopPropagation();
        const config = {
            title: () => <Grid container alignItems='center' sx={{ p: '16px 24px' }} gap={1}>
                <ErrorOutlineIcon color='error' />
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 550 }} color='error'>Delete</Typography>
            </Grid>,
            okText: 'Delete',
            onOk: () => onDelete(id, onDialogClose),
            content: () => <DialogContentText sx={{color: '#000'}}>{deleteMessage || 'Are you sure you want to delete the record?'}</DialogContentText>
        }
        setDialog({ ...dialog, open: true, config });
    }

    function onDialogClose() {
        setDialog({ ...dialog, open: false })
    }

    const getLoader = () => {
        const innerHeight = window.innerHeight - 180,
            height = (tableState.height ? tableState.height > innerHeight ? innerHeight : tableState.height : innerHeight) || innerHeight;
        return <Grid container alignItems={'center'} justifyContent='center' sx={{height}}>
            <Grid item alignItems='center' sx={{position: 'relative'}}>
                <Spinner/>
            </Grid>
        </Grid>
    }
    const getTableContent = useMemo(() => {
        const length = Array.isArray(data) && data.length;
        if (!length) {
            return (<tbody style={{height: 300}}>
            <tr>
                <td style={{textAlign: 'center'}}><h4>{emptyMessage || 'No records found'}</h4></td>
            </tr>
            </tbody>)
        }
        return <Fragment>
            <TableHead className={''} sx={{backgroundColor: '#fafafa', borderTop: '1px solid rgba(224, 224, 224, 1)'}}>
                <Headers columns={columns} config={config}/>
            </TableHead>
            <TableBody>
                <TableData
                    key={Date.now()}
                    columns={columns}
                    data={data}
                    config={config}
                    handleRowClick={handleRowClick}
                    handleDelete={handleDelete}
                />
            </TableBody>
        </Fragment>
    }, [data, config])

    useEffect(() => {
        if (ref?.current?.table) {
            const calculatedHeight = ref.current.table.offsetHeight;
            setTableState({...tableState, height: calculatedHeight > 200 ? calculatedHeight : undefined})
        }
    }, [])

    return <div>
        {showRefresh && <Stack alignItems='flex-end'>
            <IconButton title='Refresh' onClick={onRefetch}>
                <Refresh className={loading ? 'rotateIcon' : undefined}/>
            </IconButton>
        </Stack>}
        <TableContainer
            component={Paper}
            className={''}
            sx={{boxShadow: '0px 0px 32px #8898AA26', mb: 2}}
        >
            {loading
                ? getLoader()
                : <Table ref={el => ref.current['table'] = el} aria-label="caption table">
                    {getTableContent}
                </Table>}
            {!loading && data.length > 0 &&
                <TablePagination data={data} onPageChange={onPageChange} page={page} count={count} limit={limit}/>}
        </TableContainer>
        <Dialog className='enhancedTable_dialog' open={dialog.open} config={dialog.config} onClose={onDialogClose} />
    </div>;
};

export default memo(withRouter(EnhancedTable));
