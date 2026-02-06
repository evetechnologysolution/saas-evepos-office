import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Stack,
  Skeleton,
  Table,
  TableBody,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Scrollbar from '../../../components/Scrollbar';
import Label from '../../../components/Label';
import { TableHeadCustom, TableNoData, TableLoading } from '../../../components/table';
import { PATH_DASHBOARD } from '../../../routes/paths';
import TenantInvoiceTableRow from './TenantInvoiceTableRow';
// utils
import { formatDate, formatDate2 } from '../../../utils/getData';
// service
import useService from '../service/useService';

// ----------------------------------------------------------------------

const INVOICE_THEAD = [
  { id: 'createdAt', label: 'Created At', align: 'center' },
  { id: 'payment.paidAt', label: 'Payment Date', align: 'center' },
  { id: 'invoiceId', label: 'Invoice ID', align: 'left' },
  { id: '', label: 'Plan', align: 'center' },
  { id: 'payment.channel', label: 'Payment Channel', align: 'center' },
  { id: 'status', label: 'Status', align: 'center' },
  { id: 'amount', label: 'Total', align: 'center' },
];

// ----------------------------------------------------------------------

export default function TenantDetail() {
  const navigate = useNavigate();
  const { id = '' } = useParams();
  const { getById, listInvoice } = useService();
  const { data: dataTenant, isLoading: loadingTenant } = getById(id);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
    role: '',
    status: '',
  });

  const { data: tableData, isLoading } = listInvoice({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    tenant: id,
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

  const statusColor = (val = '') => {
    switch (val) {
      case 'active':
        return 'success';
      case 'suspended':
        return 'warning';
      case 'inactive':
        return 'error';
      case 'pending':
        return 'default';
      default:
        return 'default';
    }
  };

  const subsColor = (val = '') => {
    switch (val) {
      case 'active':
        return 'success';
      case 'trial':
        return 'warning';
      case 'expired':
        return 'error';
      default:
        return 'default';
    }
  };

  const InfoRow = ({ label, value }) => {
    return (
      <Stack>
        <Typography variant="subtitle2">{label}</Typography>
        {loadingTenant ? (
          <Skeleton variant="text" width="100px" />
        ) : (
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {value}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack>
          <Stack flexDirection="row" justifyContent="space-between" alignItems="flex-end">
            <Typography variant="subtitle1" color="primary">
              Tenant Information
            </Typography>
            <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.tenant.root)}>
              Back
            </Button>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Stack>
                  <Typography variant="subtitle2">Tenant ID</Typography>
                  {loadingTenant ? (
                    <Skeleton variant="text" width="100px" />
                  ) : (
                    <Stack flexDirection="row" alignItems="center" gap={1}>
                      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                        {dataTenant?.tenantId || '-'}
                      </Typography>
                      <div>
                        <Label
                          variant="ghost"
                          color={statusColor(dataTenant?.status)}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {dataTenant?.status}
                        </Label>
                      </div>
                    </Stack>
                  )}
                </Stack>
                <InfoRow
                  label="Registration Date"
                  value={dataTenant?.createdAt ? formatDate2(dataTenant?.createdAt) : '-'}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Owner Name" value={dataTenant?.ownerName || '-'} />
                <InfoRow label="Business Name" value={dataTenant?.businessName || '-'} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Business Sector" value={dataTenant?.businessType || '-'} />
                <InfoRow label="Operating Since" value={dataTenant?.operatingSince || '-'} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Stack sx={{ mt: 5 }}>
          <Typography variant="subtitle1" color="primary">
            Contact Information
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Phone" value={dataTenant?.phone || '-'} />
                <InfoRow label="Email" value={dataTenant?.email || '-'} />
                <InfoRow label="Address" value={dataTenant?.address || '-'} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Province" value={dataTenant?.province || '-'} />
                <InfoRow label="City" value={dataTenant?.city || '-'} />
                <InfoRow label="District" value={dataTenant?.district || '-'} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Subdistrict" value={dataTenant?.subdistrict || '-'} />
                <InfoRow label="Zip Code" value={dataTenant?.zipCode || '-'} />
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Stack sx={{ mt: 5 }}>
          <Typography variant="subtitle1" color="primary">
            Subscription
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow label="Plan" value={dataTenant?.subsRef?.serviceRef?.name || 'TRIAL'} />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow
                  label="Expiry Date"
                  value={dataTenant?.subsRef?.endDate ? formatDate(dataTenant?.subsRef?.endDate) : '-'}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <InfoRow
                  label="Status Subscription"
                  value={
                    <>
                      <div>
                        <Label
                          variant="ghost"
                          color={subsColor(dataTenant?.subsRef?.status)}
                          sx={{ textTransform: 'capitalize' }}
                        >
                          {dataTenant?.subsRef?.status}
                        </Label>
                      </div>
                    </>
                  }
                />
              </Stack>
            </Grid>
          </Grid>
        </Stack>

        <Stack sx={{ mt: 5 }}>
          <Typography variant="subtitle1" color="primary">
            History Invoice
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
                <Table size="small">
                  <TableHeadCustom headLabel={INVOICE_THEAD} rowCount={tableData?.docs?.length} />

                  <TableBody>
                    {!isLoading ? (
                      <>
                        {tableData?.docs?.map((row) => (
                          <TenantInvoiceTableRow key={row._id} row={row} />
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
            </Box>
          </Box>
        </Stack>
      </Card>
    </>
  );
}
