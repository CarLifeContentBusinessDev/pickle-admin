import type { usingCurationExcelProps } from '../type';
import { toast } from 'react-toastify';
import formatDateString from './formatDateString';
import { formatPlayTime } from './formatPlayTime';
import { getSheetsClient } from './auth';

const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;
const STARTROW = 4;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

/**
 * 새 큐레이션 데이터를 시트에 추가
 */
export async function appendNewCurationToExcel(
  newData: usingCurationExcelProps[],
  setProgress: (progress: string) => void,
  setLoading: (loading: boolean) => void,
  sheetName: string
) {
  if (newData.length === 0) {
    toast.info('추가할 데이터가 없습니다.');
    return;
  }

  try {
    setLoading(true);
    const sheets = getSheetsClient();

    // 큐레이션 생성일 기준 최신순으로 정렬 (내림차순)
    const sortedData = [...newData].sort((a, b) => {
      // 1차: 게시 시작일 비교
      const dispStartA = new Date(a.dispStartDtime).getTime();
      const dispStartB = new Date(b.dispStartDtime).getTime();

      if (dispStartB !== dispStartA) {
        return dispStartB - dispStartA;
      }

      // 2차: 큐레이션 생성일 비교
      const createdDateA = new Date(a.curationCreatedAt).getTime();
      const createdDateB = new Date(b.curationCreatedAt).getTime();
      return createdDateB - createdDateA;
    });

    console.log(
      `총 ${sortedData.length}개 큐레이션 데이터를 게시일/생성일 최신순으로 최하단에 추가`
    );

    // 현재 시트의 마지막 행 찾기
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:A`,
    });

    const existingRows = response.result.values?.length || 0;
    let nextRow = Math.max(existingRows + 1, STARTROW);

    // 배치로 나눠서 추가
    const batchSize = 1000;
    const batches = Math.ceil(sortedData.length / batchSize);

    for (let batchIdx = 0; batchIdx < batches; batchIdx++) {
      const batchStart = batchIdx * batchSize;
      const batchEnd = Math.min((batchIdx + 1) * batchSize, sortedData.length);
      const batchData = sortedData.slice(batchStart, batchEnd);

      setProgress(
        `데이터 추가 중... (${batchIdx + 1}/${batches} 배치, ${Math.round((batchEnd / sortedData.length) * 100)}%)`
      );

      const values = batchData.map((row) => [
        row.thumbnailTitle,
        row.curationType,
        row.curationName,
        row.curationDesc,
        row.activeState,
        row.exhibitionState,
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
        formatPlayTime(row.playTime ?? 0),
        row.likeCnt,
        row.listenCnt,
        row.uploader,
      ]);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!B${nextRow}`,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

      nextRow += batchData.length;
      await delay(100);
    }

    setProgress('');
    setLoading(false);
    toast.success(`${newData.length}개의 데이터가 추가되었습니다!`);
  } catch (err: any) {
    console.error('데이터 추가 실패:', err);
    console.error('에러 상세:', err.result?.error);
    console.error('에러 메시지:', err.result?.error?.message);
    setLoading(false);
    setProgress('');

    const errorMessage = err.result?.error?.message || '알 수 없는 오류';
    toast.error(`데이터 추가에 실패했습니다: ${errorMessage}`);
    throw err;
  }
}
