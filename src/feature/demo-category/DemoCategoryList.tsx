import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Table from '../../components/Table';

interface DemoCategoryListProps {
  categories: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,1fr) minmax(120px,2fr) minmax(120px,2fr) minmax(60px,1fr) minmax(80px,2fr) minmax(100px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'id' },
  { key: 'title', label: 'title' },
  { key: 'img_url', label: 'thumbnail' },
  { key: 'order', label: 'order' },
  { key: 'language', label: 'language' },
  { key: 'programsCount', label: '프로그램 수' },
  { key: 'actions', label: '' },
];

const DemoCategoryList: React.FC<DemoCategoryListProps> = ({
  categories,
  selectedLang,
  onDeleted,
}) => {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) return;

    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      if (onDeleted) onDeleted(); // 부모에서 다시 fetch
    }
  };

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

    if (key === 'actions') {
      return (
        <div className='flex gap-2'>
          <button
            className='px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
            onClick={() =>
              navigate(
                `/demo/category-list/edit/${cat.id}?lang=${selectedLang}`
              )
            }
          >
            편집
          </button>

          <button
            className='px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition text-sm'
            onClick={() => handleDelete(cat.id)}
          >
            삭제
          </button>
        </div>
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
