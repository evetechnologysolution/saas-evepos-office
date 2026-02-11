// @mui
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// routes
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import Form from './form/Form';
import schema from './schema';
import useCategory from './service/useCategory';

// ----------------------------------------------------------------------

export default function LibraryCategoryCreate() {
  const { themeStretch } = useSettings();
  const { create } = useCategory();
  const { enqueueSnackbar } = useSnackbar();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);
  const navigate = useNavigate();

  const createModuleDefault = () => ({
    enabled: false,
    qty: 0,
  });

  const defaultValues = {
    name: '',
    isActive: true,

    price: {
      monthly: 0,
      yearly: 0,
    },

    selectedCustomer: {
      allCustomer: false,
      newCustomer: false,
      oldCustomer: false,
      autoRenewalCustomer: false,
    },

    discount: {
      monthly: 0,
      yearly: 0,
    },

    description: '',

    modules: {
      dashboard: createModuleDefault(),
      dashboardB: createModuleDefault(),
      dashboardC: createModuleDefault(),
      dashboardD: createModuleDefault(),
      dashboardE: createModuleDefault(),
      pos: createModuleDefault(),
      orders: createModuleDefault(),
      pickup: createModuleDefault(),
      scan_orders: createModuleDefault(),

      sales_report: createModuleDefault(),
      popular_product: createModuleDefault(),
      payment_overview: createModuleDefault(),

      category: createModuleDefault(),
      subcategory: createModuleDefault(),
      product: createModuleDefault(),
      variant: createModuleDefault(),
      promotion: createModuleDefault(),

      user: createModuleDefault(),
    },
  };

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting },
    watch,
    control,
  } = methods;

  const formState = watch();

  const allCustomer = useWatch({ name: 'selectedCustomer.allCustomer', control });
  const newCustomer = useWatch({ name: 'selectedCustomer.newCustomer', control });
  const oldCustomer = useWatch({ name: 'selectedCustomer.oldCustomer', control });
  const autoRenewalCustomer = useWatch({
    name: 'selectedCustomer.autoRenewalCustomer',
    control,
  });

  useEffect(() => {
    if (allCustomer === true) {
      setValue('selectedCustomer.newCustomer', true);
      setValue('selectedCustomer.oldCustomer', true);
      setValue('selectedCustomer.autoRenewalCustomer', true);
    }

    if (allCustomer === false) {
      setValue('selectedCustomer.newCustomer', false);
      setValue('selectedCustomer.oldCustomer', false);
      setValue('selectedCustomer.autoRenewalCustomer', false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allCustomer]);

  useEffect(() => {
    const allChecked = newCustomer && oldCustomer && autoRenewalCustomer;

    // HANYA update allCustomer kalau nilainya beda
    setValue('selectedCustomer.allCustomer', allChecked);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCustomer, oldCustomer, autoRenewalCustomer]);

  const onPreSubmit = (data) => {
    setPendingData(data);
    setOpenConfirm(true);
  };

  const onSubmit = async () => {
    await handleMutationFeedback(create.mutateAsync(pendingData), {
      successMsg: 'Plan berhasil disimpan!',
      errorMsg: 'Gagal menyimpan plan!',
      onSuccess: () => navigate('/dashboard/plan'),
      enqueueSnackbar,
    });
  };

  return (
    <Page title="Plan: New">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="New Plan"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Category', href: PATH_DASHBOARD.library.category },
            { name: 'New' },
          ]}
        />

        <Form
          type="create"
          methods={methods}
          isSubmitting={isSubmitting}
          formState={formState}
          onSubmit={handleSubmit(onPreSubmit, (e) => console.log(e))}
        />
      </Container>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Konfirmasi</DialogTitle>

        <DialogContent>
          <DialogContentText>Apakah Anda yakin data plan sudah benar dan ingin menyimpannya?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Batal</Button>
          <LoadingButton onClick={onSubmit} variant="contained" autoFocus loading={create.isLoading}>
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
