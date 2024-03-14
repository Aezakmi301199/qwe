import { ReactNode } from 'react';
import { TableRowLoadingComponent } from './table-row-loading-component';

type TableBodyLoadingContentComponentProps = {
  width: string;
  countColumn: number;
  countRows: number;
  skeleton?: ReactNode;
};

export const TableBodyLoadingContentComponent: React.FC<TableBodyLoadingContentComponentProps> = ({
  width,
  countColumn,
  countRows,
  skeleton,
}) => {
  const tableRows = Array.from({ length: countColumn }, () => (
    <TableRowLoadingComponent width={width} countRows={countRows} skeleton={skeleton} />
  ));

  return <>{tableRows}</>;
};
