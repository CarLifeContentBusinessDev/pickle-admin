import axios from 'axios';
import type { usingChannelProps, usingDataProps } from '../type';
import formatDateString from './formatDateString';
import { getGraphToken } from './auth';
import { toast } from 'react-toastify';

const fileId = import.meta.env.VITE_FILE_ID;
const MAX_EXCEL_ROWS = 300000;

export async function getUsedRange(token: string): Promise<number | null> {
  const sheetName = localStorage.getItem('sheetName');
  const usedRangeUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='A1:A${MAX_EXCEL_ROWS}')?valuesOnly=true`;

  try {
    const res = await axios.get(usedRangeUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const values = res.data.values as (string | number)[][];
    if (!values) return null;

    let lastDataRow = 0;
    for (let i = values.length - 1; i >= 0; i--) {
      if (
        values[i] &&
        values[i].length > 0 &&
        values[i][0] !== null &&
        values[i][0] !== ''
      ) {
        lastDataRow = i + 1;
        break;
      }
    }

    return Math.max(lastDataRow, 4);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        'A열 기반 마지막 행 조회 실패:',
        err.response?.data || err.message
      );
    } else {
      console.error('A열 기반 마지막 행 조회 실패:', err);
    }
    return null;
  }
}

// 함수 오버로딩 시그니처
export async function getExcelData(
  token: string,
  setProgress: ((message: string) => void) | undefined,
  category: 'channel'
): Promise<usingChannelProps[]>;
export async function getExcelData(
  token: string,
  setProgress: ((message: string) => void) | undefined,
  category: 'episode'
): Promise<usingDataProps[]>;
export async function getExcelData(
  token: string,
  setProgress: ((message: string) => void) | undefined,
  category: 'episode' | 'channel'
): Promise<(usingDataProps | usingChannelProps)[]>;

// 실제 구현
export async function getExcelData(
  token: string,
  setProgress?: (message: string) => void,
  category: 'episode' | 'channel' = 'episode'
): Promise<(usingDataProps | usingChannelProps)[]> {
  const batchSize = 10000;
  const allRows: (string | number)[][] = [];
  let totalRows = await getUsedRange(token);

  if (totalRows === null || totalRows < 4) {
    totalRows = 4;
  }

  const totalBatches = Math.ceil(totalRows / batchSize);

  const lastColumn = category === 'episode' ? 'K' : 'I';

  for (let i = 0; i < totalBatches; i++) {
    const startRow = i * batchSize + 4;
    const calculatedEndRow = startRow + batchSize - 1;
    const endRow = Math.min(calculatedEndRow, totalRows);
    const rangeAddress = `A${startRow}:${lastColumn}${endRow}`;

    const sheetName = localStorage.getItem('sheetName');
    try {
      setProgress?.(`${Math.round((i / totalBatches) * 100)}%`);
      const res = await axios.get(
        `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${rangeAddress}')?valuesOnly=true`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const values = res.data.values as (string | number)[][];
      if (values && values.length > 0) allRows.push(...values);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        const refreshedToken = await getGraphToken();
        if (!refreshedToken)
          throw new Error('토큰 재발급 실패, 엑셀 조회 중단');

        localStorage.setItem('loginToken', refreshedToken);

        const retryRes = await axios.get(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${rangeAddress}')?valuesOnly=true`,
          { headers: { Authorization: `Bearer ${refreshedToken}` } }
        );

        const retryValues = retryRes.data.values as (string | number)[][];
        if (retryValues && retryValues.length > 0) allRows.push(...retryValues);
      } else {
        console.error('엑셀 조회 실패:', err);
      }
    }
  }

  const validRows = allRows.filter(
    (row) => row[0] !== null && row[0] !== undefined && row[0] !== ''
  );

  if (category === 'episode') {
    return validRows.map(
      (row) =>
        ({
          episodeId: Number(row[0] ?? 0),
          usageYn: String(row[1] ?? ''),
          channelName: String(row[2] ?? ''),
          episodeName: String(row[3] ?? ''),
          dispDtime: String(row[4] ?? ''),
          createdAt: String(row[5] ?? ''),
          playTime: Number(row[6] ?? 0),
          likeCnt: Number(row[7] ?? 0),
          listenCnt: Number(row[8] ?? 0),
          tags: String(row[9] ?? ''),
          tagsAdded: String(row[10] ?? ''),
        }) as usingDataProps
    );
  } else {
    return validRows.map(
      (row) =>
        ({
          channelId: Number(row[0] ?? 0),
          usageYn: String(row[1] ?? ''),
          channelName: String(row[2] ?? ''),
          channelTypeName: String(row[3] ?? ''),
          categoryName: String(row[4] ?? ''),
          vendorName: String(row[5] ?? ''),
          likeCnt: Number(row[6] ?? 0),
          listenCnt: Number(row[7] ?? 0),
          createdAt: String(row[8] ?? ''),
        }) as usingChannelProps
    );
  }
}

