import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { fetchAllData } from '../../utils/fetchAllData';
import { addMissingRows } from '../../utils/updateExcel';
import { getNewData } from '../../utils/getNewData';
import type { usingChannelProps } from '../../type';
import { appendNewDataToTop } from '../../utils/appendNewDataToExcel';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import getSheetList from '../../utils/getSheetList';
import ChannelList from './ChannelList';
import { useLoginTokenStore } from '../../store/useLoginTokenStore';
import { useAccessTokenStore } from '../../store/useAccessTokenStore';
import SheetSelect from '../../components/SheetSelect';

const CATEGORY = 'channel';

const ChannelLayout = () => {
  const { loginToken } = useLoginTokenStore();
  const { accessToken } = useAccessTokenStore();
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
  const [addData, setAddData] = useState<usingChannelProps[]>([]);

  // AbortController를 ref로 관리
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (loginToken) {
      getSheetList(loginToken, import.meta.env.VITE_FILE_ID).then(setSheetList);
    }
  }, []);

  const cancelOngoingWork = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  useEffect(() => {
    cancelOngoingWork();

    abortControllerRef.current = new AbortController();

    const addData = async () =>
      await fetchAllData(
        CATEGORY,
        setProgress,
        abortControllerRef.current!.signal
      );

    addData().then(setAddData);

    return () => {
      cancelOngoingWork();
    };
  }, []);

  const handleSelectSheetDropdown = (value: string) => {
    setSelectedSheet(value);
    localStorage.setItem('sheetName', value);
  };

  const handleUpdateExcel = async () => {
    if (!loginToken) return toast.warn('로그인을 먼저 해주세요!');
    const result = window.confirm(
      `${localStorage.getItem('sheetName')} 시트에 누락된 데이터를 추가합니다.`
    );
    if (result) {
      cancelOngoingWork();
      setAddData([]);

      const allData = await fetchAllData(CATEGORY, setProgress);
      await addMissingRows(
        allData,
        loginToken,
        setProgress,
        CATEGORY,
        setAllLoading
      );
    }
  };

  const handleSyncExcel = async () => {
    if (!loginToken) return toast.warn('로그인을 먼저 해주세요!');

    const currentSheet = localStorage.getItem('sheetName') || '';
    if (!currentSheet) {
      return toast.warn('시트를 먼저 선택해주세요!');
    }

    cancelOngoingWork();
    setAddData([]);

    try {
      await appendNewDataToTop(
        newChannels,
        setProgress,
        CATEGORY,
        setExcelLoading,
        currentSheet
      );
    } catch (error) {
      console.error('Excel 동기화 실패:', error);
    } finally {
      setExcelLoading(false);
      setProgress('');
    }
  };

  const handleSearchNew = async (token: string, accessToken: string) => {
    cancelOngoingWork();

    setLoading(true);
    setAddData([]);
    const newList = await getNewData(token, accessToken, setProgress, CATEGORY);
    setProgress('');
    setNewChannels(newList);
    setLoading(false);
  };

  return (
    <div className='p-10 flex flex-col h-[90vh]'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>채널·도서 관리</h1>
      <div className='flex gap-2'>
        <Button onClick={handleUpdateExcel}>전체 채널·도서 시트로 변환</Button>
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
      <div className='w-full rounded-2xl bg-white flex-1 mt-4 p-8 flex flex-col min-h-0'>
        <div className='flex justify-between items-center flex-shrink-0'>
          <h3 className='text-point-color font-semibold'>
            새로운 채널·도서 총{' '}
            <span className='font-extrabold'>{newChannels.length}</span>개
          </h3>
          <div className='flex gap-8 items-center'>
            <LoadingOverlay
              progress={progress}
              vertical={false}
              loading={excelLoading}
            />
            <SheetSelect
              value={selectedSheet}
              options={sheetList}
              onChange={handleSelectSheetDropdown}
            />
            <button
              onClick={() => handleSearchNew(loginToken, accessToken)}
              className='cursor-pointer'
            >
              <img src='/redo.svg' alt='재검색' width={22} height={22} />
            </button>
            <Button onClick={handleSyncExcel}>Excel 동기화</Button>
          </div>
        </div>
        <div className='w-full flex-1 flex flex-col mt-4 min-h-0'>
          <LoadingOverlay progress={progress} loading={loading}>
            새로운 채널·도서 목록을 불러오는 중입니다.
            <br />
            잠시만 기다려주세요!
          </LoadingOverlay>
          {!loading && newChannels.length === 0 && (
            <ChannelList data={addData} />
          )}
          {!loading && newChannels.length > 0 && (
            <ChannelList data={newChannels} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelLayout;
