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

export interface LoginResponseData {
  adminSeq: number;
  email: string;
  adminName: string;
  roleId: string;
  accessToken: string;
  refreshToken: string;
}
