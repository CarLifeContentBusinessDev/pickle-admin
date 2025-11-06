import type { usingChannelProps, usingDataProps } from '../type';
import { api } from './api';
import { getExcelData, getExcelLastData } from './updateExcel';

function excelDateToJSDate(serial: number): Date {
  const millisPerDay = 24 * 60 * 60 * 1000;
  const excelEpochMillis = Date.UTC(1899, 11, 30);
  const targetMillis = excelEpochMillis + serial * millisPerDay;

  return new Date(targetMillis);
}

function findLatestTimeInExcel(
  excelData: (usingDataProps | usingChannelProps)[]
): number {
  if (excelData.length === 0) return 0;

  const latestSerial = excelData.reduce((max, item) => {
    const currentSerial = Number(item.createdAt);
    return currentSerial > max ? currentSerial : max;
  }, 0);

  if (latestSerial === 0) return 0;

  const latestDateInExcel = excelDateToJSDate(latestSerial);
  return latestDateInExcel.getTime();
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
  if (excelData.length === 0) return [];

  const latestTime = findLatestTimeInExcel(excelData);

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
    const dbDate = new Date(pageData[0].createdAt);
    const pageTime = dbDate.getTime() - dbDate.getTimezoneOffset() * 60 * 1000;

    allApiData = allApiData.concat(pageData);
    if (pageTime <= latestTime) {
      break;
    }
  }

  const newEpisodes = allApiData.filter((item) => {
    const dbDateForItem = new Date(item.createdAt);
    const itemTime =
      dbDateForItem.getTime() - dbDateForItem.getTimezoneOffset() * 60 * 1000;
    return itemTime > latestTime + 1000;
  });

  return newEpisodes;
}

export async function getNewDataWithExcel(): Promise<usingDataProps[]> {
  const batchSize = 1000;
  let allApiData: usingDataProps[] = [];

  const firstRes = await api.get(`/admin/episode?page=1&size=1`);
  const totalCount = firstRes.data.data.pageInfo.totalCount;
  const totalPages = Math.ceil(totalCount / batchSize);

  const excelLastData = await getExcelLastData();
  const latestTime = findLatestTimeInExcel(excelLastData);

  for (let i = 0; i < totalPages; i++) {
    const res = await api.get(`/admin/episode?page=${i + 1}&size=${batchSize}`);

    const pageData = res.data.data.dataList;
    if (pageData.length === 0) break;

    const dbDate = new Date(pageData[batchSize - 1].createdAt);
    const pageTime = dbDate.getTime() - dbDate.getTimezoneOffset() * 60 * 1000;

    allApiData = allApiData.concat(pageData);
    if (pageTime <= latestTime) {
      break;
    }
  }

  const newEpisodes = allApiData.filter((item) => {
    const dbDateForItem = new Date(item.createdAt);
    const itemTime =
      dbDateForItem.getTime() - dbDateForItem.getTimezoneOffset() * 60 * 1000;
    return itemTime > latestTime + 1000;
  });

  return newEpisodes;
}
