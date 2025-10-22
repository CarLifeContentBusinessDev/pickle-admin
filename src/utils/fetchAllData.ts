import type {
  usingChannelProps,
  usingDataProps,
  CurationListIdProps,
  usingCurationExcelProps,
} from '../type';
import api from './api';

const SIZE = 10000;
const CURATIONSIZE = 100;

export async function fetchAllData(
  category: 'channel'
): Promise<usingChannelProps[]>;
export async function fetchAllData(
  category: 'episode'
): Promise<usingDataProps[]>;

export async function fetchAllData(
  category: string
): Promise<(usingDataProps | usingChannelProps)[]> {
  try {
    const firstRes = await api.get(`/admin/${category}?page=1&size=${SIZE}`);

    const totalCount = firstRes.data.data.pageInfo.totalCount;
    const totalPages = Math.ceil(totalCount / SIZE);

    let allData: (usingDataProps | usingChannelProps)[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const res = await api.get(`/admin/${category}?page=${page}&size=${SIZE}`);
      allData = allData.concat(res.data.data.dataList);
    }

    return allData;
  } catch (err) {
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
    console.log(firstRes);
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
          field: detailData.field ?? '',
          section: detailData.section ?? 0,
          curationType: detailData.curationType,
          curationName: detailData.curationName,
          curationDesc: detailData.curationDesc,
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
