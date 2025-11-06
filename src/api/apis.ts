import { excelApi } from '../utils/api';

export async function fetchExcelData(
  sheetName: string,
  rangeAddress: string
) {
  const url = `/worksheets('${sheetName}')/range(address='${rangeAddress}')?valuesOnly=true`;

  const res = await excelApi.get(url);

  return res.data.values;
}
