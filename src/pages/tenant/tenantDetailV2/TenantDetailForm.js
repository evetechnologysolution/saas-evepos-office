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
} from '@mui/material';
import { Icon } from '@iconify/react';
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
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tenant Information
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman informasi tenant akan ditampilkan di sini
      </Typography>
    </Box>
  );
}

function CurrentSubscriptionTab() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Current Subscription
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Halaman subscription saat ini akan ditampilkan di sini
      </Typography>
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
