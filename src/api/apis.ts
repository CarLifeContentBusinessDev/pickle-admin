import { getSheetsClient } from '../utils/auth';

const spreadsheetId = import.meta.env.VITE_SPREADSHEET_ID;

export async function fetchExcelData(
  sheetName: string,
  rangeAddress: string
) {
  try {
    const sheets = getSheetsClient();
    const range = `${sheetName}!${rangeAddress}`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.result.values || [];
  } catch (error) {
    console.error('Excel 데이터 조회 실패:', error);
    throw error;
  }
}
