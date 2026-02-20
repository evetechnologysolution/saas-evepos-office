import { forwardRef, useState } from 'react';
import { useParams } from 'react-router-dom';
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
  Tooltip,
  Dialog,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
} from '@mui/material';
import { Icon } from '@iconify/react';
import Slide from '@mui/material/Slide';
import Scrollbar from '../../../components/Scrollbar';
import Label from '../../../components/Label';
import { TableHeadCustom, TableNoData, TableLoading } from '../../../components/table';
import SubscriptionInvoiceTableToolbar from './SubscriptionInvoiceTableToolbar';
import SubscriptionInvoiceTableRow from './SubscriptionInvoiceTableRow';
// utils
import { formatDate } from '../../../utils/getData';
import { fCurrency } from '../../../utils/formatNumber';
// service
import useService from '../service/useService';

// ----------------------------------------------------------------------
const INVOICE_THEAD = [
  { id: '', label: 'No', align: 'center' },
  { id: '', label: 'Created At', align: 'center' },
  { id: '', label: 'Invoice ID', align: 'left' },
  { id: '', label: 'Subscription Plan', align: 'left' },
  { id: '', label: 'Total', align: 'center' },
  { id: '', label: 'Paid At', align: 'center' },
  { id: '', label: 'Payment Method', align: 'center' },
  { id: '', label: 'Payment Status', align: 'center' },
];

const Transition = forwardRef((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

// ----------------------------------------------------------------------
// Tab Panels Components
// ----------------------------------------------------------------------

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
    <Box sx={{ p: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {/* LEFT CONTENT */}
          <Box>
            <InfoRow
              label="Subscription Plan"
              value={`${dataSubs?.serviceName || 'TRIAL'} ${
                dataSubs?.subsType && dataSubs?.subsType !== 'trial' ? `- ${dataSubs?.subsType}` : ''
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
                    {formatDate(dataSubs?.startDate)} - {formatDate(dataSubs?.endDate)}
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
                      {calculateDaysRemaining(dataSubs?.endDate) > 0
                        ? `${calculateDaysRemaining(dataSubs?.endDate)} hari tersisa`
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
          <Label variant="ghost" color={subsColor(dataSubs?.status)} sx={{ textTransform: 'capitalize', mt: 0.5 }}>
            {dataSubs?.status}
          </Label>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <Stack spacing={3}>
              <InfoRow label="Tenant ID" value={dataSubs?.tenantRef?.tenantId} />
              <InfoRow label="Nama Usaha" value={dataSubs?.tenantRef?.businessName} />
              <InfoRow label="Bidang Usaha" value={dataSubs?.tenantRef?.businessType} />
            </Stack>
            <Stack spacing={3}>
              <InfoRow label="Nama Pemilik Usaha" value={dataSubs?.tenantRef?.ownerName} />
              <InfoRow label="No. Telepon" value={dataSubs?.tenantRef?.phone} />
              <InfoRow label="Email" value={dataSubs?.tenantRef?.email} />
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

function SubscriptionHistoryTab() {
  const { listInvoice } = useService();
  const { id = '' } = useParams();

  const [paymentMethod, setPaymentMethod] = useState('allPaymentMethod');
  const [statusPayment, setStatusPayment] = useState('allStatusPayment');
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const [controller, setController] = useState({
    page: 0,
    rowsPerPage: 10,
    search: '',
    status: '',
  });

  const { data: tableData, isLoading } = listInvoice({
    page: controller.page + 1,
    perPage: controller.rowsPerPage,
    search: controller.search,
    subscription: id,
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

  const handleClickDetail = (val) => {
    setSelectedData(val);
    setOpenDetail(true);
  };

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <Stack direction="row" spacing={2}>
            <Select fullWidth value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <MenuItem value="allPaymentMethod">All Payment Method</MenuItem>
              <MenuItem value="creditCard">Credit Card</MenuItem>
              <MenuItem value="virtualAccount">Virtual Account</MenuItem>
              <MenuItem value="linkPayment">Link Payment</MenuItem>
            </Select>

            <Select fullWidth value={statusPayment} onChange={(e) => setStatusPayment(e.target.value)}>
              <MenuItem value="allStatusPayment">All Status</MenuItem>
              <MenuItem value="success">Success</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </Select>
          </Stack>
        </Grid>

        <Grid item xs={12} md={6}>
          <SubscriptionInvoiceTableToolbar filterName={''} onFilterName={() => {}} onEnter={() => {}} />
        </Grid>
      </Grid>

      <Box>
        <Scrollbar>
          <TableContainer sx={{ minWidth: 980, position: 'relative' }}>
            <Table size="small">
              <TableHeadCustom headLabel={INVOICE_THEAD} rowCount={tableData?.docs?.length} />

              <TableBody>
                {!isLoading ? (
                  <>
                    {tableData?.docs?.map((row, index) => (
                      <SubscriptionInvoiceTableRow
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

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function TenantDetail() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TAB_ITEMS = [
    // {
    //   label: 'Current Subscription',
    //   icon: 'mdi:office-building-outline',
    //   component: <CurrentSubscriptionTab />,
    // },
    { label: 'Current Subscription', icon: 'mdi:credit-card-outline', component: <CurrentSubscriptionTab /> },
    { label: 'Subscription History', icon: 'mdi:history', component: <SubscriptionHistoryTab /> },
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
