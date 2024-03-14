import { Box, SxProps, TableCell, TableCellProps, Typography, TypographyProps, useTheme } from '@mui/material';

interface TableCellForStatProps extends TableCellProps {
  secondaryText?: string;
  tableCell?: {
    sx?: SxProps;
  };
}

export const TableCellForStat: React.FC<TableCellForStatProps> = ({
  children,
  width,
  secondaryText,
  tableCell,
  ...props
}) => {
  const theme = useTheme();

  return (
    <TableCell width={width} padding={'none'} sx={tableCell?.sx} {...props}>
      <Box padding={'16px'} boxSizing={'border-box'} height={'inherit'}>
        {children}
        {secondaryText && (
          <Typography
            textAlign={'right'}
            variant={'body2'}
            sx={{
              color: theme.palette.text.secondary,
            }}
          >
            {secondaryText}
          </Typography>
        )}
      </Box>
    </TableCell>
  );
};

export const TypographyForStatTableCell: React.FC<TypographyProps> = ({ children, variant, ...props }) => {
  const theme = useTheme();

  return (
    <Typography
      align={'right'}
      width={'100%'}
      variant={variant ?? 'body2Num'}
      color={theme.palette.text.primary}
      {...props}
    >
      {children}
    </Typography>
  );
};
