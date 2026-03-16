import { Controller, useFormContext } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import { TextField, InputAdornment } from '@mui/material';

export default function RHFNumberFormat({ name, label }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={0}
      render={({ field, fieldState: { error } }) => (
        <NumericFormat
          customInput={TextField}
          label={label}
          value={field.value ?? ''}
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          decimalScale={0}
          allowLeadingZeros={false}
          onValueChange={(values) => {
            field.onChange(values.floatValue ?? 0);
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
          }}
          error={!!error}
          helperText={error?.message}
          fullWidth
        />
      )}
    />
  );
}
