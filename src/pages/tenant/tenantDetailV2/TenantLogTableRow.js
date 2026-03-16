import PropTypes from 'prop-types';
// @mui
import { styled, TableRow, TableCell } from '@mui/material';
// utils
import { formatDate2, numberWithCommas } from '../../../utils/getData';

// ----------------------------------------------------------------------

TenantLogTableRow.propTypes = {
  row: PropTypes.object,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function TenantLogTableRow({ row, number }) {
  const { createdAt, log, notes, updatedBy } = row;

  return (
    <CustomTableRow hover>
      <TableCell align="center">{numberWithCommas(number)}</TableCell>

      <TableCell align="left">{formatDate2(createdAt)}</TableCell>

      <TableCell align="left">{log || '-'}</TableCell>
      <TableCell align="left">{notes || '-'}</TableCell>

      <TableCell align="left">{updatedBy?.fullname || '-'}</TableCell>
    </CustomTableRow>
  );
}
