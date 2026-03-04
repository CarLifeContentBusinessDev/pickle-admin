import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';

interface DemoCategoryListProps {
  categories: any[];
  selectedLang: string;
}

const gridCols =
  'minmax(40px,1fr) minmax(120px,2fr) minmax(120px,2fr) minmax(60px,1fr) minmax(80px,2fr) minmax(100px,1fr) minmax(90px,90px)';

const columns = [
  { key: 'id', label: 'id' },
  { key: 'title', label: 'title' },
  { key: 'img_url', label: 'thumbnail' },
  { key: 'order', label: 'order' },
  { key: 'language', label: 'language' },
  { key: 'programsCount', label: '포함 프로그램 수' },
  { key: 'edit', label: '' },
];

const DemoCategoryList: React.FC<DemoCategoryListProps> = ({
  categories,
  selectedLang,
}) => {
  const navigate = useNavigate();

  const renderCell = (key: string, cat: any) => {
    if (key === 'img_url') {
      return cat.img_url ? (
        <img
          src={cat.img_url}
          alt=''
          className='h-20 max-w-24 object-contain rounded shadow'
        />
      ) : (
        <span className='text-gray-400'>-</span>
      );
    }

    if (key === 'language') {
      return Array.isArray(cat.language)
        ? cat.language.map((lang: string) => (
            <span
              key={lang}
              className='bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs mr-1'
            >
              {lang}
            </span>
          ))
        : cat.language;
    }

    if (key === 'edit') {
      return (
        <button
          className='flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
          onClick={() =>
            navigate(`/demo/category-list/edit/${cat.id}?lang=${selectedLang}`)
          }
        >
          편집
        </button>
      );
    }

    return Array.isArray(cat[key]) ? cat[key].join(', ') : cat[key];
  };

  return (
    <Table
      columns={columns}
      data={categories}
      gridTemplateColumns={gridCols}
      renderCell={renderCell}
    />
  );
};

export default DemoCategoryList;
