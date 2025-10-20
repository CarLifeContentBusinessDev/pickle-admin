import axios from 'axios';
import { getGraphToken } from './auth';

const getSheetList = async (loginToken: string, fileId: string) => {
  if (!loginToken || !fileId) return [];
  const url = `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/workbook/worksheets`;

  try {
    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${loginToken}`,
      },
    });
    return res.data.value;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 401) {
      console.warn('토큰 만료, 재발급 시도');
      const newToken = await getGraphToken();

      if (!newToken) {
        console.error('토큰 재발급 실패');
        return [];
      }

      try {
        const retryRes = await axios.get(url, {
          headers: { Authorization: `Bearer ${newToken}` },
        });

        localStorage.setItem('accessToken', newToken);

        return retryRes.data.value;
      } catch (retryErr) {
        console.error('토큰 재발급 후에도 실패:', retryErr);
        return [];
      }
    } else {
      console.error('시트 목록 조회 실패:', err);
      return [];
    }
  }
};

export default getSheetList;
