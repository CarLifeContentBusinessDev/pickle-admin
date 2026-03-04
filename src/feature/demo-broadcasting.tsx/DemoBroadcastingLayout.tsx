import { useEffect, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import LoadingOverlay from '../../components/LoadingOverlay';
import { supabase } from '../../lib/supabase';
import type { Broadcasting } from '../../types/demoContents';
import DemoBroadcastingList from './DemoBroadcastingList';
import { LANGUAGES, type LanguageCode } from '../../constants/languages';

const DemoBroadcastingLayout = () => {
  const [broadcasting, setBroadcasting] = useState<Broadcasting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ko');
  const [programCounts, setProgramCounts] = useState<Record<number, number>>(
    {}
  );

  // programs 테이블에서 broadcasting_id별 프로그램 수 조회 (언어 필터 적용)
  useEffect(() => {
    const fetchProgramCounts = async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('broadcasting_id, language')
        .returns<{ broadcasting_id: number; language: string | string[] }[]>();
      if (error || !data) return;
      const counts: Record<number, number> = {};
      data.forEach((row) => {
        let langs: string[] = [];
        if (Array.isArray(row.language)) {
          langs = row.language;
        } else if (typeof row.language === 'string') {
          try {
            langs = JSON.parse(row.language);
          } catch {
            langs = [row.language];
          }
        }
        if (langs.includes(selectedLang)) {
          counts[row.broadcasting_id] = (counts[row.broadcasting_id] || 0) + 1;
        }
      });
      setProgramCounts(counts);
    };
    fetchProgramCounts();
  }, [selectedLang]);

  // 선택한 언어가 포함된 방송사만 필터링
  const filteredBroadcasting = broadcasting
    .filter((brod) => {
      // 방송사 객체에 language 필드가 있고, 배열 또는 JSON string일 수 있음
      let langs: string[] = [];
      if (Array.isArray(brod.language)) {
        langs = brod.language;
      } else if (typeof brod.language === 'string') {
        try {
          langs = JSON.parse(brod.language);
        } catch {
          langs = [brod.language];
        }
      }
      return langs.includes(selectedLang);
    })
    .map((brod) => ({
      ...brod,
      programsCount: programCounts[brod.id] || 0,
    }));

  useEffect(() => {
    const fetchBroadcasting = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('broadcastings')
        .select('*')
        .order('order', { ascending: true })
        .order('id', { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        setBroadcasting(data || []);
      }
      setLoading(false);
    };
    fetchBroadcasting();
  }, []);

  return (
    <div className='p-10 flex flex-col h-screen'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>데모 방송사 관리</h1>
      <div className='w-full rounded-2xl bg-white flex-1 mt-4 p-8 flex flex-col min-h-0'>
        <div className='flex justify-between items-center flex-shrink-0'>
          <h3 className='text-point-color font-semibold'>
            총{' '}
            <span className='font-extrabold'>
              {filteredBroadcasting.length}
            </span>
            개
          </h3>
          <div className='flex gap-8 items-center'>
            <Dropdown
              value={selectedLang}
              options={[...LANGUAGES]}
              onChange={(v) => setSelectedLang(v as LanguageCode)}
            />
          </div>
        </div>
        <div className='w-full flex-1 gap-4 flex flex-col mt-4 min-h-0'>
          <LoadingOverlay loading={loading}>
            카테고리 목록을 불러오는 중입니다.
            <br />
            잠시만 기다려주세요!
          </LoadingOverlay>
          {!loading && error && (
            <div className='text-red-500 text-center mt-8'>{error}</div>
          )}
          {!loading && !error && (
            <div className='flex-1 overflow-y-auto max-h-[calc(100vh-200px)]'>
              <DemoBroadcastingList
                broadcasting={filteredBroadcasting}
                selectedLang={selectedLang}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoBroadcastingLayout;
