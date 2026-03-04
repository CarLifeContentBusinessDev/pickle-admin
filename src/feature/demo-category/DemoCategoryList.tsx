import React from 'react';
import { useNavigate } from 'react-router-dom';

interface DemoCategoryListProps {
  categories: any[];
  selectedLang: string;
}

const gridCols =
  'minmax(40px,1fr) minmax(120px,2fr) minmax(120px,2fr) minmax(40px,1fr) minmax(80px,2fr) minmax(100px,1fr) minmax(90px,90px)';

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
      return (
        <div className='px-2 py-2 flex items-center'>
          {cat.img_url ? (
            <img
              src={cat.img_url}
              alt=''
              className='h-20 max-w-24 object-contain rounded shadow'
            />
          ) : (
            <span className='text-gray-400'>-</span>
          )}
        </div>
      );
    }

    if (key === 'language') {
      return (
        <div className='px-2 py-2 flex flex-wrap gap-1'>
          {Array.isArray(cat.language)
            ? cat.language.map((lang: string) => (
                <span
                  key={lang}
                  className='bg-gray-200 text-gray-700 rounded px-2 py-0.5 text-xs'
                >
                  {lang}
                </span>
              ))
            : cat.language}
        </div>
      );
    }

    if (key === 'edit') {
      return (
        <div className='px-2 py-2 flex justify-end'>
          <button
            className='flex items-center gap-1 px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-sm'
            onClick={() =>
              navigate(
                `/demo/category-list/edit/${cat.id}?lang=${selectedLang}`
              )
            }
            title='편집'
          >
            <svg width='16' height='16' fill='none' viewBox='0 0 20 20'>
              <path
                d='M14.7 3.29a1 1 0 0 1 1.42 0l.59.59a1 1 0 0 1 0 1.42l-9.3 9.3-2.12.7.7-2.12 9.3-9.3ZM3 17h14v-2H3v2Z'
                fill='currentColor'
              />
            </svg>
            편집
          </button>
        </div>
      );
    }

    return (
      <div className='px-2 py-2 truncate flex items-center'>
        {Array.isArray(cat[key]) ? cat[key].join(', ') : cat[key]}
      </div>
    );
  };

  return (
    <div className='w-full flex flex-col'>
      {/* ✅ 헤더 */}
      <div
        className='grid font-bold bg-white border-b-2 border-gray-300 sticky top-0 z-10'
        style={{ gridTemplateColumns: gridCols }}
      >
        {columns.map((col) => (
          <div key={col.key} className='px-2 py-3 truncate'>
            {col.label}
          </div>
        ))}
      </div>

      {/* ✅ 데이터 */}
      <div className='flex flex-col'>
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat.id}
              className='grid border-b border-gray-200 items-center hover:bg-gray-50 transition'
              style={{ gridTemplateColumns: gridCols }}
            >
              {columns.map((col) => (
                <React.Fragment key={col.key}>
                  {renderCell(col.key, cat)}
                </React.Fragment>
              ))}
            </div>
          ))
        ) : (
          <div className='py-10 text-center text-gray-400'>
            데이터가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoCategoryList;
