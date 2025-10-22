import type { usingCurationExcelProps, usingCurationProps } from '../type';
import api from './api';
import { getCurationExcelData } from './updateCuration';

function excelDateToJSDate(serial: number): Date {
  const millisPerDay = 24 * 60 * 60 * 1000;
  const excelEpochMillis = Date.UTC(1899, 11, 30);
  const targetMillis = excelEpochMillis + serial * millisPerDay;

  return new Date(targetMillis);
}

function findLatestTimeInExcel(excelData: usingCurationExcelProps[]): number {
  if (excelData.length === 0) return 0;

  const latestSerial = excelData.reduce((max, item) => {
    const currentSerial = Number(item.curationCreatedAt);
    return currentSerial > max ? currentSerial : max;
  }, 0);

  if (latestSerial === 0) return 0;

  const latestDateInExcel = excelDateToJSDate(latestSerial);
  return latestDateInExcel.getTime();
}

export async function getNewCurationData(
  token: string,
  setProgress: (message: string) => void
): Promise<usingCurationExcelProps[]> {
  const excelData = await getCurationExcelData(token, setProgress);
  
  if (excelData.length === 0) return [];
  const latestTime = findLatestTimeInExcel(excelData);

  const size = 100;
  const firstRes = await api.get(
    `/admin/curation?page=1&size=${size}&periodType=ALL`
  );

  const totalCount = firstRes.data.data.pageInfo.totalCount;

  const totalPages = Math.ceil(totalCount / size);

  let allApiData: usingCurationProps[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const res = await api.get(
      `/admin/curation?page=${page}&size=${size}&periodType=ALL`
    );
    const pageData = res.data.data.dataList;
    const dbDate = new Date(pageData[0].createdAt);
    const pageTime = dbDate.getTime() - dbDate.getTimezoneOffset() * 60 * 1000;

    allApiData = allApiData.concat(pageData);
    if (pageTime <= latestTime) {
      break;
    }
  }

  let allEpiData: usingCurationExcelProps[] = [];

  for (let i = 0; i < allApiData.length; i++) {
    const epiRes = await api.get(`/admin/curation/${allApiData[i].curationId}`);
    const detailData = epiRes.data.data;
    const episodes = detailData.episodes || [];

    for (const episode of episodes) {
      const episodeObject: usingCurationExcelProps = {
        thumbnailTitle: detailData.thumbnailTitle ?? '',
        curationType: detailData.curationType,
        curationName: detailData.curationName,
        curationDesc: detailData.curationDesc,
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
    const dbDateForItem = new Date(item.curationCreatedAt);
    const itemTime =
      dbDateForItem.getTime() - dbDateForItem.getTimezoneOffset() * 60 * 1000;
    return itemTime > latestTime;
  });

  return newEpisodes;
}
