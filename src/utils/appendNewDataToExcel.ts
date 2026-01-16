import type { usingChannelProps, usingDataProps } from '../type';
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

function excelDateTime(date: string | number) {
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
 * 새 데이터를 시트의 최상단에 추가 (기존 데이터는 아래로 밀림)
 */
export async function appendNewDataToTop(
  newData: usingChannelProps[],
  setProgress: (progress: string) => void,
  category: 'channel',
  setLoading: (loading: boolean) => void,
  sheetName: string
): Promise<void>;
export async function appendNewDataToTop(
  newData: usingDataProps[],
  setProgress: (progress: string) => void,
  category: 'episode',
  setLoading: (loading: boolean) => void,
  sheetName: string
): Promise<void>;
export async function appendNewDataToTop(
  newData: (usingDataProps | usingChannelProps)[],
  setProgress: (progress: string) => void,
  category: 'episode' | 'channel',
  setLoading: (loading: boolean) => void,
  sheetName: string
): Promise<void>;

export async function appendNewDataToTop(
  newData: (usingDataProps | usingChannelProps)[],
  setProgress: (progress: string) => void,
  category: 'episode' | 'channel',
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

    // 게시일 최신순 → 등록일 최신순으로 정렬 (내림차순)
    const sortedData = [...newData].sort((a, b) => {
      // 1차: 게시일 비교
      const dispDateA = new Date(a.dispDtime).getTime();
      const dispDateB = new Date(b.dispDtime).getTime();

      if (dispDateB !== dispDateA) {
        return dispDateB - dispDateA; // 게시일 최신이 먼저
      }

      // 2차: 게시일이 같으면 등록일 비교
      const createdDateA = new Date(a.createdAt).getTime();
      const createdDateB = new Date(b.createdAt).getTime();
      return createdDateB - createdDateA; // 등록일 최신이 먼저
    });

    console.log(
      `총 ${sortedData.length}개 데이터를 게시일/등록일 최신순으로 최상단에 추가`
    );

    // 시트 ID 가져오기
    const sheetId = await getSheetId(sheetName);

    // 배치로 나눠서 추가
    const batchSize = 5000;
    const batches = Math.ceil(sortedData.length / batchSize);

    for (let batchIdx = 0; batchIdx < batches; batchIdx++) {
      const batchStart = batchIdx * batchSize;
      const batchEnd = Math.min((batchIdx + 1) * batchSize, sortedData.length);
      const batchData = sortedData.slice(batchStart, batchEnd);

      setProgress(
        `데이터 추가 중... (${batchIdx + 1}/${batches} 배치, ${Math.round((batchEnd / sortedData.length) * 100)}%)`
      );

      let values;

      if (category === 'episode') {
        values = (batchData as usingDataProps[]).map((row) => {
          const createdAtStr = excelDateTime(row.createdAt);
          const dispDtimeStr = excelDateTime(row.dispDtime);

          return [
            row.episodeId,
            row.usageYn,
            row.channelName,
            row.episodeName,
            dispDtimeStr,
            createdAtStr,
            formatPlayTime(row.playTime),
            row.likeCnt,
            row.listenCnt,
            row.thumbnailUrl,
            row.audioUrl,
            row.channelId,
          ];
        });
      } else {
        values = (batchData as usingChannelProps[]).map((row) => {
          const createdAtStr = excelDateTime(row.createdAt);
          const dispDtimeStr = excelDateTime(row.dispDtime);

          return [
            row.channelId,
            row.usageYn,
            row.channelName,
            row.vendorName,
            row.categoryName,
            dispDtimeStr,
            row.channelTypeName,
            row.likeCnt,
            row.listenCnt,
            createdAtStr,
            row.interfaceUrl,
            row.thumbnailUrl,
          ];
        });
      }

      // STARTROW 위치에 새 행 삽입
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: 'ROWS',
                  startIndex: STARTROW - 1, // 0-based index
                  endIndex: STARTROW - 1 + batchData.length,
                },
                inheritFromBefore: false,
              },
            },
          ],
        },
      });

      // 새로 삽입된 행에 데이터 입력
      const range = `${sheetName}!B${STARTROW}:M${STARTROW + batchData.length - 1}`;
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });

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

/**
 * 시트 이름으로 시트 ID를 가져옴
 */
async function getSheetId(sheetName: string): Promise<number> {
  try {
    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const availableSheets =
      response.result.sheets?.map((s) => s.properties?.title) || [];

    const sheet = response.result.sheets?.find((s) => {
      const title = s.properties?.title;
      // trim으로 양쪽 공백 제거 후 비교
      return title?.trim() === sheetName.trim();
    });

    if (!sheet || sheet.properties?.sheetId === undefined) {
      throw new Error(
        `시트를 찾을 수 없습니다: "${sheetName}"\n사용 가능한 시트: ${availableSheets.join(', ')}`
      );
    }

    return sheet.properties.sheetId;
  } catch (err) {
    console.error('시트 ID 조회 실패:', err);
    throw err;
  }
}
