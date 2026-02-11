// @mui
import { Box, CircularProgress, Container } from '@mui/material';
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useQuery } from 'react-query';
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

  const onSubmit = async (data) => {
    await handleMutationFeedback(update.mutateAsync({ id, payload: data }), {
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
            onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            auditData={auditData}
            loadingAuditData={loadingAuditData}
          />
        )}
      </Container>
    </Page>
  );
}
