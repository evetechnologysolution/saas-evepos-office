import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, TableRow, TableCell } from '@mui/material';
// components
import Label from '../../../components/Label';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';

// ----------------------------------------------------------------------

TenantInvoiceTableRow.propTypes = {
  row: PropTypes.object,
  onDetailRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function TenantInvoiceTableRow({ row }) {
  const theme = useTheme();

  const { invoiceId, createdAt, amount, status, payment, serviceRef } = row;

  const statusColor = (val = '') => {
    switch (val) {
      case 'paid':
        return 'success';
      case 'unpaid':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell align="center">{payment?.paidAt ? formatDate2(payment?.paidAt) : '-'}</TableCell>

      <TableCell align="left">{invoiceId || '-'}</TableCell>

      <TableCell align="center">{serviceRef?.name || 'TRIAL'}</TableCell>

      <TableCell align="center" sx={{ textTransform: 'capitalize' }}>
        {payment?.channel || '-'}
      </TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={statusColor(status)}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="center">Rp. {numberWithCommas(amount)}</TableCell>
    </CustomTableRow>
  );
}
