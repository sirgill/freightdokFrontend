import {
    Backdrop,
    Box,
    Checkbox,
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
    TableRow, TableSortLabel, Typography
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
import {getUserDetail} from "../../../utils/utils";
import Tooltip from "../Tooltip";

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

function Headers({columns = [], config = {}, role, handleRequestSort, hasSort}) {
    const {headerCellSx = {}, hasDelete, sortField, sortOrder, showCheckbox} = config;
    const headers = useMemo(() => {
        return columns.map((column, index) => {
            const {label = '', id = '', visible = true, sort = false} = column || {};
            // eslint-disable-next-line array-callback-return
            const isVisible = _.isFunction(visible) ? visible({column, role}) : visible;
            if (!isVisible) {
                return null;
            }
            return (
                <Cell padding={'normal'} sx={{color: '#000', bgcolor: '#fafafa', fontWeight: 800, ...headerCellSx}}
                      key={id || index}>
                    {(hasSort && sort)
                        ? <TableSortLabel onClick={(e) => handleRequestSort(e, id)} active={id === sortField}
                                     direction={sortOrder}
                                     sx={{ ...headerCellSx}}>
                        {label}
                    </TableSortLabel>
                        : label}
                </Cell>
            )
        })
    }, [columns, headerCellSx])

    if(showCheckbox){
        headers.unshift(<Cell key='checkbox-header' padding={'normal'} sx={{color: '#000', bgcolor: '#fafafa', fontWeight: 800, ...headerCellSx}} />)
    }
    return <TableRow>
        {headers}
        {hasDelete && <Cell padding={'none'} sx={{color: '#000', bgcolor: '#fafafa', fontWeight: 800, ...headerCellSx}}/>}
    </TableRow>;
}

const getTableCell = ({
                          row = [],
                          columns = {},
                          config = {},
                          handleRowClick,
                          rowIndex,
                          handleDelete,
                          hasDeletePermission,
                          checkboxKey,
                          ...rest
                      }) => {
    const {
        hasDelete = false,
        rowCellPadding = 'none',
        onRowClick = undefined,
        rowStyleCb,
        showCheckbox = false
    } = config;
    const {role, onCheckboxChange, checkboxes} = rest;
    let rowStyle = {}
    if (rowStyleCb) {
        rowStyle = rowStyleCb({row}) || {};
    }
    const rowClickHandler = (e) => {
            e.preventDefault();
            if (_.isFunction(handleRowClick)) handleRowClick(row)
        },
        deleteCell = <Cell sx={{}} padding={'none'} component="th" scope="row">
            <Tooltip title='Delete' placement='top'>
                <IconButton onClick={handleDelete.bind(this, row._id, row)} disabled={!hasDeletePermission}>
                    <DeleteIcon color={hasDeletePermission ? 'error' : 'disabled'}/>
                </IconButton>
            </Tooltip>
        </Cell>;

    const cell = columns.map((column, i) => {
        const {id = '', renderer, emptyState = '--', valueFormatter, visible = true, cellPadding} = column || {};
        const isVisible = _.isFunction(visible) ? visible({column, role}) : visible;
        if (!isVisible) {
            return null;
        }
        let cell;
        if (valueFormatter && _.isFunction(valueFormatter)) {
            cell = valueFormatter(row[id]);
        } else if (_.isFunction(renderer)) {
            cell = renderer({row, role}, rowIndex) || emptyState;
        } else {
            cell = _.get(row, id, emptyState) || emptyState;
        }
        return <Cell key={id + i} padding={cellPadding || rowCellPadding || 'normal'} component="th" scope="row">
            {cell}
        </Cell>
    });

    if(showCheckbox){
        if(!checkboxKey){
            throw new Error('Checkbox key not provided');
        }
        const checked = checkboxes.indexOf(row[checkboxKey]) > -1;
        cell.unshift(<Cell onClick={onCheckboxChange.bind(this, row)} key={`checkbox-${rowIndex}`}>
            <Checkbox checked={checked} />
        </Cell>)
    }

    return <TableRow key={rowIndex} hover={!!onRowClick} onClick={rowClickHandler}
                     sx={!!onRowClick ? {cursor: 'pointer', ...rowStyle} : {...rowStyle}}>
        {cell}
        {hasDelete && deleteCell}
    </TableRow>;
}

const TableData = ({columns, data = [], config = {}, handleRowClick, handleDelete, ...rest}) => {

    return (data || []).map((row, index) => {
        const {dataKey = ''} = config;
        if (dataKey) {
            row = row[dataKey];
        }
        return getTableCell({row, columns, config, handleRowClick, rowIndex: index, handleDelete, ...rest})
    })
}


const EnhancedTable = ({config = {}, data = [], history, loading = false, onRefetch, isRefetching, actions, isPaginationLoading=false, ...rest}) => {
    data = data || [];
    const {onCheckboxChange, checkboxes, checkboxKey} = rest;
    const [tableState, setTableState] = useState({}),
        [dialog, setDialog] = useState({open: false, config: {}}),
        {
            columns = [],
            onRowClick,
            hasOnClickUrl = true,
            onPageChange,
            page,
            count,
            limit,
            onPageSizeChange,
            onLimitChange,
            size = 'medium',
            emptyMessage = '',
            onRowClickDataCallback,
            showRefresh = false,
            onDelete,
            deleteMessage,
            deletePermissions = [],
            containerHeight='',
            sortField,
            sortOrder = 'asc',
            handleSortChange,
            hasSort = false
        } = config,
        {role = ''} = getUserDetail().user,
        hasDeletePermission = typeof deletePermissions === 'boolean' ? deletePermissions : deletePermissions.indexOf(role) > -1 || false,
        ref = React.useRef([]);
    const length = Array.isArray(data) && data.length,
        Actions = useMemo(() => {
        if(actions && React.isValidElement(actions)){
            return actions;
        }
        return <></>
    }, [actions]);

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

    const handleRequestSort = (event, property) => {
        const isAsc = sortField === property && sortOrder === 'asc';
        // setOrder(isAsc ? 'desc' : 'asc');
        // setOrderBy(property);
        handleSortChange && handleSortChange({field: property, order: isAsc ? 'desc' : 'asc'})
    };

    const handleDelete = (id, row, e) => {
        e.stopPropagation();
        const config = {
            title: () => <Grid container alignItems='center' sx={{p: '16px 24px'}} gap={1}>
                <ErrorOutlineIcon color='error'/>
                <Typography sx={{fontSize: '1.25rem', fontWeight: 550}} color='error'>Delete</Typography>
            </Grid>,
            okText: 'Delete',
            onOk: () => onDelete(id, onDialogClose, {row}),
            content: () => <DialogContentText
                sx={{color: '#000'}}>{_.isFunction(deleteMessage) ? deleteMessage({row}) : deleteMessage || 'Are you sure you want to delete the record?'}</DialogContentText>
        }
        setDialog({...dialog, open: true, config});
    }

    function onDialogClose() {
        setDialog({...dialog, open: false})
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
        if (!length) {
            return (<tbody style={{height: 300}}>
            <tr>
                <td style={{textAlign: 'center'}}><h4>{emptyMessage || 'No records found'}</h4></td>
            </tr>
            </tbody>)
        }
        return <Fragment>
            <TableHead className={''} sx={{backgroundColor: '#fafafa', borderTop: '1px solid rgba(224, 224, 224, 1)'}}>
                <Headers columns={columns} config={config} role={role} handleRequestSort={handleRequestSort} hasSort={hasSort}/>
            </TableHead>
            <TableBody>
                <TableData
                    role={role}
                    columns={columns}
                    data={data}
                    config={config}
                    checkboxes={checkboxes}
                    checkboxKey={checkboxKey}
                    handleRowClick={handleRowClick}
                    handleDelete={handleDelete}
                    onCheckboxChange={onCheckboxChange}
                    hasDeletePermission={hasDeletePermission}
                />
            </TableBody>
        </Fragment>
    }, [data, config, checkboxes])

    useEffect(() => {
        if (ref?.current?.table) {
            const calculatedHeight = ref.current.table.offsetHeight;
            setTableState({...tableState, height: calculatedHeight > 200 ? calculatedHeight : undefined})
        }
    }, [])

    useEffect(() => {
        if((isPaginationLoading || isRefetching) && ref.current?.tableContainer){
            ref.current.tableContainer.scrollTo(0, 0)
        }
    }, [isPaginationLoading, isRefetching])

    return <Box className='enhanced-table' sx={{height: length && !loading ? (containerHeight || '95%') : 'auto'}}>
        <Stack alignItems='flex-end' justifyContent='flex-end' direction='row' py={1} gap={.5}>
            {Actions}
            {showRefresh && <IconButton title='Refresh' onClick={onRefetch}>
                <Refresh className={(isRefetching) ? 'rotateIcon' : undefined}/>
            </IconButton>}
        </Stack>
        <TableContainer
            component={Paper}
            className='tableContainer'
            ref={el => ref.current['tableContainer'] = el}
            sx={{boxShadow: '0px 0px 32px #8898AA26', mb: 2, height: length && !loading ? 'calc(100% - 80px)' : 'auto', position: 'relative'}}
        >
            {loading
                ? getLoader()
                : <Table ref={el => ref.current['table'] = el} aria-label="caption table" size={size} stickyHeader>
                    {getTableContent}
                </Table>}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, position: 'absolute' }}
                open={isPaginationLoading || isRefetching || false}
            >
                <Spinner sx={{color: 'inherit'}} />
            </Backdrop>
        </TableContainer>
        {!loading && data.length > 0 &&
            <TablePagination data={data} onPageChange={onPageChange} page={page} count={count} limit={limit} onLimitChange={onLimitChange || onPageSizeChange} isLoading={isRefetching || isPaginationLoading} />}
        <Dialog className='enhancedTable_dialog' open={dialog.open} config={dialog.config} onClose={onDialogClose}/>
    </Box>;
};

export default withRouter(memo(EnhancedTable));
