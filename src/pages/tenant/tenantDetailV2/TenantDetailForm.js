import { forwardRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
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
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  InputAdornment,
  Slide,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Icon } from '@iconify/react';
import { FormProvider, RHFSelect, RHFTextField } from 'src/components/hook-form';
import numberWithCommas from 'src/utils/numberWithCommas';
import Iconify from '../../../components/Iconify';
import Scrollbar from '../../../components/Scrollbar';
import Label from '../../../components/Label';
import { TableHeadCustom, TableNoData, TableLoading } from '../../../components/table';
import ConfirmDelete from '../../../components/ConfirmDelete';
// utils
import { formatDate, formatDate2 } from '../../../utils/getData';
import { fCurrency } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// schema
import schema from '../schema';
import accountSchema from '../schema/account';
// service
import useService from '../service/useService';
import TenantInvoiceTableToolbar from './TenantInvoiceTableToolbar';
import TenantInvoiceTableRow from './TenantInvoiceTableRow';
import TenantLogTableRow from './TenantLogTableRow';

// ----------------------------------------------------------------------
const INVOICE_THEAD = [
  { id: '', label: 'No', align: 'center' },
  { id: '', label: 'Transaction Date', align: 'left' },
  { id: '', label: 'Invoice ID', align: 'left' },
  { id: '', label: 'Subscription Plan', align: 'center' },
  { id: '', label: 'Total', align: 'center' },
  { id: '', label: 'Payment Method', align: 'center' },
  { id: '', label: 'Payment Status', align: 'center' },
];

const LOG_THEAD = [
  { id: 'no', label: 'No', align: 'center' },
  { id: 'timeStamp', label: 'Timestamp', align: 'left' },
  { id: 'log', label: 'Activity', align: 'left' },
  { id: 'notes', label: 'Notes', align: 'left' },
  { id: '', label: 'Updated By', align: 'left' },
];

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------
// Tab Panels Components
// ----------------------------------------------------------------------

function TenantInformationTab() {
  const { id = '' } = useParams();
  const { getById, remove } = useService();
  const { data: dataTenant, isSuccess: successTenant, isLoading: loadingTenant } = getById(id);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const [openDelete, setOpenDelete] = useState(false);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    // control,
    // watch,
    // setValue,
    // handleSubmit,
    // formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!successTenant) return;

    const objData = {
      ...dataTenant,
      registeredAt: dataTenant?.createdAt ? formatDate2(dataTenant?.createdAt) : '',
    };

    reset(objData);
  }, [successTenant, dataTenant, reset]);

  const handleDelete = async () => {
    if (!dataTenant?._id) return;

    try {
      await remove.mutateAsync(dataTenant?._id);

      enqueueSnackbar('Tenant deleted!', { variant: 'success' });
      navigate(PATH_DASHBOARD.tenant.root);
      setOpenDelete(false);
    } catch (err) {
      enqueueSnackbar(err?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <FormProvider methods={methods}>
        <Grid container spacing={3} mt={3}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={4}>
            <Stack
              spacing={3}
              alignItems="center"
              sx={{
                textAlign: 'center',
              }}
            >
              {/* Profile Photo */}
              {loadingTenant ? (
                <>
                  <Skeleton variant="circular" width="120px" height="120px" />
                  <Skeleton variant="text" width="200px" height="56px" />
                  <Divider flexItem />
                  <Skeleton variant="text" width="200px" height="56px" />
                </>
              ) : (
                <>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      bgcolor: 'background.neutral',
                      color: 'text.primary',
                      fontSize: 40,
                      fontWeight: 600,
                    }}
                    alt={dataTenant?.businessName}
                    src={dataTenant?.image}
                  />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {dataTenant?.businessName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dataTenant?.email}
                    </Typography>
                  </Box>
                  <Divider flexItem />
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Icon icon="mdi:trash-outline" />}
                    onClick={() => setOpenDelete(true)}
                  >
                    Hapus Akun
                  </Button>
                </>
              )}
            </Stack>
          </Grid>

          {/* MIDDLE COLUMN */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              <Stack spacing={3}>
                <RHFTextField
                  name="registeredAt"
                  label="Tgl Registrasi"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="tenantId"
                  label="ID Tenant"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="businessName"
                  label="Nama Usaha"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="businessType"
                  label="Bidang Usaha"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="description"
                  label="Deskripsi Usaha"
                  multiline
                  rows={4.48}
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="operatingSince"
                  label="Lama Beroperasi"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="legalStatus"
                  label="Bentuk Usaha"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Stack>
              <Stack spacing={3}>
                <RHFTextField
                  name="ownerName"
                  label="Nama Pemilik Usaha"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="phone"
                  label="No. Handphone"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="email"
                  label="Email Address"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="address"
                  label="Address"
                  multiline
                  rows={4.48}
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="province"
                  label="Provinsi"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="city"
                  label="Kota"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <RHFTextField
                  name="district"
                  label="Kecamatan"
                  loading={loadingTenant}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </FormProvider>

      <ConfirmDelete
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onDelete={handleDelete}
        isLoading={remove.isLoading}
      />
    </Box>
  );
}

