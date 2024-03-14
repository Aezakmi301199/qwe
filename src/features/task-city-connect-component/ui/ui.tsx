import { styled } from '@mui/material/styles';
import { Grid, Box, TableRow } from '@mui/material';

export const MainContainer = styled(Grid)(({ theme }) => ({
  display: 'flex',
  padding: `0px ${theme.custom.base.module.third} ${theme.custom.base.module.third} ${theme.custom.base.module.third}`,
  gap: theme.custom.base.module.second,
  flex: '1 0 0',
  justifyContent: 'center',
}));

export const TaskWidget = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  width: theme.custom.layout.column.container,
  gap: theme.custom.base.module.second,
}));

export const LayoutPageTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  maxWidth: theme.custom.layout.column.container,
  padding: `${theme.custom.base.module.third} 0px`,
  alignItems: 'center',
  gap: theme.custom.base.module.first,
  alignSelf: 'stretch',
}));

export const Text = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  gap: '8px',
  flex: '1 0 0',
}));

export const TaskRowTableContent = styled(TableRow)(({ theme }) => ({
  padding: `${theme.custom.table.padding.py.md} ${theme.custom.table.padding.py.md} ${theme.custom.table.padding.px}`,
}));

export const TaskTableCellContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '72px',
  alignItems: 'center',
  gap: theme.custom.base.module.second,
  padding: `${theme.custom.table.padding.py.md} 16px`,
  boxSizing: 'border-box',
}));
