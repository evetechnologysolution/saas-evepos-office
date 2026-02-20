import { useNavigate } from 'react-router-dom';
// @mui
import { Container, Typography, Stack, Button } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import SubscriptionDetailForm from './sections/SubscriptionDetailForm';

// ----------------------------------------------------------------------

export default function TenantDetail() {
  const { themeStretch } = useSettings();
  const navigate = useNavigate();

  return (
    <Page title="Subscription Detail">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography variant="h6" mx={1}>
            Subscription Tenant
          </Typography>
          <Button variant="contained" onClick={() => navigate('/dashboard/subscription')}>
            Back
          </Button>
        </Stack>

        <SubscriptionDetailForm />
      </Container>
    </Page>
  );
}
