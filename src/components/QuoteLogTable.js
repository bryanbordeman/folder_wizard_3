import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { visuallyHidden } from '@mui/utils';
import QuoteDataService from '../services/Quote.services';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import ArchiveSwitch from './ArchiveSwitch';
import moment from 'moment';
import { Stack } from '@mui/system';
import QuoteLogMenu from './QuoteLogMenu';

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
    }

    function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }

    // This method is created for cross-browser compatibility, if you don't
    // need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) {
            return order;
            }
            return a[1] - b[1];
        });
    return stabilizedThis.map((el) => el[0]);
};


    const headCells = [
        {
            id: 'number',
            numeric: false,
            disablePadding: true,
            label: 'Quote Number',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
        },
        {
            id: 'due',
            numeric: true,
            disablePadding: false,
            label: 'Due Date',
        },
        {
            id: 'project_category',
            numeric: false,
            disablePadding: false,
            label: 'Category',
        },
        {
            id: 'project_type',
            numeric: false,
            disablePadding: false,
            label: 'Type',
        },
        {
            id: 'manager',
            numeric: false,
            disablePadding: false,
            label: 'Manager',
        },
    ];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };


    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                {/* <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{
                    'aria-label': 'select all desserts',
                    }}
                /> */}
                </TableCell>
                {headCells.map((headCell) => (
                <TableCell
                    sx={{whiteSpace: 'nowrap'}}
                    key={headCell.id}
                    align={'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                    sortDirection={orderBy === headCell.id ? order : false}
                >
                    <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={createSortHandler(headCell.id)}
                    >
                    {headCell.label}
                    {orderBy === headCell.id ? (
                        <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                        </Box>
                    ) : null}
                    </TableSortLabel>
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

    EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    const { archive, setArchive, toggleArchive } = props

    return (
        <Toolbar
        sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
            bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
        }}
        >
        {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
                >
                {numSelected} selected
            </Typography>
        ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
                >
                {archive? 'Archived' : 'Active'} Quotes
            </Typography>
        )}
        {numSelected > 0 ? (
            <Tooltip title="Archive">
                    {archive? 
                    <Stack direction="row" spacing={1}>
                        <Typography
                            sx={{mt: 0.75}}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            Unarchive
                        </Typography>
                        <IconButton
                            onClick={toggleArchive}
                        >
                            <UnarchiveIcon/>
                        </IconButton>
                    </Stack>
                    : 
                    <Stack direction="row" spacing={1}>
                        <Typography
                            sx={{mt: 0.75}}
                            color="inherit"
                            variant="subtitle1"
                            component="div"
                        >
                            Archive
                        </Typography>
                        <IconButton
                            onClick={toggleArchive}
                        >
                            <ArchiveIcon/>
                        </IconButton>

                    </Stack>
                    }
            </Tooltip>
        ) : (
            <ArchiveSwitch
                archive={archive}
                setArchive={setArchive} 
            />
        )}
        </Toolbar>
    );
    }

    EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
    };

