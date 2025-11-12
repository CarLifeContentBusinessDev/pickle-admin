import type { usingChannelProps, usingDataProps } from '../type';
import { api } from './api';
import { getExcelData } from './updateExcel';

function findMaxIdInExcel(
  excelData: (usingDataProps | usingChannelProps)[]
): number {
  if (excelData.length === 0) return 0;

  const maxId = excelData.reduce((maxId, item) => {
    const currentId = 'episodeId' in item ? item.episodeId : item.channelId;
    return currentId > maxId ? currentId : maxId;
  }, 0);

  return maxId;
}

export async function getNewData(
  token: string,
  accessToken: string,
  setProgress: (message: string) => void,
  category: 'channel'
): Promise<usingChannelProps[]>;
export async function getNewData(
  token: string,
  accessToken: string,
  setProgress: (message: string) => void,
  category: 'episode'
): Promise<usingDataProps[]>;

export async function getNewData(
  token: string,
  accessToken: string,
  setProgress: (message: string) => void,
  category: 'episode' | 'channel'
): Promise<(usingDataProps | usingChannelProps)[]> {
  const excelData = await getExcelData(token, category);

  const maxId = findMaxIdInExcel(excelData);

  const size = 1000;
  const firstRes = await api.get(`/admin/${category}?page=1&size=${size}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const totalCount = firstRes.data.data.pageInfo.totalCount;
  const totalPages = Math.ceil(totalCount / size);

  let progress = 0;
  const addProgress = () => {
    progress += 100 / totalCount;
    setProgress(`${Math.min(100, Math.round(progress))}%`);
  };

  let allApiData: (usingDataProps | usingChannelProps)[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const res = await api.get(`/admin/${category}?page=${page}&size=${size}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    addProgress();
    const pageData = res.data.data.dataList;
    allApiData = allApiData.concat(pageData);
  }

  const newData = allApiData.filter((item) => {
    const currentId = 'episodeId' in item ? item.episodeId :
                      'channelId' in item ? item.channelId : 0;
    return currentId > maxId;
  });

  return newData;
}

export async function getNewDataWithExcel(): Promise<usingDataProps[]> {
  const batchSize = 10000;
  let allApiData: usingDataProps[] = [];

  const firstRes = await api.get(`/admin/episode?page=1&size=1`);
  const totalCount = firstRes.data.data.pageInfo.totalCount;
  const totalPages = Math.ceil(totalCount / batchSize);

  const token = '';
  const allExcelData = await getExcelData(token, 'episode');
  const maxId = findMaxIdInExcel(allExcelData);

  for (let i = 0; i < totalPages; i++) {
    const res = await api.get(`/admin/episode?page=${i + 1}&size=${batchSize}`);

    const pageData = res.data.data.dataList;
    if (pageData.length === 0) break;

    allApiData = allApiData.concat(pageData);
  }

  const newEpisodes = allApiData.filter((item) => {
    return item.episodeId > maxId;
  });

  return newEpisodes;
}