// 함수 오버로딩 시그니처
export async function addMissingRows(
  allData: usingChannelProps[],
  token: string,
  setProgress: (message: string) => void,
  category: 'channel'
): Promise<void>;
export async function addMissingRows(
  allData: usingDataProps[],
  token: string,
  setProgress: (message: string) => void,
  category: 'episode'
): Promise<void>;

// 실제 구현
export async function addMissingRows(
  allData: (usingDataProps | usingChannelProps)[],
  token: string,
  setProgress: (message: string) => void,
  category: 'episode' | 'channel'
) {
  const existingData = await getExcelData(token, setProgress, category);

  const missingRows = allData.filter(
    (item) =>
      !existingData.some(
        (row) =>
          ('episodeId' in row &&
            'episodeId' in item &&
            row.episodeId === item.episodeId) ||
          ('channelId' in row &&
            'channelId' in item &&
            row.channelId === item.channelId)
      )
  );

  if (missingRows.length === 0) {
    toast.success('추가할 누락 데이터가 없습니다!');
    return;
  }

  const batchSize = 1000;

  for (let i = 0; i < missingRows.length; i += batchSize) {
    const batch = missingRows.slice(i, i + batchSize) as (
      | usingDataProps
      | usingChannelProps
    )[];
    let values;
    let lastColumn;

    const sheetName = localStorage.getItem('sheetName');
    if (category === 'episode') {
      values = (batch as usingDataProps[]).map((row) => [
        row.episodeId,
        row.usageYn,
        row.channelName,
        row.episodeName,
        formatDateString(row.dispDtime),
        formatDateString(row.createdAt),
        row.playTime,
        row.likeCnt,
        row.listenCnt,
        row.tags,
        row.tagsAdded,
      ]);
      lastColumn = 'K';
    } else {
      values = (batch as usingChannelProps[]).map((row) => [
        row.channelId,
        row.usageYn,
        row.channelName,
        row.channelTypeName,
        row.categoryName,
        row.vendorName,
        row.likeCnt,
        row.listenCnt,
        formatDateString(row.createdAt),
      ]);
      lastColumn = 'I';
    }

    const startRow = existingData.length + i + 4;
    const endRow = startRow + batch.length - 1;
    const rangeAddress = `A${startRow}:${lastColumn}${endRow}`;

    try {
      setProgress(`${Math.round((i / missingRows.length) * 100)}%`);
      await axios.patch(
        `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${rangeAddress}')`,
        { values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        const refreshedToken = await getGraphToken();
        if (!refreshedToken)
          throw new Error('토큰 재발급 실패, 엑셀 업데이트 중단');

        token = refreshedToken;
        localStorage.setItem('loginToken', token);

        await axios.patch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='${rangeAddress}')`,
          { values },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        throw err;
      }
    }
  }
}
