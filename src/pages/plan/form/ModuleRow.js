/* eslint-disable react/prop-types */
import { useWatch } from 'react-hook-form';
import { TableRow, TableCell } from '@mui/material';
import { RHFTextField, RHFSwitch } from 'src/components/hook-form';

const ModuleRow = ({ moduleKey, label }) => {
  const enabled = useWatch({
    name: `modules.${moduleKey}.enabled`,
  });

  return (
    <TableRow>
      <TableCell>{label}</TableCell>

      <TableCell align="center">
        <RHFSwitch name={`modules.${moduleKey}.enabled`} />
      </TableCell>

      <TableCell align="center" sx={{ width: 120 }}>
        <RHFTextField
          name={`modules.${moduleKey}.qty`}
          type="number"
          size="small"
          disabled={!enabled}
          inputProps={{ min: 0 }}
        />
      </TableCell>
    </TableRow>
  );
};

export default ModuleRow;
