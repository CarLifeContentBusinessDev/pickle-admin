import { getUsedRange } from './updateExcel';
import type { usingCurationExcelProps } from '../type';
import axios from 'axios';
import { toast } from 'react-toastify';
import formatDateString from './formatDateString';
import { getCurationExcelData } from './updateCuration';

const fileId = import.meta.env.VITE_FILE_ID;
const sheetName = localStorage.getItem('sheetName');

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clearExcelFromRow(
  startRow: number,
  endRow: number,
  token: string
) {
  try {
    await axios.post(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets('${sheetName}')/range(address='B${startRow}:T${endRow}')/clear`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await delay(500);
  } catch (err) {
    console.error('엑셀 삭제 실패:', err);
  }
}

function excelDateToJSDate(serial: number): Date {
  const excelEpoch = new Date(1899, 11, 30);
  const millisPerDay = 24 * 60 * 60 * 1000;
  return new Date(excelEpoch.getTime() + serial * millisPerDay);
}

function excelDateTime(date?: string | number) {
  if (!date) return '';

  if (typeof date === 'number') {
    return formatDateString(excelDateToJSDate(date).toISOString());
  }

  if (!isNaN(Number(date))) {
    return formatDateString(excelDateToJSDate(Number(date)).toISOString());
  }

  const d = new Date(date);
  return isNaN(d.getTime()) ? '' : formatDateString(d.toISOString());
}

async function overwriteExcelData(
  newData: usingCurationExcelProps[],
  token: string
) {
  const existingData = await getUsedRange(token);
  const totalRowsToClear = Math.max(newData.length + 3, existingData!);
  await clearExcelFromRow(4, totalRowsToClear, token);
  const batchSize = 1000;

  try {
    for (let i = 0; i < newData.length; i += batchSize) {
      const batch = newData.slice(i, i + batchSize);

      const values = (batch as usingCurationExcelProps[]).map((row) => [
        row.thumbnailTitle,
        row.curationType,
        row.curationName,
        row.curationDesc,
        row.field,
        row.section,
        excelDateTime(row.dispStartDtime),
        excelDateTime(row.dispEndDtime),
        excelDateTime(row.curationCreatedAt),
        row.channelId,
        row.episodeId,
        row.usageYn,
        row.channelName,
        row.episodeName,
        excelDateTime(row.dispDtime),
        excelDateTime(row.createdAt),
        row.playTime,
        row.likeCnt,
        row.listenCnt,
      ]);

      const startRow = i + 4;
      const endRow = startRow + batch.length - 1;
      const rangeAddress = `B${startRow}:T${endRow}`;

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
    }

    toast.success('엑셀 동기화에 성공했습니다!');
  } catch (err) {
    console.error('엑셀 동기화 실패:', err);
    toast.error('엑셀 동기화에 실패했습니다.');
  }
}

async function syncNewCurationToExcel(
  newData: usingCurationExcelProps[],
  token: string
) {
  const excelData = await getCurationExcelData(token, undefined);

  const excelKeys = new Set(
    excelData.map((item) => `${item.curationCreatedAt}`)
  );

  const filteredNew = newData.filter(
    (item) => !excelKeys.has(`${item.curationCreatedAt}`)
  );

  const updatedData = [...filteredNew, ...excelData];

  await overwriteExcelData(updatedData, token);
}

export default syncNewCurationToExcel;
