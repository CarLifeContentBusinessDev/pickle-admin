import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/Button';
import LoadingOverlay from '../../components/LoadingOverlay';
import { useAccessTokenStore } from '../../store/useAccessTokenStore';
import { useLoginTokenStore } from '../../store/useLoginTokenStore';
import type { usingChannelProps } from '../../type';
import { api, stgApi } from '../../utils/api';
import { appendNewDataToTop } from '../../utils/appendNewDataToExcel';
import { fetchAllData } from '../../utils/fetchAllData';
import { getNewData } from '../../utils/getNewData';
import getSheetList from '../../utils/getSheetList';
import { updateSheetSyncTime } from '../../utils/updateSheetSyncTime';
import { addMissingRows } from '../../utils/updateExcel';
import ChannelList from './ChannelList';

const CATEGORY = 'channel';

const sortChannelsByCreatedAtDesc = (channels: usingChannelProps[]) => {
  return [...channels].sort((a, b) => {
    const createdA = new Date(a.createdAt).getTime();
    const createdB = new Date(b.createdAt).getTime();
    return createdB - createdA;
  });
};

const ChannelLayout = () => {
  const { pathname } = useLocation();
  const { loginToken } = useLoginTokenStore();
  const { accessToken } = useAccessTokenStore();
  const isStaging = pathname.startsWith('/stg');
  const [newChannels, setNewChannels] = useState<usingChannelProps[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);
  const [allLoading, setAllLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [sheetList, setSheetList] = useState<{ id: string; name: string }[]>(
    []
  );
  const defaultSheetName = isStaging ? 'stg_채널 DB' : '채널 DB';
  const sheetStorageKey = isStaging
    ? 'sheetName:channel:stg'
    : 'sheetName:channel:prod';
  const [selectedSheet, setSelectedSheet] = useState(
    localStorage.getItem(sheetStorageKey) || defaultSheetName
  );
  const [addData, setAddData] = useState<usingChannelProps[]>([]);

  const apiInstance = isStaging ? stgApi : api;

  const spreadsheetId = isStaging
    ? import.meta.env.VITE_STG_SPREADSHEET_ID
    : import.meta.env.VITE_SPREADSHEET_ID;

  // AbortController를 ref로 관리
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (loginToken) {
      getSheetList(spreadsheetId).then((list) => {
        setSheetList(list);

        const filteredSheets = list.filter((sheet) =>
          isStaging
            ? sheet.name.startsWith('stg_')
            : !sheet.name.startsWith('stg_')
        );
        const savedSheet = localStorage.getItem(sheetStorageKey);
        const isSavedSheetValid = filteredSheets.some(
          (sheet) => sheet.name === savedSheet
        );
        const hasDefaultSheet = filteredSheets.some(
          (sheet) => sheet.name === defaultSheetName
        );

        const nextSheet = isSavedSheetValid
          ? savedSheet!
          : hasDefaultSheet
            ? defaultSheetName
            : '';

        setSelectedSheet(nextSheet);
        if (nextSheet) {
          localStorage.setItem(sheetStorageKey, nextSheet);
        } else {
          localStorage.removeItem(sheetStorageKey);
        }
      });
    }
  }, [defaultSheetName, isStaging, loginToken, sheetStorageKey, spreadsheetId]);

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
        abortControllerRef.current!.signal,
        apiInstance
      );

    addData().then((data) => {
      setAddData(sortChannelsByCreatedAtDesc(data));
    });

    return () => {
      cancelOngoingWork();
    };
  }, []);

  const handleSelectSheet = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedSheet(value);
    localStorage.setItem(sheetStorageKey, value);
  };

  const handleUpdateExcel = async () => {
    if (!loginToken) return toast.warn('로그인을 먼저 해주세요!');
    const result = window.confirm(
      `${selectedSheet || '선택된'} 시트에 누락된 데이터를 추가합니다.`
    );
    if (result) {
      cancelOngoingWork();
      setAddData([]);

      const allData = await fetchAllData(
        CATEGORY,
        setProgress,
        undefined,
        apiInstance
      );

      await addMissingRows(
        allData,
        loginToken,
        setProgress,
        CATEGORY,
        setAllLoading,
        spreadsheetId
      );
    }
  };

  const handleSyncExcel = async () => {
    if (!loginToken) return toast.warn('로그인을 먼저 해주세요!');
    if (!newChannels) return toast.warn('먼저 새로운 채널을 검색해주세요!');

    const currentSheet = localStorage.getItem(sheetStorageKey) || selectedSheet;
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
        currentSheet,
        true,
        spreadsheetId
      );

      await updateSheetSyncTime(defaultSheetName, spreadsheetId);
    } catch (error) {
      console.error('Excel 동기화 실패:', error);
    } finally {
      setExcelLoading(false);
      setProgress('');
    }
  };

  const handleSearchNew = async (token: string, accessToken: string) => {
    setNewChannels(null);
    cancelOngoingWork();

    setLoading(true);
    setAddData([]);
    const newList = await getNewData(
      token,
      accessToken,
      setProgress,
      CATEGORY,
      apiInstance,
      spreadsheetId
    );

    setProgress('');
    setNewChannels(sortChannelsByCreatedAtDesc(newList));
    setLoading(false);
  };

  return (
    <div className='p-10 flex flex-col h-[90vh]'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>
        채널·도서 관리{isStaging ? ' (스테이징)' : ''}
      </h1>
      <div className='flex gap-2'>
        <Button onClick={handleUpdateExcel}>전체 채널·도서 시트로 변환</Button>
        <Button
          href={
            isStaging
              ? `https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_STG_SPREADSHEET_ID}/edit?gid=902383353#gid=902383353`
              : `https://docs.google.com/spreadsheets/d/${import.meta.env.VITE_SPREADSHEET_ID}/edit?gid=934666118#gid=934666118`
          }
          target='_blank'
          rel='noopener noreferrer'
        >
          Excel 바로가기
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
            <span className='font-extrabold'>{newChannels?.length ?? 0}</span>개
          </h3>
          <div className='flex gap-8 items-center'>
            <LoadingOverlay
              progress={progress}
              vertical={false}
              loading={excelLoading}
            />
            <select
              value={selectedSheet}
              onChange={handleSelectSheet}
              className='w-fit appearance-none border border-gray-300 px-4 py-2 pr-10 rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer'
            >
              <option value=''>시트 선택</option>
              {sheetList
                .filter((sheet) =>
                  isStaging
                    ? sheet.name.startsWith('stg_')
                    : !sheet.name.startsWith('stg_')
                )
                .map((sheet) => (
                  <option key={sheet.id} value={sheet.name}>
                    {sheet.name}
                  </option>
                ))}
            </select>
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
          {!loading && newChannels === null && <ChannelList data={addData} />}
          {!loading && newChannels !== null && (
            <ChannelList data={newChannels} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelLayout;
