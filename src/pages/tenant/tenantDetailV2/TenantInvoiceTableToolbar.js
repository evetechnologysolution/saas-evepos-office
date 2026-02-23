import PropTypes from 'prop-types';
import { Stack, InputAdornment, TextField, MenuItem } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

TenantInvoiceTableToolbar.propTypes = {
  filterSearch: PropTypes.string,
  onFilterSearch: PropTypes.func,
  onEnter: PropTypes.func,
  optionsStatus: PropTypes.arrayOf(PropTypes.string),
  filterStatus: PropTypes.string,
  onFilterStatus: PropTypes.func,
};

export default function TenantInvoiceTableToolbar({
  filterSearch,
  onFilterSearch,
  onEnter,
  optionsStatus,
  filterStatus,
  onFilterStatus,
}) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5 }}>
      <TextField
        fullWidth
        select
        label="Payment Status"
        value={filterStatus}
        onChange={onFilterStatus}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsStatus.map((option, i) => (
          <MenuItem
            key={i}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth
        value={filterSearch}
        onChange={(event) => onFilterSearch(event.target.value)}
        onKeyDown={onEnter}
        placeholder="Search Invoice..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon={'eva:search-fill'} sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
}
