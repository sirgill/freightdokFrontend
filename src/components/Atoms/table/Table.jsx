import {Delete} from '@material-ui/icons';
import {
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import _ from 'lodash';
import React, {Fragment, memo, useEffect, useMemo, useState} from 'react';
import {withRouter} from 'react-router-dom';
import TablePagination from './Pagination';
import Spinner from "../../layout/Spinner";

function Headers({columns = [], config = {}}) {
    const {headerCellSx = {}, hasDelete} = config;
    const headers = useMemo(() => {
        return columns.map(column => {
            const {label = '', id = '', visible = true} = column || {};
            if (!visible) return;
            return (
                <TableCell padding={'normal'} sx={{color: '#000', fontWeight: 800, ...headerCellSx}} key={id}>{label}</TableCell>
            )
        })
    }, [columns])
    return <TableRow>
        {headers}
        {hasDelete && <TableCell padding={'none'} sx={{headerCellSx}}/>}
    </TableRow>;
}

const getTableCell = ({row = [], columns = {}, config = {}, handleRowClick}) => {
    const {hasDelete = false, onDelete, hover = false, rowCellPadding = 'none', onRowClick = undefined} = config;
    const handleDelete = (id, e) => {
            e.stopPropagation();
            return onDelete(id, row);
        },
        rowClickHandler = (e) => {
            e.preventDefault();
            if (_.isFunction(handleRowClick)) handleRowClick(row)
        },
        deleteCell = <TableCell sx={{}} padding={'none'} component="th" scope="row">
            <IconButton onClick={handleDelete.bind(this, row._id)}>
                <Delete style={{color: "rgb(220, 0, 78)"}}/>
            </IconButton>
        </TableCell>;

    const cell = columns.map((column, i) => {
        const {id = '', renderer} = column || {};
        let cell;
        if (_.isFunction(renderer)) {
            cell = renderer({row});
        } else {
            cell = row[id]
        }
        return <TableCell key={id + i} padding={rowCellPadding} component="th" scope="row">
            {cell}
        </TableCell>
    });

    return <TableRow hover={!!onRowClick} onClick={rowClickHandler} sx={!!onRowClick ? {cursor: 'pointer'} : {}}>
        {cell}
        {hasDelete && deleteCell}
    </TableRow>;
}

const TableData = ({columns, data = [], config = {}, handleRowClick}) => {

    const rows = data.map(row => {
        return getTableCell({row, columns, config, handleRowClick})
    });

    return rows
}


const EnhancedTable = ({config = {}, data = [], history, loading = false}) => {
    const [tableState, setTableState] = useState({}),
        {columns = [], onRowClick, hasOnClickUrl = true, onPageChange, page, count, limit, emptyMessage = ''} = config,
        ref = React.useRef([]);

    const handleRowClick = (row) => {
        if (hasOnClickUrl && onRowClick) {
            const url = onRowClick(row);
            history.push(url, row);
        } else if (onRowClick) {
            onRowClick(row)
        }
    }

    const getLoader = () => {
        return <Grid container alignItem={'center'} justifyContent='center'
                     sx={{height: tableState.height || window.innerHeight - 180}}>
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
        <TableContainer
            component={Paper}
            className={''}
            sx={{boxShadow: '0px 0px 32px #8898AA26', mb: 2}}
        >
            {loading
                ? getLoader()
                : <Table ref={el => ref.current['table'] = el} borderBottom="none" aria-label="caption table">
                    {getTableContent}
                </Table>}
            {!loading && data.length > 0 &&
            <TablePagination data={data} onPageChange={onPageChange} page={page} count={count} limit={limit}/>}
        </TableContainer>
    </div>;
};

export default memo(withRouter(EnhancedTable));
