import type { usingDataProps } from '../type';

export function findChangedData(allData: usingDataProps[]) {
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

export function findUpdateData(newData: usingDataProps[]) {}
