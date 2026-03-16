import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, TableRow, TableCell, Link } from '@mui/material';
// components
import Label from '../../../components/Label';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';

// ----------------------------------------------------------------------

SubscriptionInvoiceTableRow.propTypes = {
  row: PropTypes.object,
  number: PropTypes.number,
  onDetailRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function SubscriptionInvoiceTableRow({ row, number, onDetailRow }) {
  const theme = useTheme();

  const { invoiceId, createdAt, serviceName, billedAmount, status, payment } = row;

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
      <TableCell align="center">{numberWithCommas(number)}</TableCell>

      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell align="left">
        <Link component="button" variant="subtitle2" underline="hover" onClick={() => onDetailRow()}>
          {invoiceId || '-'}
        </Link>
      </TableCell>

      <TableCell align="left">{serviceName || 'TRIAL'}</TableCell>

      <TableCell align="center">Rp. {numberWithCommas(billedAmount || 0)}</TableCell>

      <TableCell align="center">{payment?.paidAt ? formatDate2(payment?.paidAt) : '-'}</TableCell>

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
    </CustomTableRow>
  );
}
