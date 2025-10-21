import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { usingChannelProps } from '../../type';
import formatDateString from '../../utils/formatDateString';

const ChannelList = ({ data }: { data: usingChannelProps[] }) => {
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
            const channel = data[virtualRow.index];
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
                <p className='w-[7%] px-2'>{channel.channelId}</p>
                <p className='w-[7%] px-2'>{channel.usageYn}</p>
                <p className='w-[12%] line-clamp-2 px-2'>
                  {channel.channelName}
                </p>
                <p className='w-[13%] line-clamp-2 px-2'>
                  {channel.channelTypeName}
                </p>
                <p className='w-[12%] px-2'>{channel.categoryName}</p>
                <p className='w-[12%] px-2'>{channel.vendorName}</p>
                <p className='w-[9%] px-2'>{channel.likeCnt}</p>
                <p className='w-[7%] px-2'>{channel.listenCnt}</p>
                <p className='w-[12%] px-2'>
                  {formatDateString(channel.createdAt)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className='w-full h-full flex justify-center items-center'>
          새로 등록된 채널·도서가 존재하지 않습니다.
        </div>
      )}
    </div>
  );
};

export default ChannelList;
