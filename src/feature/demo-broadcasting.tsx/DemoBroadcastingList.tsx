import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../components/Table';

interface DemoBroadcastingListProps {
  broadcasting: any[];
  selectedLang: string;
}

const gridCols =
  'minmax(40px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(80px,1fr) minmax(120px,1fr) minmax(60px,1fr) minmax(80px,1fr) minmax(100px,1fr) minmax(90px,90px)';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'title' },
  { key: 'channel', label: 'channel' },
  { key: 'frequency', label: 'frequency' },
  { key: 'img_url', label: '썸네일' },
  { key: 'order', label: '순위' },
  { key: 'language', label: '국가' },
  { key: 'programsCount', label: '프로그램 수' },
  { key: 'edit', label: '' },
];

const DemoBroadcastingList: React.FC<DemoBroadcastingListProps> = ({
  broadcasting,
  selectedLang,
}) => {
  const navigate = useNavigate();

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

    if (key === 'edit') {
      return (
        <button
          className='flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
          onClick={() =>
            navigate(
              `/demo/broadcasting-list/edit/${broad.id}?lang=${selectedLang}`
            )
          }
        >
          편집
        </button>
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
