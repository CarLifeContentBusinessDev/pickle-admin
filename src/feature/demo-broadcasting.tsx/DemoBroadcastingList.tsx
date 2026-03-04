import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';
import { supabase } from '../../lib/supabase';

interface DemoBroadcastingListProps {
  broadcasting: any[];
  selectedLang: string;
  onDeleted?: () => void;
}

const gridCols =
  'minmax(40px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(120px,1fr) minmax(60px,1fr) minmax(80px,1fr) minmax(100px,1fr) minmax(140px,1fr)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'title' },
  { key: 'channel', label: 'channel' },
  { key: 'frequency', label: 'frequency' },
  { key: 'img_url', label: '썸네일' },
  { key: 'order', label: '순위' },
  { key: 'language', label: '국가' },
  { key: 'programsCount', label: '프로그램 수' },
  { key: 'actions', label: '' },
];

const DemoBroadcastingList: React.FC<DemoBroadcastingListProps> = ({
  broadcasting,
  selectedLang,
  onDeleted,
}) => {
  const navigate = useNavigate();

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');

    if (!confirmed) return;

    const { error } = await supabase
      .from('broadcastings')
      .delete()
      .eq('id', id);

    if (error) {
      alert('삭제 실패: ' + error.message);
    } else {
      if (onDeleted) onDeleted();
    }
  };

  const renderCell = (key: string, broad: any) => {
    if (key === 'img_url') {
      return broad.img_url ? (
        <img
          src={broad.img_url}
          alt=''
          className='h-20 max-w-24 object-contain rounded shadow'
        />
      ) : (
        <span className='text-gray-400'>-</span>
      );
    }

    if (key === 'language') {
      return Array.isArray(broad.language)
        ? broad.language.map((lang: string) => (
            <span
              key={lang}
              className='bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs mr-1'
            >
              {lang}
            </span>
          ))
        : broad.language;
    }

    if (key === 'actions') {
      return (
        <div className='flex gap-2'>
          <button
            className='px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
            onClick={() =>
              navigate(
                `/demo/broadcasting-list/edit/${broad.id}?lang=${selectedLang}`
              )
            }
          >
            편집
          </button>

          <button
            className='px-3 py-1 rounded bg-red-100 text-red-600 hover:bg-red-200 transition text-sm'
            onClick={() => handleDelete(broad.id)}
          >
            삭제
          </button>
        </div>
      );
    }

    return Array.isArray(broad[key]) ? broad[key].join(', ') : broad[key];
  };

  return (
    <Table
      columns={columns}
      data={broadcasting}
      gridTemplateColumns={gridCols}
      renderCell={renderCell}
    />
  );
};

export default DemoBroadcastingList;
