import { useState } from 'react';
import { InitialState, PageLimit } from '../enums/pagination.enum';

export const usePagination = (initialPage = InitialState.FIRST, initialRowPerPage = PageLimit.FIFTY) => {
  const [page, setPage] = useState<number>(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowPerPage);

  return {
    page,
    setPage,
    rowsPerPage,
    setRowsPerPage,
  };
};
