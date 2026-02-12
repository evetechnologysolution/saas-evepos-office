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
  Tabs,
  Tab,
  Avatar,
  Badge,
  Chip,
  Tooltip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { FormProvider, RHFTextField } from 'src/components/hook-form';
import { useForm } from 'react-hook-form';
import numberWithCommas from 'src/utils/numberWithCommas';
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
// Tab Panels Components
// ----------------------------------------------------------------------

function TenantInformationTab() {
  const methods = useForm();

  return (
    <Box sx={{ p: 3 }}>
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
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'background.neutral',
                  color: 'text.primary',
                  fontSize: 40,
                  fontWeight: 600,
                }}
              >
                T
              </Avatar>

              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Nama Tenant
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  tenant@email.com
                </Typography>
              </Box>

              <Divider flexItem />

              {/* Delete Account */}
              <Button
                variant="outlined"
                color="error"
                startIcon={<Icon icon="mdi:trash-outline" />}
                sx={{
                  mt: 1,
                }}
              >
                Hapus Akun
              </Button>
            </Stack>
          </Grid>

          {/* MIDDLE COLUMN */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <RHFTextField name="username" label="Username" disabled />
              <RHFTextField name="email" label="Email Address" disabled />
              <RHFTextField name="phone" label="No. Handphone" disabled />
              <RHFTextField name="tenantId" label="ID Tenant" disabled />
              <RHFTextField name="owner" label="Nama Pemilik Usaha" disabled />
              <RHFTextField name="bussinessType" label="Bidang Usaha" disabled />
              <RHFTextField name="address" label="Address" disabled />
              <RHFTextField name="city" label="Kota" disabled />
            </Stack>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <RHFTextField name="aboutTenant" label="Tentang" multiline rows={4} disabled />
              <RHFTextField name="registDate" label="Tanggal Registrasi" disabled />
              <RHFTextField name="bussinessName" label="Nama Usaha" disabled />
              <RHFTextField name="bussinessAge" label="Lama Beroperasi" disabled />
              <RHFTextField name="province" label="Provinsi" disabled />
              <RHFTextField name="district" label="Kecamatan" disabled />
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </Box>
  );
}

function CurrentSubscriptionTab() {
  return (
    <Box sx={{ p: 3 }}>
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
              <Typography variant="subtitle2" color="text.secondary">
                Subscription Plan
              </Typography>

              <Typography variant="h6" sx={{ mt: 0.5 }}>
                Basic · Monthly
              </Typography>

              <Stack spacing={1} mt={2}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon icon="mdi:calendar-range-outline" width={18} />
                  <Typography variant="body2" color="text.secondary">
                    1 Jan 2025 – 31 Jan 2025
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon icon="mdi:timer-sand" width={18} />
                  <Typography variant="body2" color="text.secondary">
                    10 days remaining
                  </Typography>
                  <Tooltip title="This subscription will expire soon" arrow>
                    <Icon icon="simple-line-icons:info" width={18} />
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>

            {/* RIGHT STATUS */}
            <Chip label="Active" color="success" size="small" sx={{ mt: 0.5 }} />
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
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Account Status
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman status akun akan ditampilkan di sini
      </Typography>
    </Box>
  );
}

function SubscriptionHistoryTab() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Subscription History
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman riwayat subscription akan ditampilkan di sini
      </Typography>
    </Box>
  );
}

function ActivityLogTab() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Activity Log
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman log aktivitas akan ditampilkan di sini
      </Typography>
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
