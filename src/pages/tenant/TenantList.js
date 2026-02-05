import { paramCase } from 'change-case';
import { useState } from 'react';
import {
  useNavigate,
  // Link as RouterLink
} from 'react-router-dom';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  // Button,
  Card,
  Table,
  Switch,
  TableBody,
  Container,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
// import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
import ConfirmDelete from '../../components/ConfirmDelete';
// sections
import { TenantTableToolbar, TenantTableRow } from './sections';
// context
import { roleOptions } from '../../_mock/roleOptions';
import useService from './service/useService';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

const ROLE_OPTIONS = ['All', ...roleOptions];

const TABLE_HEAD = [
  { id: 'createdAt', label: 'Registration Date', align: 'center' },
  { id: 'tenantId', label: 'Tenant ID', align: 'left' },
  { id: 'ownerName', label: 'Owner Name', align: 'left' },
  { id: 'businessName', label: 'Business Name', align: 'left' },
  { id: '', label: 'Contact', align: 'center' },
  // { id: 'status', label: 'Status Tenant', align: 'center' },
  { id: '', label: 'Subscription Plan', align: 'center' },
  { id: '', label: 'Subscription Status', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function TenantList() {
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { list, remove } = useService();

  const [selectedId, setSelectedId] = useState('');
  const [open, setOpen] = useState(false);
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch] = useState('');

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
    role: '',
    status: '',
  });

  const { data: tableData, isLoading } = list({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    // status: "pending:ne"
  });

  const handlePageChange = (event, newPage) => {
    setController({
      ...controller,
      page: newPage,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      setController({
        page: 0,
        rowsPerPage: controller.rowsPerPage,
        search: search !== '' ? search : '',
        role: filterRole !== 'All' ? filterRole : '',
        status: filterStatus !== 'All' ? filterStatus?.toLowerCase() : '',
      });
    }
  };

  const handleFilterRole = (event) => {
    const { value } = event.target;
    setFilterRole(value);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search,
      role: value !== 'All' ? value : '',
      status: filterStatus !== 'All' ? filterStatus?.toLowerCase() : '',
    });
  };

  //   const handleFilterStatus = (val) => {
  //     setFilterStatus(val);
  //     setController({
  //       page: 0,
  //       rowsPerPage: controller.rowsPerPage,
  //       search,
  //       role: filterRole !== 'All' ? filterRole : '',
  //       status: val !== 'All' ? val?.toLowerCase() : '',
  //     });
  //   };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.tenant.edit(paramCase(id)));
  };

  const handleDialog = (id) => {
    setSelectedId(id);
    setOpen(!open);
  };

  const handleDelete = () => {
    if (!selectedId) return;

    remove.mutate(selectedId, {
      onSuccess: () => {
        enqueueSnackbar('User deleted!', { variant: 'success' });
        setOpen(false);
      },
      onError: (err) => {
        enqueueSnackbar(err?.message || 'Failed to delete', { variant: 'error' });
      },
    });
  };

  return (
    <>
      <Page title="Tenant List">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card>
            <Typography variant="h6" mx={1}>
              Tenant
            </Typography>

            <Stack
              flexDirection={{ sm: 'row' }}
              flexWrap="wrap"
              alignItems={{ sm: 'center' }}
              justifyContent={{ sm: 'space-between' }}
              mr={1}
              mb={{ xs: 2, sm: 0 }}
            >
              <div style={{ minWidth: '40%' }}>
                <TenantTableToolbar
                  filterName={search}
                  onFilterName={handleSearch}
                  filterRole={filterRole}
                  onFilterRole={handleFilterRole}
                  optionsRole={ROLE_OPTIONS}
                  onEnter={handleOnKeyPress}
                />
              </div>
              {/* <Button
                variant="contained"
                startIcon={<Iconify icon="eva:plus-fill" />}
                component={RouterLink}
                to={PATH_DASHBOARD.user.create}
              >
                New Tenant
              </Button> */}
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <TenantTableRow
                            key={row._id}
                            row={row}
                            onEditRow={() => handleEditRow(row._id)}
                            onDeleteRow={() => handleDialog(row._id)}
                          />
                        ))}

                        <TableNoData isNotFound={tableData?.docs?.length === 0} />
                      </>
                    ) : (
                      <TableLoading />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={Number(tableData?.totalPages || 0)}
                rowsPerPage={controller.rowsPerPage}
                page={controller.page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

              <FormControlLabel
                control={<Switch checked={dense} onChange={onChangeDense} />}
                label="Dense"
                sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
              />
            </Box>
          </Card>
        </Container>
      </Page>
      <ConfirmDelete open={open} onClose={handleDialog} onDelete={handleDelete} isLoading={remove.isLoading} />
    </>
  );
}