function CurrentSubscriptionTab() {
  const { id = '' } = useParams();
  const { getById } = useService();
  const { data: dataSubs, isLoading: loadingSubs } = getById(id);

  // Helper function untuk menghitung sisa hari
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
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

  const InfoRow = ({ label = 'Label', value = '', valueVariant = 'subtitle1', valueColor = 'inherit' }) => {
    return (
      <Stack>
        <Typography variant="subtitle2" color="text.secondary">
          {label}
        </Typography>
        {loadingSubs ? (
          <Skeleton variant="text" width="200px" height="20px" />
        ) : (
          <Typography variant={valueVariant} color={valueColor} sx={{ textTransform: 'capitalize' }}>
            {value}
          </Typography>
        )}
      </Stack>
    );
  };
  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        {/* TOP CARD */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* LEFT CONTENT */}
            <Box>
              <InfoRow
                label="Subscription Plan"
                value={`${dataSubs?.subsRef?.serviceName || 'TRIAL'} ${
                  dataSubs?.subsRef?.subsType && dataSubs?.subsRef?.subsType !== 'trial'
                    ? `- ${dataSubs?.subsRef?.subsType}`
                    : ''
                }`}
                valueVariant="h6"
                valueColor="primary"
              />

              <Stack spacing={1} mt={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon icon="mdi:calendar-range-outline" width={18} />
                  {loadingSubs ? (
                    <Skeleton variant="text" width="170px" height="20px" />
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(dataSubs?.subsRef?.startDate)} - {formatDate(dataSubs?.subsRef?.endDate)}
                    </Typography>
                  )}
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon icon="mdi:timer-sand" width={18} />
                  {loadingSubs ? (
                    <Skeleton variant="text" width="170px" height="20px" />
                  ) : (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {calculateDaysRemaining(dataSubs?.subsRef?.endDate) > 0
                          ? `${calculateDaysRemaining(dataSubs?.subsRef?.endDate)} hari tersisa`
                          : 'Subscription berakhir'}
                      </Typography>
                      <Tooltip title="This subscription will expire soon" arrow>
                        <Icon icon="simple-line-icons:info" width={18} />
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </Stack>
            </Box>

            {/* RIGHT STATUS */}
            <Label
              variant="ghost"
              color={subsColor(dataSubs?.subsRef?.status)}
              sx={{ textTransform: 'capitalize', mt: 0.5 }}
            >
              {dataSubs?.subsRef?.status}
            </Label>
          </Card>
        </Grid>

        {/* BOTTOM CARDS */}
        <Grid item xs={12}>
          <Grid container columnSpacing={3}>
            {/* TOTAL ORDER */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Order
                  </Typography>
                  <Typography variant="h4">1</Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#DDE8FD',
                  }}
                >
                  <Icon icon="icon-park-solid:transaction-order" width={24} color="#5274D9" />
                </Box>
              </Card>
            </Grid>

            {/* TOTAL REVENUE */}
            <Grid item xs={12} md={6}>
              <Card
                sx={{
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">Rp {numberWithCommas(1_000_000)}</Typography>
                </Box>

                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#DDE8FD',
                  }}
                >
                  <Icon icon="fluent:money-calculator-20-filled" width={24} color="#5274D9" />
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

function AccountStatusTab() {
  const { enqueueSnackbar } = useSnackbar();
  const { id = '' } = useParams();
  const { getById, activate, suspend } = useService();
  const { data: dataAccount, isSuccess: successAccount, isLoading: loadingAccount } = getById(id);

  const methods = useForm({
    resolver: yupResolver(accountSchema),
    defaultValues: accountSchema.getDefault(),
  });

  const {
    // control,
    // watch,
    // setValue,
    handleSubmit,
    // formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!successAccount) return;

    reset(dataAccount);
  }, [successAccount, dataAccount, reset]);

  const [openConfirm, setOpenConfirm] = useState(false);
  const [formData, setFormData] = useState(null);

  const accStatusColor = (val = '') => {
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

  const onSubmit = (data) => {
    setFormData(data);
    setOpenConfirm(true);
  };

  const handleConfirm = async () => {
    if (!dataAccount?._id) return;

    try {
      if (formData?.status === 'active') {
        await activate.mutateAsync({
          id: dataAccount._id,
          payload: { reason: formData?.reason },
        });

        enqueueSnackbar('Tenant activated!', { variant: 'success' });
      }

      if (formData?.status === 'suspended') {
        await suspend.mutateAsync({
          id: dataAccount._id,
          payload: { reason: formData?.reason },
        });

        enqueueSnackbar('Tenant suspended!', { variant: 'success' });
      }

      setOpenConfirm(false);
    } catch (err) {
      enqueueSnackbar(err?.message || 'Something went wrong', {
        variant: 'error',
      });
    }
  };

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={3}>
        {/* CURRENT STATUS */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h5">Current Status</Typography>
            <Label variant="ghost" color={accStatusColor(dataAccount?.status)} sx={{ textTransform: 'capitalize' }}>
              {dataAccount?.status}
            </Label>
          </Card>
        </Grid>

        {/* UPDATE STATUS */}
        <Grid item xs={12}>
          <FormProvider methods={methods}>
            <Box sx={{ p: 3 }}>
              <Stack spacing={0}>
                <Typography variant="h5" color="text.secondary">
                  Update Account Status
                </Typography>

                <Grid container spacing={3} mt={1}>
                  {/* STATUS SELECT */}
                  <Grid item xs={12} md={5}>
                    <RHFSelect name="status" label="Status" SelectProps={{ native: false }} required>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="suspended">Suspend</MenuItem>
                    </RHFSelect>
                  </Grid>

                  {/* REASON */}
                  <Grid item xs={12} md={7}>
                    <RHFTextField
                      name="reason"
                      label="Reason"
                      multiline
                      rows={4}
                      placeholder="Masukkan alasan perubahan status akun"
                    />
                  </Grid>
                </Grid>

                {/* ACTION */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Icon icon="mdi:content-save-outline" />}
                    onClick={handleSubmit(onSubmit)}
                    disabled={loadingAccount}
                  >
                    Submit
                  </Button>
                </Box>
              </Stack>
            </Box>
          </FormProvider>
        </Grid>
      </Grid>

      {/* CONFIRMATION DIALOG */}
      <Dialog open={openConfirm}>
        <DialogTitle>Confirm Status Update</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            You are about to update the account status. This action may affect the tenant's ability to access the
            system.
          </Typography>

          <Stack gap={1} sx={{ mt: 2 }}>
            <Box>
              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                New Status :
              </Typography>
              <Label variant="ghost" color={accStatusColor(formData?.status)} sx={{ textTransform: 'capitalize' }}>
                {formData?.status === 'suspended' ? 'suspend' : formData?.status}
              </Label>
            </Box>
            <Box>
              {formData?.reason && (
                <>
                  <Typography variant="subtitle2">Reason :</Typography>
                  <Typography variant="body2">{formData.reason}</Typography>
                </>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            loading={activate.isLoading || suspend.isLoading}
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function SubscriptionHistoryTab() {
  const { listInvoice } = useService();
  const { id = '' } = useParams();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
    status: controller.status !== 'all' ? controller.status : '',
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

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleFilterStatus = (event) => {
    const { value } = event.target;
    setFilterStatus(value);
    setController({
      page: 0,
      rowsPerPage: controller.rowsPerPage,
      search,
      status: value !== 'all' ? value?.toLowerCase() : '',
    });
  };

  const handleOnKeyPress = (e) => {
    if (e.key === 'Enter') {
      setController({
        page: 0,
        rowsPerPage: controller.rowsPerPage,
        search: search !== '' ? search : '',
        status: filterStatus !== 'all' ? filterStatus?.toLowerCase() : '',
      });
    }
  };

  const handleClickDetail = (val) => {
    setSelectedData(val);
    setOpenDetail(true);
  };

  return (
    <Box>
      <TenantInvoiceTableToolbar
        filterSearch={search}
        onFilterSearch={handleSearch}
        optionsStatus={['all', 'paid', 'unpaid']}
        filterStatus={filterStatus}
        onFilterStatus={handleFilterStatus}
        onEnter={handleOnKeyPress}
      />
      <Box>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
            <Table size="small">
              <TableHeadCustom headLabel={INVOICE_THEAD} rowCount={tableData?.docs?.length} />

              <TableBody>
                {!isLoading ? (
                  <>
                    {tableData?.docs?.map((row, index) => (
                      <TenantInvoiceTableRow
                        key={row._id}
                        row={row}
                        number={index + 1}
                        onDetailRow={() => {
                          handleClickDetail(row);
                        }}
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
            count={Number(tableData?.totalDocs || 0)}
            rowsPerPage={controller.rowsPerPage}
            page={controller.page}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      <Dialog open={openDetail} fullScreen TransitionComponent={Transition}>
        <DialogContent sx={{ mt: 2 }}>
          {/* KODE TRANSAKSI */}
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" fontWeight={600}>
              Kode Transaksi
            </Typography>
            <Typography variant="h5" fontWeight={700} color="primary">
              {selectedData?.invoiceId}
            </Typography>
          </Box>

          {/* DETAIL PEMESAN */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>
              Detail Pemesan
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Tenant ID
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.tenantId}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Pemesan
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.ownerName}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Nama Usaha
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.businessName}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Bidang Usaha
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.businessType}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.email}</Typography>
              </Grid>

              <Grid item xs={12} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Telepon
                </Typography>
                <Typography variant="body2">{selectedData?.tenantRef?.phone}</Typography>
              </Grid>

              {/* <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Alamat
                      </Typography>
                      <Typography variant="body2">Surakarta, Indonesia</Typography>
                    </Grid> */}
            </Grid>
          </Card>

          {/* DETAIL PEMBELIAN */}
          <Card sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" mb={2}>
              Detail Pembelian
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Produk
                  </Typography>
                  <Typography variant="body2">{selectedData?.serviceName || '-'}</Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Status Langganan
                  </Typography>
                  <Typography variant="body2">
                    Aktif dari : {selectedData?.startDate ? formatDate(selectedData?.startDate) : '-'}
                  </Typography>
                  <Typography variant="body2">
                    Berakhir pada : {selectedData?.endDate ? formatDate(selectedData?.endDate) : '-'}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Durasi
                  </Typography>
                  <Stack flexDirection="row" alignItems="center" gap={4}>
                    <Typography variant="body2">
                      {selectedData?.qty || 1} {selectedData?.subsType === 'monthly' ? 'Bulan' : 'Tahun'}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              <Grid item xs={12} md={3}>
                <Stack gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Harga
                  </Typography>
                  <Typography variant="body2">
                    {fCurrency((selectedData?.qty || 1) * (selectedData?.price || 0))}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Card>

          {/* TOTAL TAGIHAN */}
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" mb={2}>
              Rincian
            </Typography>

            <Stack flexDirection="column" gap={1}>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Biaya Langganan</Typography>
                <Typography variant="subtitle2">
                  {fCurrency((selectedData?.qty || 1) * (selectedData?.price || 0))}
                </Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Diskon</Typography>
                <Typography variant="subtitle2">{fCurrency(selectedData?.discount || 0)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">Biaya Admin</Typography>
                <Typography variant="subtitle2">{fCurrency(selectedData?.adminFee || 0)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2">PPN 11%</Typography>
                <Typography variant="subtitle2">{fCurrency(selectedData?.tax || 0)}</Typography>
              </Stack>
              <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                <Typography variant="h6" color="primary">
                  Total Tagihan
                </Typography>
                <Typography variant="h6" color="primary">
                  {fCurrency(selectedData?.billedAmount || 0)}
                </Typography>
              </Stack>

              <Stack gap={1}>
                <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                  <Typography variant="body2" color="text.secondary">
                    Metode Pembayaran
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                </Stack>
                <Stack flexDirection="row" justifyContent="space-between" gap={1}>
                  <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                    {selectedData?.payment?.channel || '-'}
                  </Typography>
                  <Label
                    variant="ghost"
                    color={
                      selectedData?.status === 'paid'
                        ? 'success'
                        : selectedData?.status === 'unpaid'
                        ? 'warning'
                        : selectedData?.status === 'canceled'
                        ? 'error'
                        : 'warning'
                    }
                    sx={{ textTransform: 'capitalize' }}
                  >
                    {selectedData?.status}
                  </Label>
                </Stack>
              </Stack>
            </Stack>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function ActivityLogTab() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [ctrlLog, setCtrlLog] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
    start: '',
    end: '',
  });

  const { id = '' } = useParams();
  const { listActivity } = useService();

  const { data: tableLog, isLoading: loadingLog } = listActivity({
    page: ctrlLog.page + 1,
    perPage: ctrlLog.rowsPerPage,
    search: ctrlLog.search,
    start: ctrlLog?.start || '',
    end: ctrlLog?.end || '',
    tenant: id,
  });

  const handlePageChangeLog = (event, newPage) => {
    setCtrlLog({
      ...ctrlLog,
      page: newPage,
    });
  };

  const handleChangeRowsPerPageLog = (event) => {
    setCtrlLog({
      ...ctrlLog,
      rowsPerPage: parseInt(event.target.value, 10),
      page: 0,
    });
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
    setCtrlLog((prev) => ({
      ...prev,
      start: '',
      end: '',
    }));
  };

  return (
    <Box>
      <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} sx={{ py: 2.5 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="Start Date"
            inputFormat="dd/MM/yyyy"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src="/assets/calender-icon.svg" alt="icon" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { sm: 240 },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <MobileDatePicker
            label="End Date"
            inputFormat="dd/MM/yyyy"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            onAccept={(newValue) => {
              if (startDate && newValue) {
                setCtrlLog((prev) => ({
                  ...prev,
                  start: startDate,
                  end: newValue,
                }));
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src="/assets/calender-icon.svg" alt="icon" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  maxWidth: { sm: 240 },
                }}
              />
            )}
          />
        </LocalizationProvider>

        <Box>
          <Button
            variant="contained"
            color="warning"
            sx={{ color: 'white' }}
            size="small"
            title="Reset"
            onClick={() => handleReset()}
          >
            <Iconify icon={'mdi:reload'} sx={{ width: 25, height: 25 }} />
          </Button>
        </Box>
      </Stack>
      <Box>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 980 }}>
            <Table size="small">
              <TableHeadCustom headLabel={LOG_THEAD} rowCount={tableLog?.docs?.length} />

              <TableBody>
                {!loadingLog ? (
                  <>
                    {tableLog?.docs?.map((row, index) => (
                      <TenantLogTableRow key={row._id} row={row} number={index + 1} />
                    ))}

                    <TableNoData isNotFound={tableLog?.docs?.length === 0} />
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
            count={Number(tableLog?.totalDocs || 0)}
            rowsPerPage={ctrlLog.rowsPerPage}
            page={ctrlLog.page}
            onPageChange={handlePageChangeLog}
            onRowsPerPageChange={handleChangeRowsPerPageLog}
          />
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function TenantDetail() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TAB_ITEMS = [
    { label: 'Tenant Information', icon: 'mdi:office-building-outline', component: <TenantInformationTab /> },
    { label: 'Current Subscription', icon: 'mdi:credit-card-outline', component: <CurrentSubscriptionTab /> },
    { label: 'Account Status', icon: 'mdi:account-check-outline', component: <AccountStatusTab /> },
    { label: 'Subscription History', icon: 'mdi:history', component: <SubscriptionHistoryTab /> },
    { label: 'Activity Log', icon: 'mdi:clipboard-text-clock-outline', component: <ActivityLogTab /> },
  ];

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Stack>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
              minHeight: 48,
              '& .MuiTabs-flexContainer': {
                gap: 1.5,
              },
            }}
          >
            {TAB_ITEMS.map((item, index) => (
              <Tab
                key={item.label}
                icon={<Icon icon={item.icon} width={20} />}
                iconPosition="start"
                label={item.label}
                sx={{
                  minHeight: 44,
                  px: 2,
                  py: 1,
                  textTransform: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  gap: 1,
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  overflow: 'visible',
                  minWidth: 'auto',
                }}
              />
            ))}
          </Tabs>

          <Divider sx={{ my: 2 }} />

          {/* Tab Content */}
          <Box>{TAB_ITEMS[currentTab].component}</Box>
        </Stack>
      </Card>
    </>
  );
}
