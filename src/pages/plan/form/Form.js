/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Grid,
  Stack,
  Button,
  Typography,
  Divider,
  TableCell,
  TableRow,
  TableBody,
  TableHead,
  Table,
  TableContainer,
  Paper,
  Box,
  alpha,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
// routes
import { useNavigate } from 'react-router';
import Iconify from 'src/components/Iconify';
import { fDateTime } from 'src/utils/formatTime';
import { FormProvider, RHFTextField, RHFSwitch, RHFNumberFormat, RHFCheckbox } from '../../../components/hook-form';
import renderChanges from '../../../utils/handleRenderAudit';
import ModuleRow from './ModuleRow';

// ----------------------------------------------------------------------

PlanForm.propTypes = {
  methods: PropTypes.any,
  onSubmit: PropTypes.any,
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

export const MODULES = [
  { key: 'dashboard', label: 'Dashboard — Revenue, Donation, Sales card' },
  { key: 'dashboardB', label: 'Dashboard — Daily Sales' },
  { key: 'dashboardC', label: 'Dashboard — Payment Method' },
  { key: 'dashboardD', label: 'Dashboard — Popular Product' },
  { key: 'dashboardE', label: 'Dashboard — Sales Report' },

  { key: 'pos', label: 'POS' },
  { key: 'orders', label: 'Orders' },
  { key: 'pickup', label: 'Pickup' },
  { key: 'scan_orders', label: 'Scan Orders' },

  { key: 'sales_report', label: 'Sales Report' },
  { key: 'popular_product', label: 'Popular Product' },
  { key: 'payment_overview', label: 'Payment Overview' },

  { key: 'category', label: 'Category' },
  { key: 'subcategory', label: 'Subcategory' },
  { key: 'product', label: 'Product' },
  { key: 'variant', label: 'Variant' },
  { key: 'promotion', label: 'Promotion' },

  { key: 'user', label: 'User' },
];

// Helper function untuk format label
const formatLabel = (key) => {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Helper function untuk format value
const formatValue = (value) => {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object' && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
};

// Helper function untuk get changed fields
const getChangedFields = (before, after, parentKey = '') => {
  const changes = [];

  if (!before || !after) return changes;

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  allKeys.forEach((key) => {
    // Skip metadata fields
    if (['_id', '__v', 'createdAt', 'updatedAt', 'id'].includes(key)) return;

    const fullKey = parentKey ? `${parentKey}.${key}` : key;
    const beforeVal = before[key];
    const afterVal = after[key];

    // Handle nested objects (but not too deep)
    if (
      typeof beforeVal === 'object' &&
      typeof afterVal === 'object' &&
      beforeVal !== null &&
      afterVal !== null &&
      !Array.isArray(beforeVal) &&
      !Array.isArray(afterVal) &&
      !parentKey.includes('.') // Only 1 level deep
    ) {
      changes.push(...getChangedFields(beforeVal, afterVal, key));
    } else if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      changes.push({
        key: fullKey,
        before: beforeVal,
        after: afterVal,
      });
    }
  });

  return changes;
};

const ChangeItem = ({ log, theme }) => {
  const changes =
    log.changes?.before && log.changes?.after ? getChangedFields(log.changes.before, log.changes.after) : [];

  const actionColor = {
    CREATE: theme.palette.success.main,
    UPDATE: theme.palette.info.main,
    DELETE: theme.palette.error.main,
    READ: theme.palette.grey[400],
  };

  return (
    <Stack
      spacing={1}
      sx={{
        pl: 2,
        py: 1.5,
        borderLeft: `3px solid ${actionColor[log.action] || theme.palette.grey[400]}`,
        backgroundColor: alpha(actionColor[log.action] || theme.palette.grey[500], 0.04),
        borderRadius: '0 8px 8px 0',
      }}
    >
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            label={log.action}
            size="small"
            color={
              log.action === 'CREATE'
                ? 'success'
                : log.action === 'UPDATE'
                ? 'info'
                : log.action === 'DELETE'
                ? 'error'
                : 'default'
            }
            sx={{
              height: 20,
              fontSize: '0.65rem',
              fontWeight: 700,
            }}
          />
          <Typography variant="caption" fontWeight={600}>
            {log.actor?.fullname || log.actor?.username || 'System'}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="caption" color="text.secondary">
        {fDateTime(log.accessedAt)}
      </Typography>

      {/* Show changes for UPDATE action */}
      {log.action === 'UPDATE' && changes.length > 0 && (
        <Box sx={{ mt: 1 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              fontWeight: 600,
              color: 'text.secondary',
              display: 'block',
              mb: 0.5,
            }}
          >
            Changes:
          </Typography>
          <Stack spacing={0.5}>
            {changes.slice(0, 3).map((change, idx) => (
              <Box
                key={idx}
                sx={{
                  pl: 1,
                  fontSize: '0.7rem',
                }}
              >
                <Typography variant="caption" component="div" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  <strong>{formatLabel(change.key)}:</strong>{' '}
                  <Box
                    component="span"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'error.main',
                      opacity: 0.7,
                    }}
                  >
                    {formatValue(change.before)}
                  </Box>
                  {' → '}
                  <Box
                    component="span"
                    sx={{
                      fontWeight: 600,
                      color: 'success.main',
                    }}
                  >
                    {formatValue(change.after)}
                  </Box>
                </Typography>
              </Box>
            ))}
            {changes.length > 3 && (
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.disabled',
                  fontStyle: 'italic',
                  pl: 1,
                }}
              >
                +{changes.length - 3} more changes
              </Typography>
            )}
          </Stack>
        </Box>
      )}

      {/* Show created data summary for CREATE action */}
      {log.action === 'CREATE' && log.changes?.after && (
        <Box sx={{ mt: 0.5 }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.7rem',
              color: 'success.main',
              fontWeight: 600,
            }}
          >
            ✓ Record created successfully
          </Typography>
        </Box>
      )}
    </Stack>
  );
};

