// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import { TenantDetailForm } from './sections';

// ----------------------------------------------------------------------

export default function TenantDetail() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Tenant Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h6" mx={1}>
          Tenant Detail
        </Typography>

        <TenantDetailForm />
      </Container>
    </Page>
  );
}
