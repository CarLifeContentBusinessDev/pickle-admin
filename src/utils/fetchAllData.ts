import type {
  usingChannelProps,
  usingDataProps,
  CurationListIdProps,
  usingCurationExcelProps,
} from '../type';
import { api } from './api';

const SIZE = 10000;
const CURATIONSIZE = 100;

export async function fetchAllData(
  category: 'channel',
  setProgress: (message: string) => void,
  signal?: AbortSignal
): Promise<usingChannelProps[]>;
export async function fetchAllData(
  category: 'episode',
  setProgress: (message: string) => void,
  signal?: AbortSignal
): Promise<usingDataProps[]>;

export async function fetchAllData(
  category: string,
  setProgress: (message: string) => void,
  signal?: AbortSignal
): Promise<(usingDataProps | usingChannelProps)[]> {
  try {
    if (signal?.aborted) {
      return [];
    }

    const firstRes = await api.get(`/admin/${category}?page=1&size=${SIZE}`, {
      signal
    });

    const totalCount = firstRes.data.data.pageInfo.totalCount;
    const totalPages = Math.ceil(totalCount / SIZE);

    let allData: (usingDataProps | usingChannelProps)[] = [];

    for (let page = 1; page <= totalPages; page++) {
      if (signal?.aborted) {
        return [];
      }

      setProgress(`${Math.round((page / totalPages) / 2 * 100)}%`);
      const res = await api.get(`/admin/${category}?page=${page}&size=${SIZE}`, {
        signal
      });
      const dataList = res.data.data.dataList;

      allData = allData.concat(dataList);
    }

    if (category === 'channel') {
      const channelData = allData as usingChannelProps[];

      for (let i = 0; i < channelData.length; i++) {
        if (signal?.aborted) {
          return [];
        }

        const channel = channelData[i];

        try {
          setProgress(`${Math.round(50 + (i / channelData.length) * 50)}%`);

          const episodeRes = await api.get(
            `/admin/episode?page=1&size=1&channelId=${channel.channelId}&withPlaylists=Y`,
            { signal }
          );

          const episodes = episodeRes.data.data.dataList;

          if (episodes && episodes.length > 0) {
            channel.dispDtime = episodes[0].dispDtime || '';
          } else {
            channel.dispDtime = '';
          }
        } catch (err) {
          if ((err as any).name === 'AbortError' || (err as any).name === 'CanceledError') {
            return [];
          }
          console.error(`채널 ${channel.channelId}의 에피소드 조회 실패:`, err);
          channel.dispDtime = '';
        }
      }
    }

    return allData;
  } catch (err) {
    if ((err as any).name === 'AbortError' || (err as any).name === 'CanceledError') {
      return [];
    }
    console.error('데이터 API 가져오기 실패:', err);
    return [];
  }
}

export async function fetchAllCurationData(): Promise<
  usingCurationExcelProps[]
> {
  try {
    const firstRes = await api.get(
      `/admin/curation?page=1&size=${CURATIONSIZE}&periodType=ALL`
    );

    const totalCount = firstRes.data.data.pageInfo.totalCount;
    const totalPages = Math.ceil(totalCount / CURATIONSIZE);
    let curationIds: CurationListIdProps[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const curationListRes = await api.get(
        `/admin/curation?page=${page}&size=${CURATIONSIZE}&periodType=ALL`
      );
      const pageCurationIds = curationListRes.data.data.dataList.map(
        (item: { curationId: number }) => ({ curationId: item.curationId })
      );
      curationIds = curationIds.concat(pageCurationIds);
    }

    const allCurationData: usingCurationExcelProps[] = [];

    for (const { curationId } of curationIds) {
      const detailRes = await api.get(`/admin/curation/${curationId}`, {});
      const detailData = detailRes.data.data;

      const episodes = detailData.episodes || [];

      for (const episode of episodes) {
        const episodeObject: usingCurationExcelProps = {
          thumbnailTitle: detailData.thumbnailTitle ?? '',
          curationType: detailData.curationType,
          curationName: detailData.curationName,
          curationDesc: detailData.curationDesc,
          activeState: detailData.activeState ?? '',
          exhibitionState: detailData.exhibitionState ?? '',
          field: detailData.field ?? '',
          section: detailData.section ?? undefined,
          dispStartDtime: detailData.dispStartDtime,
          dispEndDtime: detailData.dispEndDtime,
          curationCreatedAt: detailData.createdAt,
          channelId: episode.channelId ?? 0,
          episodeId: episode.episodeId ?? 0,
          usageYn: episode.usageYn ?? '',
          channelName: episode.channelName ?? '',
          episodeName: episode.episodeName ?? '',
          dispDtime: episode.dispDtime ?? '',
          createdAt: episode.createdAt ?? '',
          playTime: episode.playTime ?? 0,
          likeCnt: episode.likeCnt ?? 0,
          listenCnt: episode.listenCnt ?? 0,
          uploader: episode.uploader ?? '',
        };

        allCurationData.push(episodeObject);
      }
    }

    return allCurationData;
  } catch (err) {
    console.error('큐레이션 데이터 API 가져오기 실패:', err);
    return [];
  }
}
