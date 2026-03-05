import { useState, useMemo } from 'react';

export default function usePagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const pagedData = useMemo(() => {
    return data.slice((page - 1) * pageSize, page * pageSize);
  }, [data, page, pageSize]);

  return {
    page,
    setPage,
    totalPages,
    pagedData,
  };
}