export default function QuoteLogTable(props) {
    const { token, user, handleOpenSnackbar } = props;
    const [ quotes, setQuotes ] = React.useState([]); 
    const [ rows, setRows ] = React.useState([]);
    const [ year, setYear ] = React.useState(new Date())
    const [ archive, setArchive ] = React.useState(false);
    const [ toggled, setToggled ] = React.useState([]);
    const [ editQuote, setEditQuote ] = React.useState('');
    const [ order, setOrder ] = React.useState('asc');
    const [ orderBy, setOrderBy ] = React.useState('calories');
    const [ selected, setSelected ] = React.useState([]);
    const [ page, setPage ] = React.useState(0);
    const [ dense, setDense ] = React.useState(false);
    const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
    const didMount = React.useRef(false);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);
    const [mouseX, setMouseX] = React.useState(0);
    const [mouseY, setMouseY] = React.useState(0);
    
    React.useEffect(() => {
        if (didMount.current) {
            if (archive){
                setRows([]);
                retrieveArchiveQuotes(year.getFullYear())
            }else{
                setRows([]);
                retrieveQuotes(year.getFullYear())
            }
        } else {
            didMount.current = true;
        };
    },[year, archive, quotes])

    React.useEffect(() => {
        if (didMount.current) {
            quotes.map((q) => {
                let temp ={id: q.id, number: q.number, name: q.name, due: q.due, project_category: q.project_category.name, project_type: q.project_type.name, manager: `${q.manager.first_name} ${q.manager.last_name}`};
                setRows(oldArray => [...oldArray, temp]);
            })
        } else {
            didMount.current = true;
        };
    },[quotes]);

    const retrieveQuotes = (year) => {
        QuoteDataService.getAllYear(year, token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const retrieveArchiveQuotes = (year) => {
        QuoteDataService.getAllArchive(year, token)
        .then(response => {
            setQuotes(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const toggleArchive = () => {
        toggled.map((t) => {
            QuoteDataService.toggleArchive(t, token)
                .then(response => {
                    // console.log(response.data);
                })
                .catch( e => {
                    console.log(e);
                })
            })
        setToggled([]);
        setSelected([]);
    };


    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
        const newSelected = rows.map((n) => n.name);
        setSelected(newSelected);
        return;
        }
        setSelected([]);
    };

    const handleClick = (event, name, id) => {
        if(toggled.find((f) => f == id)){
            let temp = toggled.filter((f) => f !== id);
            setToggled(temp)
        }else{
            setToggled(oldArray => [...oldArray, id]);
        }
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
        );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = (event) => {
        setDense(event.target.checked);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleClickMenu = (event, id) => {
        setEditQuote(quotes.find((q) => q.id === id))
        
        if (event.target.type === 'checkbox') {
            // prevent menu from popping up if checkbox is selected
            console.log("checkbox select");
        } else {
            if(!archive){
                setAnchorEl(event.currentTarget);
                setMouseX(event.clientX);
                setMouseY(event.clientY);
            }
        }
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ width: '100%', m:4, maxWidth: '92%'}}>
            <Box sx={{marginBottom: 4}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} >
                    <DatePicker
                        label="Year"
                        id="year"
                        name="year"
                        views={['year']}
                        value={year}
                        onChange={(date) => {setYear(date)}}
                        renderInput={(params) => < TextField {...params} variant="filled"/>}
                        fullWidth
                    />
                </LocalizationProvider>
            </Box>
            <Paper sx={{ width: '100%', mb: 2 }}>
                <EnhancedTableToolbar 
                    numSelected={selected.length}
                    archive={archive}
                    setArchive={setArchive} 
                    toggleArchive={toggleArchive}
                />
                <TableContainer>
                <Table
                    sx={{ width: '100%'}}
                    aria-labelledby="tableTitle"
                    size={dense ? 'small' : 'medium'}
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        
                    />
                    <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                        rows.sort(getComparator(order, orderBy)).slice() */}
                    {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                        const isItemSelected = isSelected(row.name);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <TableRow
                                hover
                                onClick={(e) => handleClickMenu(e, row.id)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.id}
                                selected={isItemSelected}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                    color="primary"
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                    onClick={(event) => {handleClick(event, row.name, row.id)}}
                                    />
                                </TableCell>
                                <TableCell
                                    sx={{whiteSpace: 'nowrap'}}
                                    component="th"
                                    id={labelId}
                                    scope="row"
                                    padding="none"
                                >
                                    {row.number}
                                </TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.name}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{moment(row.due).format("MMM Do YY")}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.project_category}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.project_type}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.manager}</TableCell>
                            </TableRow>
                        );
                        })}
                    {emptyRows > 0 && (
                        <TableRow
                        style={{
                            height: (dense ? 33 : 53) * emptyRows,
                        }}
                        >
                        <TableCell colSpan={7} />
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label="Dense padding"
            />
            <QuoteLogMenu
                anchorEl={anchorEl}
                open={openMenu} 
                handleClick={handleClickMenu}
                handleClose={handleCloseMenu}
                mouseX={mouseX}
                mouseY={mouseY}
                token={token}
                user={user}
                handleOpenSnackbar={handleOpenSnackbar}
                quote={editQuote}
            />
        </Box>
    );
}