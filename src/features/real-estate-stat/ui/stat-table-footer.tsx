import { TableFooter, TableRow, useTheme } from '@mui/material';
import React from 'react';
import { FirstTableCell } from './first-table-cell';
import { TableCellForStat, TypographyForStatTableCell } from './table-cell-for-stat';

type StatTableFooterProps = {
  cells: string[];
};

export const StatTableFooter: React.FC<StatTableFooterProps> = ({ cells }) => {
  const theme = useTheme();

  return (
    <TableFooter>
      <TableRow
        sx={{
          '&:last-child td, &:last-child th': {
            border: 0,
            borderTop: `1px solid ${theme.custom.border.default}`,
          },
        }}
      >
        <FirstTableCell component='th' scope='row'></FirstTableCell>
        {cells.map((cellValue) => (
          <TableCellForStat children={<TypographyForStatTableCell variant={'body2NumMedium'} children={cellValue} />} />
        ))}
      </TableRow>
    </TableFooter>
  );
};
