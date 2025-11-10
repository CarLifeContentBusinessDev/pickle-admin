import type { usingDataProps } from '../type';
import { api } from './api';
import { getExcelData } from './updateExcel';

export async function findChangedData(allData: usingDataProps[]) {
  const titleToIdMap = new Map();

  for (const data of allData) {
    const title = data.episodeName;
    const id = data.episodeId;

    if (titleToIdMap.has(title)) {
      titleToIdMap.get(title).push(id);
    } else {
      titleToIdMap.set(title, [id]);
    }
  }

  const allDuplicateIDs = [];
  const episodesToInsert = [];

  for (const idList of titleToIdMap.values()) {
    if (idList.length > 1) {
      allDuplicateIDs.push(...idList);
    }
  }

  for (const data of allData) {
    if (allDuplicateIDs.includes(data.episodeId)) {
      episodesToInsert.push(data);
    }
  }

  return episodesToInsert;
}

export async function findUpdateData(newData: usingDataProps[]) {
  const excelData = (await getExcelData(
    localStorage.getItem('loginToken')!,
    'episode'
  )) as usingDataProps[];

  const excelTitleMap = new Map<string, usingDataProps>();
  for (const item of excelData) {
    const title = String(item.episodeName).trim();
    if (!excelTitleMap.has(title)) {
      excelTitleMap.set(title, item);
    }
  }

  const episodesToUpdate: usingDataProps[] = [];

  const getEpisodeState = async (episodeId: number) => {
    const data = api.get(`admin/episode/${episodeId}`);
    return data;
  };

  for (const newItem of newData) {
    const newTitle = String(newItem.episodeName).trim();

    const matchingExcelItem = excelTitleMap.get(newTitle);

    if (matchingExcelItem) {
      const itemData = await getEpisodeState(matchingExcelItem?.episodeId);
      const dataUsage = itemData.data.data.usageYn;
      episodesToUpdate.push(newItem);
      if (dataUsage === 'N') {
        episodesToUpdate.push(matchingExcelItem);
      }
    }
  }

  return episodesToUpdate;
}
