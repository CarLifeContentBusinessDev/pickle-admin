export type ExcelRow = (string | number | null)[];

export interface usingDataProps {
  episodeId: number;
  usageYn: string;
  channelName: string;
  episodeName: string;
  dispDtime: string;
  createdAt: string;
  likeCnt: number;
  listenCnt: number;
  playTime: number;
  tags: string;
  tagsAdded: string;
}

export interface usingChannelProps {
  channelId: number;
  usageYn: string;
  channelName: string;
  channelTypeName: string;
  categoryName: string;
  vendorName: string;
  likeCnt: number;
  listenCnt: number;
  createdAt: string;
}

export interface CurationListIdProps {
  curationId: number;
}

export interface usingCurationProps {
  curationType: string;
  curationName: string;
  curationDesc: string;
  dispStartDtime: string;
  dispEndDtime: string;
  createdAt: string;
  episodes: curationEpisodesProps[];
}

export interface curationEpisodesProps {
  channelId: number;
  episodeId: number;
  usageYn: string;
  channelName: string;
  episodeName: string;
  dispDtime: string;
  createdAt: string;
  playTime: number;
  likeCnt: number;
  listenCnt: number;
}

export interface LoginResponseData {
  adminSeq: number;
  email: string;
  adminName: string;
  roleId: string;
  accessToken: string;
  refreshToken: string;
}
