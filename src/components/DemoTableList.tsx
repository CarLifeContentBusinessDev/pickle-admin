import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import usePagination from '../hook/usePagination';
import { deleteRow } from '../utils/deleteRow';
import ImageCell from './ImageCell';
import LanguageBadge from './LanguageBadge';
import Pagination from './Pagenation';
import Table from './Table';

interface DemoTableListProps {
  data: any[];
  columns: { key: string; label: string }[];
  gridCols: string;
  selectedLang: string;
  editPath: string;
  tableName: string;
  onDeleted?: () => void;
}

const DemoTableList: React.FC<DemoTableListProps> = ({
  data,
  columns,
  gridCols,
  selectedLang,
  editPath,
  tableName,
  onDeleted,
}) => {
  const navigate = useNavigate();
  const { page, setPage, totalPages, pagedData } = usePagination(data);

  // 언어 변경 시 1페이지로 이동
  useEffect(() => {
    setPage(1);
  }, [selectedLang, setPage]);

  const handleDelete = async (id: number) => {
    const ok = await deleteRow(tableName, id);
    if (ok && onDeleted) onDeleted();
  };

  const renderCell = (key: string, row: any) => {
    if (key === 'img_url') {
      if (!row.img_url) return null;
      return <ImageCell url={row.img_url} />;
    }

    if (key === 'language') {
      return <LanguageBadge languages={row.language} />;
    }

    if (key === 'actions') {
      return (
        <div className='flex gap-2'>
          <button
            className='px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
            onClick={() =>
              navigate(`${editPath}/${row.id}?lang=${selectedLang}`)
            }
          >
            편집
          </button>

          <button
            className='px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition text-sm'
            onClick={() => handleDelete(row.id)}
          >
            삭제
          </button>
        </div>
      );
    }

    const value = row[key];

    // boolean 타입 처리
    if (typeof value === 'boolean') {
      return value ? 'O' : 'X';
    }

    return Array.isArray(value) ? value.join(', ') : value;
  };

  return (
    <>
      <Table
        columns={columns}
        data={pagedData}
        gridTemplateColumns={gridCols}
        renderCell={renderCell}
      />

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
};

export default DemoTableList;
