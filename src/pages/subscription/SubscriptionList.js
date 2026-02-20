import { paramCase } from 'change-case';
import { useState } from 'react';
import {
  useNavigate,
  // Link as RouterLink
} from 'react-router-dom';
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
// hooks
import useSettings from '../../hooks/useSettings';
import useTable from '../../hooks/useTable';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import { TableHeadCustom, TableLoading, TableNoData } from '../../components/table';
// sections
import { SubscriptionTableToolbar, SubscriptionTableRow } from './sections';
// context
import { roleOptions } from '../../_mock/roleOptions';
import useService from './service/useService';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];

const ROLE_OPTIONS = ['All', ...roleOptions];

const TABLE_HEAD = [
  { id: '', label: 'Updated At', align: 'center' },
  { id: '', label: 'Subscription ID', align: 'left' },
  { id: '', label: 'Owner Name', align: 'left' },
  { id: '', label: 'Business Name', align: 'left' },
  { id: '', label: 'Contact', align: 'center' },
  { id: '', label: 'Subscription Plan', align: 'center' },
  { id: '', label: 'Subscription Status', align: 'center' },
  { id: '', label: 'Action', align: 'center' },
];

// ----------------------------------------------------------------------

export default function SubscriptionList() {
  const { dense, onChangeDense } = useTable();
  const { themeStretch } = useSettings();
  const navigate = useNavigate();
  const { list } = useService();

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
    sort: 'updatedAt',
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

  const handleDetailRow = (id) => {
    navigate(`/dashboard/subscription/${paramCase(id)}/detail`);
  };

  return (
    <>
      <Page title="Subscription List">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Card>
            <Typography variant="h6" mx={1}>
              Subscription
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
                <SubscriptionTableToolbar
                  filterName={search}
                  onFilterName={handleSearch}
                  filterRole={filterRole}
                  onFilterRole={handleFilterRole}
                  optionsRole={ROLE_OPTIONS}
                  onEnter={handleOnKeyPress}
                />
              </div>
            </Stack>

            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom headLabel={TABLE_HEAD} rowCount={tableData?.docs?.length || 0} />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <SubscriptionTableRow key={row._id} row={row} onDetailRow={() => handleDetailRow(row._id)} />
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
                count={Number(tableData?.totalDocs || 0)}
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
    </>
  );
}
