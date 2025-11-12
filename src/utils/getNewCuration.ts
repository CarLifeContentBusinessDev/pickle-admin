import type { usingCurationExcelProps, usingCurationProps } from '../type';
import { api } from './api';
import { getCurationExcelData } from './updateCuration';

function findMaxEpisodeIdInExcel(
  excelData: usingCurationExcelProps[]
): number {
  if (excelData.length === 0) return 0;

  return excelData.reduce((maxId, item) => {
    const currentId = item.episodeId ?? 0;
    return currentId > maxId ? currentId : maxId;
  }, 0);
}

export async function getNewCurationData(
  token: string,
  setProgress: (message: string) => void
): Promise<usingCurationExcelProps[]> {
  const excelData = await getCurationExcelData(token);

  const maxEpisodeId = findMaxEpisodeIdInExcel(excelData);

  const size = 100;
  const firstRes = await api.get(
    `/admin/curation?page=1&size=${size}&periodType=ALL`
  );
  const totalCount = firstRes.data.data.pageInfo.totalCount;
  const totalPages = Math.ceil(totalCount / size);

  let progress = 0;
  const addProgress = () => {
    progress += 100 / totalCount;
    setProgress(`${Math.min(100, Math.round(progress))}%`);
  };

  let allApiData: usingCurationProps[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const res = await api.get(
      `/admin/curation?page=${page}&size=${size}&periodType=ALL`
    );
    const pageData = res.data.data.dataList;
    allApiData = allApiData.concat(pageData);
  }

  let allEpiData: usingCurationExcelProps[] = [];

  for (let i = 0; i < allApiData.length; i++) {
    const epiRes = await api.get(`/admin/curation/${allApiData[i].curationId}`);
    addProgress();
    const detailData = epiRes.data.data;
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
        section: detailData.section ?? 0,
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
      allEpiData.push(episodeObject);
    }
  }

  const newEpisodes = allEpiData.filter((item) => {
    const episodeId = item.episodeId ?? 0;
    return episodeId > maxEpisodeId;
  });

  return newEpisodes;
}
