import PropTypes from 'prop-types';
import { Box, Card, Grid, Typography, alpha, useTheme } from '@mui/material';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const STATUS_CONFIG = [
  {
    value: 'open',
    label: 'Open',
    color: '#22c55e',
    icon: 'eva:checkmark-circle-2-outline',
    bgIcon: 'eva:radio-button-on-outline',
  },
  {
    value: 'progress',
    label: 'In Progress',
    color: '#f59e0b',
    icon: 'eva:loader-outline',
    bgIcon: 'eva:clock-outline',
  },
  {
    value: 'closed',
    label: 'Closed',
    color: '#ef4444',
    icon: 'eva:close-circle-outline',
    bgIcon: 'eva:slash-outline',
  },
];

// ----------------------------------------------------------------------

TicketStatusCards.propTypes = {
  // Pass an object like: { open: 12, progress: 5, closed: 30 }
  counts: PropTypes.shape({
    open: PropTypes.number,
    progress: PropTypes.number,
    closed: PropTypes.number,
  }),
  // Optional: highlight/filter active status
  activeStatus: PropTypes.string,
  onStatusClick: PropTypes.func,
};

export default function TicketStatusCards({ counts = {}, activeStatus, onStatusClick }) {
  const theme = useTheme();
  const total = (counts.open ?? 0) + (counts.progress ?? 0) + (counts.closed ?? 0);

  return (
    <Grid container spacing={2} sx={{ mb: 3, p: 3 }}>
      {/* Status Cards */}
      {STATUS_CONFIG.map((status) => {
        const count = counts[status.value] ?? 0;
        const isActive = activeStatus === status.value;
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

        return (
          <Grid item xs={12} sm={6} md={4} key={status.value}>
            <Card
              onClick={() => onStatusClick?.(status.value)}
              sx={{
                p: 2.5,
                cursor: onStatusClick ? 'pointer' : 'default',
                border: `1px solid`,
                borderColor: isActive ? status.color : alpha(theme.palette.text.primary, 0.08),
                bgcolor: isActive ? alpha(status.color, 0.06) : 'background.paper',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': onStatusClick
                  ? {
                      borderColor: status.color,
                      bgcolor: alpha(status.color, 0.05),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 24px ${alpha(status.color, 0.15)}`,
                    }
                  : {},
              }}
            >
              {/* Background decorative icon */}
              <Iconify
                icon={status.bgIcon}
                sx={{
                  position: 'absolute',
                  right: -10,
                  top: -10,
                  width: 80,
                  height: 80,
                  color: alpha(status.color, 0.07),
                }}
              />

              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700} lineHeight={1.2} sx={{ color: status.color }}>
                    {count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                    {status.label}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: alpha(status.color, 0.12),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Iconify icon={status.icon} sx={{ width: 22, height: 22, color: status.color }} />
                </Box>
              </Box>

              {/* Progress bar */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.disabled">
                    dari total tiket
                  </Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ color: status.color }}>
                    {percentage}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: alpha(status.color, 0.12),
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${percentage}%`,
                      borderRadius: 2,
                      bgcolor: status.color,
                      transition: 'width 0.6s ease',
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
