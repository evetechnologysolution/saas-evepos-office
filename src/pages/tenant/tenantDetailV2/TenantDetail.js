// @mui
import { Container, Typography } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// sections
import TenantDetailForm from './TenantDetailForm';

// ----------------------------------------------------------------------

export default function TenantDetail() {
  const { themeStretch } = useSettings();

  return (
    <Page title="Tenant Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h6" mx={1}>
          Detail Tenant
        </Typography>

        <TenantDetailForm />
      </Container>
    </Page>
  );
}
