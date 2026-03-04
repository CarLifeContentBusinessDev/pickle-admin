import React from 'react';

interface DemoCategoryListProps {
  categories: any[];
}

const columns = [
  {
    key: 'id',
    label: 'id',
    className: 'min-w-[40px] max-w-[100px] flex-1',
  },
  {
    key: 'title',
    label: 'title',
    className: 'min-w-[100px] max-w-[300px] flex-1',
  },
  {
    key: 'img_url',
    label: 'thumbnail',
    className: 'min-w-[100px] max-w-[200px] flex-1',
  },
  {
    key: 'order',
    label: 'order',
    className: 'min-w-[40px] max-w-[100px] flex-1',
  },
  { key: 'language', label: 'language', className: 'min-w-[60px] flex-1' },
  {
    key: 'programsCount',
    label: '포함 프로그램 수',
    className: 'min-w-[60px] flex-1',
  },
];

const DemoCategoryList: React.FC<DemoCategoryListProps> = ({ categories }) => {
  return (
    <div className='w-full flex flex-col min-h-0'>
      {/* 헤더 */}
      <div className='flex font-bold px-2 py-4 bg-white border-b-2 border-gray-300 sticky top-0 z-10'>
        {columns.map((col) => (
          <p key={col.key} className={`px-2 truncate ${col.className}`}>
            {col.label}
          </p>
        ))}
      </div>
      {/* 데이터 */}
      {categories.length > 0 ? (
        <div className='flex flex-col'>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className='flex items-center border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition'
              style={{ minHeight: '40px' }}
            >
              {columns.map((col) =>
                col.key === 'img_url' ? (
                  <div
                    key={col.key}
                    className={`px-2 flex items-center ${col.className}`}
                  >
                    {cat.img_url ? (
                      <img
                        src={cat.img_url}
                        alt=''
                        className='h-24 max-w-24 object-contain rounded shadow'
                      />
                    ) : (
                      <span className='text-gray-400'>-</span>
                    )}
                  </div>
                ) : col.key === 'language' ? (
                  <div
                    key={col.key}
                    className={`px-2 flex flex-wrap gap-1 ${col.className}`}
                  >
                    {Array.isArray(cat.language)
                      ? cat.language.map((lang: string) => (
                          <span
                            key={lang}
                            className='inline-block bg-gray-200 text-gray-700 rounded px-2 py-0.5 font-medium'
                          >
                            {lang}
                          </span>
                        ))
                      : cat.language}
                  </div>
                ) : (
                  <div
                    key={col.key}
                    className={`px-4 truncate flex items-center ${col.className}`}
                  >
                    {col.key === 'programsCount' ? (
                      <span className='font-bold'>{cat[col.key]}</span>
                    ) : Array.isArray(cat[col.key]) ? (
                      cat[col.key].join(', ')
                    ) : (
                      cat[col.key]
                    )}
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className='w-full flex items-center justify-center pt-10'>
          등록된 카테고리가 없습니다.
        </div>
      )}
    </div>
  );
};

export default DemoCategoryList;
