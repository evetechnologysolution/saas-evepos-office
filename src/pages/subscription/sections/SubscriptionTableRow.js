import { useState } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { styled, Stack, TableRow, TableCell, Link, Typography, MenuItem } from '@mui/material';
import { TableMoreMenu } from '../../../components/table';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
// utils
import { formatDate, formatDate2 } from '../../../utils/getData';

// ----------------------------------------------------------------------

SubscriptionTableRow.propTypes = {
  row: PropTypes.object,
  onDetailRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function SubscriptionTableRow({ row, onDetailRow }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const { _id, subsId, updatedAt, tenantRef, serviceName, status, endDate } = row;

  // const isActive = (val = '') => {
  //   return ['active', 'trial'].includes(val);
  // };

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

  const [openAction, setOpenAction] = useState(null);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(updatedAt)}</TableCell>

      <TableCell align="left">
        <Stack direction="column" alignItems="left" justifyContent="left">
          <div>
            <Link
              component="button"
              variant="subtitle2"
              underline="hover"
              onClick={() => navigate(`/dashboard/subscription/${paramCase(_id)}/detail`)}
            >
              {subsId}
            </Link>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="left">{tenantRef?.ownerName}</TableCell>

      <TableCell align="left">{tenantRef?.businessName}</TableCell>

      <TableCell align="left">
        <p>{tenantRef?.phone}</p>
        <p>{tenantRef?.email}</p>
      </TableCell>

      {/* <TableCell align="center">
        <Label
          variant={theme.palette.mode === "light" ? "ghost" : "filled"}
          color={statusColor(status)}
          sx={{ textTransform: "capitalize" }}
        >
          {status}
        </Label>
      </TableCell> */}

      <TableCell align="center">
        <Stack direction="column" alignItems="center" justifyContent="center">
          {serviceName || 'TRIAL'}
          <Typography variant="caption">Expiry : {endDate ? formatDate(endDate) : '-'}</Typography>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={subsColor(status)}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="center">
        <TableMoreMenu
          open={openAction}
          onOpen={handleOpenAction}
          onClose={handleCloseAction}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDetailRow();
                  handleCloseAction();
                }}
              >
                <Iconify icon="fluent:apps-list-detail-24-regular" sx={{ width: 24, height: 24 }} />
                Detail
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </CustomTableRow>
  );
}
