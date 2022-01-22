import {Delete} from '@material-ui/icons';
import {
    createTheme,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ThemeProvider
} from '@mui/material';
import _ from 'lodash';
import React, {Fragment, memo, useEffect, useMemo, useState} from 'react';
import {withRouter} from 'react-router-dom';
import TablePagination from './Pagination';
import Spinner from "../../layout/Spinner";
import load from "../../../reducers/load";

const theme = createTheme({
    typography: {
        button: {
            textTransform: 'none'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: 10,
                    minWidth: 80,
                    height: 25
                }
            }
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    "&:hover": {
                        cursor: 'pointer'
                    }
                }
            }
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '11px',
                    fontWeight: 400,
                    borderBottom: '1px solid #0000000D',
                    paddingLeft: '1rem',
                    align: 'left',
                    color: '#525F7F'
                }
            }
        }
    }
})

function Headers({columns = [], config = {}}) {
    const {headerCellSx = {}} = config;
    const headers = useMemo(() => {
        return columns.map(column => {
            const {label = '', id = '', visible = true} = column || {};
            if (!visible) return;
            return (
                <TableCell padding={'none'} sx={{color: '#8898AA',...headerCellSx}} key={id}>{label}</TableCell>
            )
        })
    }, [columns])
    return <TableRow>
        {headers}
        <TableCell padding={'none'} sx={{headerCellSx}}/>
    </TableRow>;
}

const getTableCell = ({row = [], columns = {}, config = {}, handleRowClick}) => {
    const {hasDelete = false, onDelete, hover = false, rowCellPadding = 'none'} = config;
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

    const cell = columns.map(column => {
        const {id = '', renderer} = column || {};
        let cell;
        if (_.isFunction(renderer)) {
            cell = renderer({row});
        } else {
            cell = row[id]
        }
        return <TableCell key={id} padding={rowCellPadding} component="th" scope="row">
            {cell}
        </TableCell>
    });

    return <TableRow hover={hover} onClick={rowClickHandler}>
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
            history.push(url);
        } else if (onRowClick) {
            onRowClick(row)
        }
    }

    const getLoader = () => {
        return <Grid container alignItem={'center'} justifyContent='center' sx={{height: tableState.height || 300}}>
            <Grid item alignItems='center' sx={{position: 'relative'}}>
                <Spinner/>
            </Grid>
        </Grid>
    }
    const getTableContent = useMemo(() => {
        const length = Array.isArray(data) && data.length;
        if (!length) {
            return <h4>{emptyMessage || 'No records found'}</h4>
        }
        return <Fragment>
            <TableHead className={''} sx={{backgroundColor: '#F6F9FC ', borderTop: '1px solid rgba(224, 224, 224, 1)'}}>
                <Headers columns={columns} config={config}/>
            </TableHead>
            <TableBody>
                <TableData
                    columns={columns}
                    data={data}
                    config={config}
                    handleRowClick={handleRowClick}
                />
            </TableBody>
        </Fragment>
    }, [data, config])

    useEffect(() => {
        if (ref?.current?.table){
            const calculatedHeight = ref.current.table.offsetHeight;
            setTableState({...tableState, height: calculatedHeight})
        }
    }, [])

    return <div>
        <ThemeProvider theme={theme}>
            <TableContainer
                component={Paper}
                className={''}
                sx={{boxShadow: '0px 0px 32px #8898AA26', mb:2}}
            >
                <Table ref={el => ref.current['table'] = el} borderBottom="none" aria-label="caption table">
                    {loading ? getLoader() : getTableContent}
                </Table>
                {!loading &&
                <TablePagination data={data} onPageChange={onPageChange} page={page} count={count} limit={limit}/>}
            </TableContainer>
        </ThemeProvider>
    </div>;
};

export default memo(withRouter(EnhancedTable));
