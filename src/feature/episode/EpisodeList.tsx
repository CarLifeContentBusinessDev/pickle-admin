import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { usingDataProps } from '../../type';
import formatDateString from '../../utils/formatDateString';

const EpisodeList = ({ data }: { data: usingDataProps[] }) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
    overscan: 10,
  });

  const columnWidths = {
    episodeId: '120px',
    usageYn: '80px',
    channelName: '180px',
    episodeName: '400px',
    dispDtime: '180px',
    createdAt: '180px',
    playTime: '120px',
    likeCnt: '90px',
    listenCnt: '90px',
    thumbnailUrl: '180px',
    audioUrl: '180px',
    channelId: '120px',
  };

  return (
    <div className='w-full h-[75%] flex flex-col'>
      {/* 헤더 */}
      <div
        ref={parentRef}
        className='w-full overflow-auto'
        style={{ height: '100%' }}
      >
        <div style={{ minWidth: 'max-content' }}>
          {/* 고정 헤더 */}
          <div className='flex font-bold py-4 bg-white border-b-2 border-gray-300 sticky top-0 z-10'>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.episodeId }}
            >
              에피소드ID
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.usageYn }}
            >
              활성화
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.channelName }}
            >
              채널명
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.episodeName }}
            >
              에피소드명
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.dispDtime }}
            >
              게시일
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.createdAt }}
            >
              등록일
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.playTime }}
            >
              에피소드 시간
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.likeCnt }}
            >
              좋아요수
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.listenCnt }}
            >
              청취수
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.thumbnailUrl }}
            >
              썸네일URL
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.audioUrl }}
            >
              오디오URL
            </p>
            <p
              className='px-2 flex-shrink-0'
              style={{ width: columnWidths.channelId }}
            >
              채널ID
            </p>
          </div>

          {/* 데이터 리스트 */}
          {data.length > 0 ? (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const epi = data[virtualRow.index];
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
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.episodeId }}
                    >
                      {epi.episodeId}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.usageYn }}
                    >
                      {epi.usageYn}
                    </p>
                    <p
                      className='px-2 line-clamp-2 break-words flex-shrink-0'
                      style={{ width: columnWidths.channelName }}
                    >
                      {epi.channelName}
                    </p>
                    <p
                      className='px-2 line-clamp-2 break-words flex-shrink-0'
                      style={{ width: columnWidths.episodeName }}
                    >
                      {epi.episodeName}
                    </p>
                    <p
                      className='px-2 truncate flex-shrink-0'
                      style={{ width: columnWidths.dispDtime }}
                    >
                      {formatDateString(epi.dispDtime)}
                    </p>
                    <p
                      className='px-2 truncate flex-shrink-0'
                      style={{ width: columnWidths.createdAt }}
                    >
                      {formatDateString(epi.createdAt)}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.playTime }}
                    >
                      {epi.playTime}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.likeCnt }}
                    >
                      {epi.likeCnt}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.listenCnt }}
                    >
                      {epi.listenCnt}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.thumbnailUrl }}
                    >
                      {epi.thumbnailUrl}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.audioUrl }}
                    >
                      {epi.audioUrl}
                    </p>
                    <p
                      className='px-3 truncate flex-shrink-0'
                      style={{ width: columnWidths.channelId }}
                    >
                      {epi.channelId}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className='w-full h-[100px] flex justify-center items-center'>
              새로 등록된 에피소드가 존재하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodeList;