export default function PlanForm({ methods, onSubmit, type, isSubmitting, auditData = [] }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const button_label = type === 'create' ? 'Simpan Data' : 'Simpan Perubahan';

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={4}>
              {/* Header */}
              <Stack spacing={0.5}>
                <Typography variant="h6">Informasi Paket</Typography>
                <Typography variant="body2" color="text.secondary">
                  Atur detail harga dan status paket langganan yang akan ditampilkan ke user.
                </Typography>
              </Stack>

              {/* Nama & Status */}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <RHFTextField
                    name="name"
                    label="Nama Plan"
                    placeholder="Contoh: Basic, Pro, Enterprise"
                    autoComplete="off"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <RHFSwitch name="isActive" label="Aktifkan Plan" />
                </Grid>
              </Grid>

              <Divider />

              {/* Harga */}
              <Stack spacing={1}>
                <Typography variant="subtitle1">Harga Langganan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Masukkan harga dalam Rupiah.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <RHFNumberFormat name="price.monthly" label="Harga Bulanan" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFNumberFormat name="price.yearly" label="Harga Tahunan" />
                  </Grid>
                </Grid>
              </Stack>

              {/* Diskon */}
              <Stack spacing={1}>
                <Typography variant="subtitle1">Diskon</Typography>
                <Typography variant="body2" color="text.secondary">
                  Opsional — isi jika ingin memberikan potongan harga.
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <RHFNumberFormat name="discount.monthly" label="Diskon Bulanan" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <RHFNumberFormat name="discount.yearly" label="Diskon Tahunan" />
                  </Grid>
                </Grid>
              </Stack>

              {/* Harga */}
              <Stack spacing={1}>
                <Typography variant="subtitle1">Target Pelanggan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih target pelanggan yang akan mendapatkan potongan harga.
                </Typography>

                <RHFCheckbox label="All Customer" name="selectedCustomer.allCustomer" />
                <RHFCheckbox label="New Customer" name="selectedCustomer.newCustomer" />
                <RHFCheckbox label="Old Customer" name="selectedCustomer.oldCustomer" />
                <RHFCheckbox label="Auto Renewal Customer" name="selectedCustomer.autoRenewalCustomer" />
              </Stack>

              <Divider />

              {/* Deskripsi */}
              <Stack spacing={1}>
                <Typography variant="subtitle1">Deskripsi Plan</Typography>
                <Typography variant="body2" color="text.secondary">
                  Jelaskan benefit utama plan ini secara singkat.
                </Typography>

                <RHFTextField
                  name="description"
                  label="Deskripsi"
                  multiline
                  rows={3}
                  placeholder="Contoh: Cocok untuk individu atau UMKM dengan kebutuhan dasar."
                />
              </Stack>
              <Stack spacing={1}>
                <Typography variant="subtitle1">Akses Modul</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tentukan modul yang tersedia dan jumlah kuota pada plan ini.
                </Typography>

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Modul</TableCell>
                        <TableCell align="center">Aktif</TableCell>
                        <TableCell align="center">Max Data</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {MODULES.map((module) => {
                        return <ModuleRow key={module.key} moduleKey={module.key} label={module.label} />;
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
            </Stack>

            {/* Actions */}
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 4 }} gap={1}>
              <Button variant="outlined" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {button_label}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Audit Trail Card */}
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {/* Header */}
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:history-bold-duotone" width={24} sx={{ color: 'primary.main' }} />
                  <Typography variant="h6">Audit Trail</Typography>
                </Stack>

                <Divider />

                {/* Audit Trail */}
                {Array.isArray(auditData) && auditData.length > 0 && (
                  <>
                    <Stack spacing={3}>
                      {auditData.map((audit, index) => (
                        <Stack key={audit._id || index} spacing={1.5}>
                          {/* Header */}
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                backgroundColor: alpha(theme.palette.info.main, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify
                                icon={
                                  audit.action === 'CREATE'
                                    ? 'solar:add-circle-bold'
                                    : audit.action === 'DELETE'
                                    ? 'solar:trash-bin-trash-bold'
                                    : 'solar:pen-bold'
                                }
                                width={18}
                                sx={{ color: 'info.main' }}
                              />
                            </Box>

                            <Typography variant="subtitle2" color="text.secondary">
                              {audit.action}
                            </Typography>
                          </Stack>

                          {/* Content */}
                          <Stack spacing={0.5} pl={5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify icon="solar:user-circle-bold" width={16} sx={{ color: 'text.secondary' }} />
                              <Typography variant="body2">
                                {audit.actor?.fullname || audit.actor?.username || 'System'}
                              </Typography>
                            </Stack>

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Iconify icon="solar:calendar-bold" width={16} sx={{ color: 'text.secondary' }} />
                              <Typography variant="caption" color="text.secondary">
                                {fDateTime(audit.accessedAt)}
                              </Typography>
                            </Stack>

                            {/* Changes */}
                            {audit.changes?.before && (
                              <Box
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  borderRadius: 1,
                                  backgroundColor: alpha(theme.palette.grey[500], 0.08),
                                }}
                              >
                                <Typography variant="caption" color="text.secondary">
                                  Changes:
                                </Typography>
                                <Stack spacing={0.5} mt={0.5}>
                                  {renderChanges(audit.changes.before, audit.changes.after)}
                                </Stack>
                              </Box>
                            )}
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </>
                )}

                {/* Total Updates Badge */}
                {auditData &&
                  auditData.length > 0 &&
                  (() => {
                    const totalUpdates = auditData.filter((log) => log.action === 'UPDATE').length;
                    if (totalUpdates === 0) return null;

                    return (
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          textAlign: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Total Changes: <strong>{totalUpdates}</strong>
                        </Typography>
                      </Box>
                    );
                  })()}

                {/* Empty State */}
                {(!auditData || auditData.length === 0) && (
                  <Stack alignItems="center" py={3} spacing={1}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: alpha(theme.palette.grey[500], 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Iconify icon="solar:clipboard-list-bold-duotone" width={32} sx={{ color: 'text.disabled' }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Audit trail will appear after saving
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Card>

            {/* Activity History */}
            {auditData && auditData.length > 0 && (
              <Card sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Iconify icon="solar:clock-circle-bold-duotone" width={20} sx={{ color: 'warning.main' }} />
                      <Typography variant="subtitle2">Activity History</Typography>
                    </Stack>
                    <Chip
                      label={auditData.length}
                      size="small"
                      color="default"
                      sx={{ height: 20, fontSize: '0.75rem' }}
                    />
                  </Stack>

                  <Stack spacing={2}>
                    {auditData
                      .slice()
                      .sort((a, b) => new Date(b.accessedAt) - new Date(a.accessedAt))
                      .slice(0, 5)
                      .map((log, index) => (
                        <ChangeItem key={log._id || index} log={log} theme={theme} />
                      ))}
                  </Stack>

                  {auditData.length > 5 && (
                    <Button
                      size="small"
                      variant="outlined"
                      fullWidth
                      endIcon={<Iconify icon="eva:arrow-ios-forward-fill" />}
                      onClick={() => {
                        // Handle view all history
                        console.log('View all history');
                      }}
                    >
                      View All {auditData.length} Activities
                    </Button>
                  )}
                </Stack>
              </Card>
            )}

            {/* Quick Info Card */}
            <Card sx={{ p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.04) }}>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'primary.main' }} />
                  <Typography variant="subtitle2">Quick Tips</Typography>
                </Stack>

                <Stack spacing={1.5}>
                  <Stack direction="row" spacing={1.5}>
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={18}
                      sx={{ color: 'success.main', flexShrink: 0, mt: 0.25 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Harga tahunan biasanya lebih murah 15-20% dari bulanan
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={18}
                      sx={{ color: 'success.main', flexShrink: 0, mt: 0.25 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Non-aktifkan plan yang sudah tidak tersedia
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.5}>
                    <Iconify
                      icon="solar:check-circle-bold"
                      width={18}
                      sx={{ color: 'success.main', flexShrink: 0, mt: 0.25 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Pastikan minimal 1 modul aktif per plan
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
