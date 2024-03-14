import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const BodyColumnLayout = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flex: '1 0 0',
  alignSelf: 'stretch',
  minHeight: '95vh',
}));

export const BodyRowLayout = styled(Box)(() => ({
  overflowX: 'auto',
  display: 'flex',
  padding: '0px 24px',
  alignItems: 'flex-start',
  flex: '1 0 0',
  alignSelf: 'stretch',
}));

export const Menu = styled(Box)(({ theme }) => ({
  borderRadius: theme.custom.shape.border.radius.md,
  display: 'flex',
  padding: `24px 0px`,
  flexDirection: 'column',
  alignItems: 'flex-start',
  alignSelf: 'stretch',
  gap: theme.custom.base.module.second,
}));
