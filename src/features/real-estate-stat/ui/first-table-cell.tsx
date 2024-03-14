import { TableCellProps, TableCell, Stack, useTheme, SxProps } from '@mui/material';

type FirstTableCellProps = TableCellProps & {
  stack?: {
    sx?: SxProps;
  };
};

export const FirstTableCell: React.FC<FirstTableCellProps> = ({ children, sx, stack, ...props }) => {
  const theme = useTheme();

  return (
    <TableCell component='th' scope='row' padding={'none'} {...props} sx={sx}>
      <Stack
        direction={'row'}
        padding={`${theme.custom.table.padding.py.md} ${theme.custom.base.module.second}`}
        alignItems={'flex-start'}
        gap={theme.custom.base.module.first}
        flex={'1 0 0'}
        boxSizing={'border-box'}
        height={'inherit'}
        sx={stack?.sx}
      >
        {children}
      </Stack>
    </TableCell>
  );
};
