import { TableRow, TableCell, Stack, Box, SxProps } from '@mui/material';
import { theme } from '../../../app/providers/theme';
import { PositionSkeleton } from '../../../shared/ui-kit/skeleton/skeleton';
import { Skeleton } from '../../../shared/ui-kit/skeleton/skeleton';
import { ReactNode } from 'react';

type TableRowLoadingComponentProps = {
  width: string;
  countRows: number;
  skeleton?: ReactNode;
};

export const TableRowLoadingComponent: React.FC<TableRowLoadingComponentProps> = ({ width, countRows, skeleton }) => {
  const tableRows = Array.from({ length: countRows }, () => (
    <TableCell component='th' scope='row' padding={'none'} width={width}>
      <Box
        display={'flex'}
        flexDirection={'row'}
        padding={`${theme.custom.base.module.fifteenth} ${theme.custom.table.padding.px}`}
        justifyContent={'flex-end'}
        alignItems={'flex-start'}
        flex={'1 0 0'}
      >
        {skeleton ?? <Skeleton position={PositionSkeleton.START} width={'100%'} height={'32px'} animation={false} />}
      </Box>
    </TableCell>
  ));

  return (
    <TableRow>
      <TableCell component='th' scope='row' padding={'none'}>
        <Stack
          direction={'row'}
          padding={`${theme.custom.base.module.fifteenth} ${theme.custom.table.padding.px}`}
          justifyContent={'flex-end'}
          alignItems={'flex-start'}
          flex={'1 0 0'}
        >
          {skeleton ?? <Skeleton position={PositionSkeleton.START} width={'100%'} height={'32px'} animation={false} />}
        </Stack>
      </TableCell>
      {tableRows}
    </TableRow>
  );
};
