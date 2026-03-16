// @mui
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from 'react-query';
import { LoadingButton } from '@mui/lab';
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import CategoryForm from './form/Form';
import schema from './schema';
import useCategory from './service/useCategory';
import axios from '../../utils/axios';

// ----------------------------------------------------------------------
export default function LibraryCategoryCreate() {
  const { themeStretch } = useSettings();
  const { update, getById } = useCategory();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const [openConfirm, setOpenConfirm] = useState(false);
  const [pendingData, setPendingData] = useState(null);

  const { data: categoryById, isSuccess: isSuccessById, isLoading: loadingCategoryById } = getById(id);

  const { data: auditData, isLoading: loadingAuditData } = useQuery({
    queryKey: ['plan-history', id],
    queryFn: async () => {
      const res = await axios.get(`/audit/entity/Services/${id}`);
      return res.data;
    },
  });

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
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    if (!isSuccessById) return;

    reset(categoryById);
  }, [isSuccessById, categoryById, reset]);

  const onPreSubmit = (data) => {
    setPendingData(data);
    setOpenConfirm(true);
  };

  const onSubmit = async () => {
    await handleMutationFeedback(update.mutateAsync({ id, payload: pendingData }), {
      successMsg: 'Plan berhasil disimpan!',
      errorMsg: 'Gagal menyimpan plan!',
      onSuccess: () => navigate('/dashboard/plan'),
      enqueueSnackbar,
    });
  };

  return (
    <Page title="Plan: Edit">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Edit Plan"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Library', href: PATH_DASHBOARD.library.root },
            { name: 'Category', href: PATH_DASHBOARD.library.category },
            { name: 'New' },
          ]}
        />
        {loadingCategoryById ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <CategoryForm
            type="edit"
            methods={methods}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onPreSubmit, (e) => console.log(e))}
            auditData={auditData}
            loadingAuditData={loadingAuditData}
          />
        )}
      </Container>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Konfirmasi</DialogTitle>

        <DialogContent>
          <DialogContentText>Apakah Anda yakin data plan sudah benar dan ingin menyimpannya?</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Batal</Button>
          <LoadingButton onClick={onSubmit} variant="contained" autoFocus loading={update.isLoading}>
            Simpan
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Page>
  );
}
