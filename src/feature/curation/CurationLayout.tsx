import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { fetchAllCurationData } from '../../utils/fetchAllData';
import type { usingCurationExcelProps } from '../../type';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import getSheetList from '../../utils/getSheetList';
import { addMissingCurationRows } from '../../utils/updateCuration';
import { getNewCurationData } from '../../utils/getNewCuration';
import CurationList from './CurationList';
import syncNewCurationToExcel from '../../utils/syncNewCurationToExcel';

let loginToken = localStorage.getItem('loginToken');

const CurationLayout = () => {
  const [token, setToken] = useState('');
  const [newCurations, setNewCurations] = useState<usingCurationExcelProps[]>(
    []
  );
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
    if (loginToken) {
      setToken(loginToken);
      getSheetList(loginToken, import.meta.env.VITE_FILE_ID).then(setSheetList);
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
      const allData = await fetchAllCurationData();
      await addMissingCurationRows(allData, token, setProgress);
      setProgress('');
      setAllLoading(false);
    }
  };

  const handleSyncExcel = async () => {
    if (!token) return toast.warn('로그인을 먼저 해주세요!');
    setExcelLoading(true);
    await syncNewCurationToExcel(newCurations, token, setProgress);
    setProgress('');
    setExcelLoading(false);
  };

  const handleSearchNew = async (token: string) => {
    setLoading(true);
    const newList = await getNewCurationData(token, setProgress);
    setProgress('');
    setNewCurations(newList);
    setLoading(false);
  };

  return (
    <div className='p-10 h-[80%]'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>큐레이션 관리</h1>
      <div className='flex gap-2'>
        <Button onClick={handleUpdateExcel}>전체 큐레이션 시트로 변환</Button>
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
            새로운 큐레이션 총{' '}
            <span className='font-extrabold'>{newCurations.length}</span>개
          </h3>
          <div className='flex gap-8 items-center'>
            <LoadingOverlay progress={progress} vertical={false} loading={excelLoading} />
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
              onClick={() => handleSearchNew(token)}
              className='cursor-pointer'
            >
              <img src='/redo.svg' alt='재검색' width={22} height={22} />
            </button>
            <Button onClick={handleSyncExcel}>Excel 동기화</Button>
          </div>
        </div>
        <div className='w-full h-[90%] flex flex-col'>
          <div className='min-w-max flex font-bold py-5'>
            <p className='w-[10%] px-1'>큐레이션 타입</p>
            <p className='w-[7%] px-1'>상태</p>
            <p className='w-[13%] line-clamp-2 px-1'>큐레이션명</p>
            <p className='w-[12%] line-clamp-2 px-1'>큐레이션 설명</p>
            <p className='w-[17%] px-1'>게시 기간</p>
            <p className='w-[9%] px-1'>등록 일시</p>
            <p className='w-[12%] px-1'>채널명</p>
            <p className='w-[13%] px-1'>에피소드명</p>
          </div>
          <LoadingOverlay progress={progress} loading={loading}>
            새로운 큐레이션 목록을 불러오는 중입니다.
            <br />
            잠시만 기다려주세요!
          </LoadingOverlay>
          {!loading && <CurationList data={newCurations} />}
        </div>
      </div>
    </div>
  );
};

export default CurationLayout;
