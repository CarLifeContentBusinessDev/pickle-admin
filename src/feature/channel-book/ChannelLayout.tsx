import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAllData } from '../../utils/fetchAllData';
import { addMissingRows } from '../../utils/updateExcel';
import { getNewData } from '../../utils/getNewData';
import type { usingChannelProps } from '../../type';
import syncNewDataToExcel from '../../utils/syncNewEpisodesToExcel';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import getSheetList from '../../utils/getSheetList';
import ChannelList from './ChannelList';

const CATEGORY = 'channel';

let loginToken = localStorage.getItem('loginToken');
let accessTk = localStorage.getItem('accessToken');

const ChannelLayout = () => {
  const [token, setToken] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [newChannels, setNewChannels] = useState<usingChannelProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [sheetList, setSheetList] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedSheet, setSelectedSheet] = useState(
    localStorage.getItem('sheetName') || ''
  );

  useEffect(() => {
    loginToken = localStorage.getItem('loginToken');
    accessTk = localStorage.getItem('accessToken');
    if (accessTk) {
      setAccessToken(accessTk);
      getSheetList(accessTk, import.meta.env.VITE_FILE_ID).then(setSheetList);
    }
    if (loginToken) {
      setToken(loginToken);
    }
  }, []);

  const handleSelectSheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSheet(value);
    localStorage.setItem('sheetName', value);
  };

  const handleUpdateExcel = async () => {
    if (!token) return toast.warn('로그인을 먼저 해주세요!');
    const result = window.confirm(
      `${localStorage.getItem('sheetName')} 시트에 누락된 데이터를 추가합니다.`
    );
    if (result) {
      setAllLoading(true);
      const allData = await fetchAllData(accessToken, CATEGORY);
      await addMissingRows(allData, token, setProgress, CATEGORY);
      setAllLoading(false);
    }
  };

  const handleSyncExcel = async () => {
    if (!token) return toast.warn('로그인을 먼저 해주세요!');
    setExcelLoading(true);
    await syncNewDataToExcel(newChannels, token, CATEGORY);
    setExcelLoading(false);
  };

  const handleSearchNew = async (token: string, accessToken: string) => {
    setLoading(true);
    const newList = await getNewData(token, accessToken, setProgress, CATEGORY);
    // TODO: getExcelData가 채널 데이터도 읽을 수 있도록 수정 필요
    // 현재는 getExcelData가 에피소드 데이터만 읽어오므로, 새로운 채널을 제대로 비교하지 못할 수 있습니다.
    setNewChannels(newList);
    setLoading(false);
  };

  return (
    <div className='p-10 h-[80%]'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>채널·도서 관리</h1>
      <div className='flex gap-2'>
        <Button onClick={handleUpdateExcel}>전체 에피소드 엑셀로 변환</Button>
        <Button
          href={import.meta.env.VITE_ADMIN_EPI_URL}
          target='_blank'
          rel='noopener noreferrer'
        >
          대시보드 이동
        </Button>
        <LoadingOverlay
          progress={progress}
          vertical={false}
          loading={allLoading}
        ></LoadingOverlay>
      </div>
      <div className='w-full rounded-2xl bg-white h-full mt-4 p-8'>
        <div className='flex justify-between items-center h-[10%]'>
          <h3 className='mb-6 text-[#3c25cc] font-semibold'>
            새로운 채널·도서 총{' '}
            <span className='font-extrabold'>{newChannels.length}</span>개
          </h3>
          <div className='flex gap-8 items-center'>
            <LoadingOverlay vertical={false} loading={excelLoading} />
            <select
              value={selectedSheet}
              onChange={handleSelectSheet}
              className='w-fit appearance-none border border-gray-300 px-4 py-2 pr-10 rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer'
            >
              <option value=''>시트 선택</option>
              {sheetList.map((sheet) => (
                <option key={sheet.id} value={sheet.name}>
                  {sheet.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleSearchNew(token, accessToken)}
              className='cursor-pointer'
            >
              <img src='/redo.svg' alt='재검색' width={22} height={22} />
            </button>
            <Button onClick={handleSyncExcel}>Excel 동기화</Button>
          </div>
        </div>
        <div className='w-full h-[90%]'>
          <div className='min-w-max flex font-bold py-5'>
            <p className='w-[7%] px-2'>ID</p>
            <p className='w-[7%] px-2'>활성화</p>
            <p className='w-[12%] line-clamp-2 px-2'>채널명</p>
            <p className='w-[13%] line-clamp-2 px-2'>채널 타입</p>
            <p className='w-[12%] px-2'>채널 타입</p>
            <p className='w-[9%] px-2'>카테고리</p>
            <p className='w-[7%] px-2'>벤더</p>
            <p className='w-[7%] px-2'>좋아요</p>
            <p className='w-[7%] px-2'>청취</p>
            <p className='w-[12%] px-2'>등록일</p>
          </div>
          <LoadingOverlay progress={progress} loading={loading}>
            새로운 채널·도서 목록을 불러오는 중입니다.
            <br />
            잠시만 기다려주세요!
          </LoadingOverlay>
          {!loading && <ChannelList data={newChannels} />}
        </div>
      </div>
    </div>
  );
};

export default ChannelLayout;
