import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { toast } from 'react-toastify';
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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('클립보드에 복사되었습니다.');
    } catch (error) {
      toast.error('복사에 실패했습니다.');
    }
  };

  return (
    <>
      <style>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div
        ref={parentRef}
        className='w-full h-[75%] overflow-auto hide-scrollbar border-t border-gray-300'
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
                  className='absolute left-0 right-0 flex items-center py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition'
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    height: `${virtualRow.size}px`,
                  }}
                >
                  <p
                    className='w-[7%] h-full px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() => handleCopy(String(channel.channelId))}
                  >
                    {channel.channelId}
                  </p>
                  <div className='w-[20%] h-full overflow-y-auto self-start hide-scrollbar'>
                    <p
                      className='px-2 break-words cursor-pointer hover:bg-gray-200 transition rounded'
                      onClick={() => handleCopy(channel.interfaceUrl)}
                    >
                      {channel.interfaceUrl}
                    </p>
                  </div>
                  <p
                    className='w-[12%] h-full line-clamp-2 px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() => handleCopy(channel.channelTypeName)}
                  >
                    {channel.channelTypeName}
                  </p>
                  <p
                    className='w-[13%] h-full line-clamp-2 px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() => handleCopy(channel.interfaceType)}
                  >
                    {channel.interfaceType}
                  </p>
                  <p
                    className='w-[9%] h-full px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() => handleCopy(channel.categoryName)}
                  >
                    {channel.categoryName}
                  </p>
                  <p
                    className='w-[9%] h-full px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() => handleCopy(String(channel.categoryId))}
                  >
                    {channel.categoryId}
                  </p>
                  <p
                    className='w-[12%] h-full px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() =>
                      handleCopy(formatDateString(channel.createdAt))
                    }
                  >
                    {formatDateString(channel.createdAt)}
                  </p>
                  <p
                    className='w-[12%] h-full px-2 cursor-pointer hover:bg-gray-200 transition rounded'
                    onClick={() =>
                      handleCopy(formatDateString(channel.dispDtime))
                    }
                  >
                    {formatDateString(channel.dispDtime)}
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
    </>
  );
};

export default ChannelList;
