import { Opacity } from '@mui/icons-material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';


export const BootstrapTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: alpha(theme.palette.common.black, 0.8),
    color: theme.palette.common.white,
    fontSize: 16,
    padding: '8px 12px',
    maxWidth: 300,
  },
}));