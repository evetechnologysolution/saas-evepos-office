// @mui
import { Container } from '@mui/material';
// routes
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { handleMutationFeedback } from 'src/utils/mutationfeedback';
import { useNavigate } from 'react-router';
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
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: schema.getDefault(),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    await handleMutationFeedback(create.mutateAsync(data), {
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
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        />
      </Container>
    </Page>
  );
}
