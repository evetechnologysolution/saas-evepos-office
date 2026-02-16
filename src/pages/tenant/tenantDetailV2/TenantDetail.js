import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// sections
import TenantDetailForm from './TenantDetailForm';

// ----------------------------------------------------------------------

export default function TenantDetail() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  return (
    <Page title="Tenant Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" mx={1}>
            Detail Tenant
          </Typography>
          <Button variant="contained" onClick={() => navigate(PATH_DASHBOARD.tenant.root)}>
            Back
          </Button>
        </Stack>

        <TenantDetailForm />
      </Container>
    </Page>
  );
}
