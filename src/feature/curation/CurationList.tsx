import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { usingCurationExcelProps } from '../../type';
import formatDateString from '../../utils/formatDateString';

const CurationList = ({ data }: { data: usingCurationExcelProps[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  return (
    <div
      ref={parentRef}
      className='w-full h-[75%] overflow-auto border-t border-gray-300'
    >
      {data.length > 0 ? (
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const curation = data[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                ref={rowVirtualizer.measureElement}
                className='absolute left-0 right-0 flex items-center border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition'
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  height: `${virtualRow.size}px`,
                }}
              >
                <p className='w-[10%] px-1'>{curation.curationType}</p>
                <p className='w-[7%] indent-1 px-1'>{curation.usageYn}</p>
                <p className='w-[13%] line-clamp-2 px-1'>
                  {curation.curationName}
                </p>
                <p className='w-[12%] line-clamp-2 px-1'>
                  {curation.curationDesc}
                </p>
                <p className='w-[17%] text-sm px-1'>{`${formatDateString(curation.dispStartDtime)} ~ ${formatDateString(curation.dispEndDtime)}`}</p>
                <p className='w-[9%] px-1'>
                  {formatDateString(curation.curationCreatedAt)}
                </p>
                <p className='w-[12%] px-1 line-clamp-1'>{curation.channelName}</p>
                <p className='w-[13%] px-1 line-clamp-2'>{curation.episodeName}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='w-full h-full flex justify-center items-center'>
          새로 등록된 큐레이션이 존재하지 않습니다.
        </div>
      )}
    </div>
  );
};

export default CurationList;
