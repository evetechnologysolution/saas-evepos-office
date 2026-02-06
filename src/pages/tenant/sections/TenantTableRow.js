import { useState } from 'react';
import PropTypes from 'prop-types';
import { paramCase } from 'change-case';
import { useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  styled,
  // Button,
  Stack,
  TableRow,
  TableCell,
  Link,
  Typography,
  MenuItem,
} from '@mui/material';
import { TableMoreMenu } from '../../../components/table';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
// hooks
import useAuth from '../../../hooks/useAuth';
// utils
import { formatDate2 } from '../../../utils/getData';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';

// ----------------------------------------------------------------------

TenantTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const CustomTableRow = styled(TableRow)(() => ({
  '&.MuiTableRow-hover:hover': {
    // boxShadow: "inset 8px 0 0 #fff, inset -8px 0 0 #fff",
    borderRadius: '8px',
  },
}));

export default function TenantTableRow({ row, onEditRow, onDeleteRow }) {
  const theme = useTheme();
  const navigate = useNavigate();

  const { user } = useAuth();

  const { _id, tenantId, createdAt, ownerName, businessName, phone, email, status, subsRef } = row;

  const isActive = (val = '') => {
    return ['active', 'trial'].includes(val);
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

  const [openAction, setOpenAction] = useState(null);

  const handleOpenAction = (event) => {
    setOpenAction(event.currentTarget);
  };

  const handleCloseAction = () => {
    setOpenAction(null);
  };

  return (
    <CustomTableRow hover>
      <TableCell align="center">{formatDate2(createdAt)}</TableCell>

      <TableCell align="left">
        <Stack direction="column" alignItems="left" justifyContent="left">
          <div>
            <Link
              component="button"
              variant="subtitle2"
              underline="hover"
              onClick={() => navigate(PATH_DASHBOARD.tenant.detail(paramCase(_id)))}
            >
              {tenantId}
            </Link>
          </div>
          <div>
            <Label
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              color={statusColor(status)}
              sx={{ textTransform: 'capitalize' }}
            >
              {status}
            </Label>
          </div>
        </Stack>
      </TableCell>

      <TableCell align="left">{ownerName}</TableCell>

      <TableCell align="left">{businessName}</TableCell>

      <TableCell align="left">
        <p>{phone}</p>
        <p>{email}</p>
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
          {subsRef?.serviceRef?.name || 'TRIAL'}
          <Typography variant="caption">
            Expiry : {subsRef?.endDate ? formatDate2(subsRef?.endDate) : '-'}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={subsColor(subsRef?.status)}
          sx={{ textTransform: 'capitalize' }}
        >
          {subsRef?.status}
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
                  // onEditRow();
                  handleCloseAction();
                }}
              >
                <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
                Detail
              </MenuItem>
              <MenuItem
                sx={{ color: isActive(subsRef?.status) ? '#B78103' : '#229A16' }}
                onClick={() => {
                  handleCloseAction();
                }}
              >
                <Iconify icon="typcn:warning-outline" sx={{ width: 24, height: 24 }} />
                {isActive(subsRef?.status) ? 'Non-Aktifkan' : 'Aktifkan'}
              </MenuItem>
              {/* {user?.role === 'super admin' && (
                <MenuItem
                  sx={{ color: 'red' }}
                  onClick={() => {
                    onDeleteRow();
                    handleCloseAction();
                  }}
                >
                  <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
                  Delete
                </MenuItem>
              )} */}
            </>
          }
        />
        {/* <Stack direction="row" justifyContent="center" gap={1}>
          <Button
            title="Edit"
            variant="contained"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onEditRow();
            }}
          >
            <Iconify icon="eva:edit-outline" sx={{ width: 24, height: 24 }} />
          </Button>
          <Button
            title="Delete"
            variant="contained"
            color="error"
            sx={{ p: 0, minWidth: 35, height: 35 }}
            onClick={() => {
              onDeleteRow();
            }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ width: 24, height: 24 }} />
          </Button>
        </Stack> */}
      </TableCell>
    </CustomTableRow>
  );
}
