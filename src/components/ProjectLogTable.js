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
import ArchiveIcon from '@mui/icons-material/Archive';
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import { visuallyHidden } from '@mui/utils';
import QuoteDataService from '../services/Quote.services';
import ProjectDataService from '../services/Project.services';
import ProjectButtons from './ProjectButtons';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TextField from '@mui/material/TextField';
import ArchiveSwitch from './ArchiveSwitch';
import moment from 'moment';
import { Stack } from '@mui/system';
import QuoteLogMenu from './QuoteLogMenu';
import ProjectLogMenu from './ProjectLogMenu';

//! notes


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
            label: 'Number',
        },
        {
            id: 'name',
            numeric: false,
            disablePadding: false,
            label: 'Name',
        },
        {
            id: 'order_type',
            numeric: false,
            disablePadding: false,
            label: 'Order Type',
        },
        {
            id: 'created',
            numeric: true,
            disablePadding: false,
            label: 'Created',
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
                {archive? 'Archived' : 'Active'} Projects
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

export default function ProjectLogTable(props) {
    const { token, user, handleOpenSnackbar, darkState } = props;
    const [ projects, setProjects ] = React.useState([]); 
    const [ rows, setRows ] = React.useState([]);
    const [ year, setYear ] = React.useState(new Date())
    const [ archive, setArchive ] = React.useState(false);
    const [ toggled, setToggled ] = React.useState([]);
    const [ editProject, setEditProject ] = React.useState('');
    const [ openEdit, setOpenEdit ] = React.useState(false);
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

    const [ projectType, setProjectType ] = React.useState(1); // project type
    
    React.useEffect(() => {
        if (didMount.current) {
            if (archive){
                setRows([]);
                retrieveArchiveProjects(year.getFullYear())
            }else{
                setRows([]);
                retrieveProjects();
            }
        } else {
            didMount.current = true;
        };
    },[year, archive, openEdit])

    React.useEffect(() => {
        if (didMount.current) {
            projects.map((p) => {
                let temp ={id: p.id, number: p.number, name: p.name, order_type: p.order_type.name, created: p.created, project_category: p.project_category.name, project_type: p.project_type.name};
                setRows(oldArray => [...oldArray, temp]);
            })
        } else {
            didMount.current = true;
        };
    },[projects]);

    const retrieveProjects = () => {
        ProjectDataService.getAll(token)
        .then(response => {
            setProjects(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const retrieveArchiveProjects = (year) => {
        ProjectDataService.getAllArchive(year, token)
        .then(response => {
            setProjects(response.data);
        })
        .catch( e => {
            console.log(e);
        })
    };

    const toggleArchive = () => {
        toggled.map((t) => {
            ProjectDataService.toggleArchive(t, token)
                .then(response => {
                    if (archive){
                        setRows([]);
                        retrieveArchiveProjects(year.getFullYear());
                    }else{
                        setRows([]);
                        retrieveProjects();
                    }
                })
                .catch( e => {
                    console.log(e);
                })
            })
        setToggled([]);
        setSelected([]);
    };

    const archiveProject = (id) => {
        ProjectDataService.toggleArchive(id, token)
            .then(response => {
                setRows([]);
                retrieveProjects()
            })
            .catch( e => {
                console.log(e);
            })
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

    const handleChangeProjectType = (id) => {
        /*
        set project type 
        {id: 1, name: 'project'},
        {id: 2, name: 'service'},
        {id: 3, name: 'HSE project'}
        */
        setProjectType(id);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const handleClickMenu = (event, id) => {
        setEditProject(projects.find((p) => p.id === id))
        
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
                <Stack spacing={2}>
                    {archive?
                    <div style={{width: '33%'}}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Year"
                            id="year"
                            name="year"
                            views={['year']}
                            value={year}
                            onChange={(date) => {setYear(date)}}
                            renderInput={(params) => < TextField {...params} variant="filled"/>}
                        />
                    </LocalizationProvider> 
                    </div>
                    : '' }
                    <ProjectButtons
                        darkState={darkState}
                        projectType={projectType}
                        handleChangeProjectType={handleChangeProjectType}
                    />
                </Stack>
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
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.order_type}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{moment(row.created).format("MMM Do YY")}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.project_category}</TableCell>
                                <TableCell sx={{whiteSpace: 'nowrap'}} align="left">{row.project_type}</TableCell>
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
            <ProjectLogMenu
                anchorEl={anchorEl}
                open={openMenu} 
                handleClick={handleClickMenu}
                handleClose={handleCloseMenu}
                mouseX={mouseX}
                mouseY={mouseY}
                token={token}
                user={user}
                handleOpenSnackbar={handleOpenSnackbar}
                project={editProject}
                archiveProject={archiveProject}
                openEdit={openEdit}
                setOpenEdit={setOpenEdit}
            />
        </Box>
    );
}