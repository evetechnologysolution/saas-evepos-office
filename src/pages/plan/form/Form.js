/* eslint-disable react/prop-types */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
// @mui
import { LoadingButton } from '@mui/lab';
import { Card, Grid, Stack, Button, Typography, Divider } from '@mui/material';
// routes
import { useNavigate } from 'react-router';
import { FormProvider, RHFTextField, RHFSwitch, RHFNumberFormat } from '../../../components/hook-form';

// ----------------------------------------------------------------------

PlanForm.propTypes = {
  methods: PropTypes.any,
  onSubmit: PropTypes.any,
  type: PropTypes.string,
  isSubmitting: PropTypes.bool,
};

export default function PlanForm({ methods, onSubmit, type, isSubmitting }) {
  const navigate = useNavigate();
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
      </Grid>
    </FormProvider>
  );
}
