import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { type LanguageCode } from '../../constants/languages';
import DemoListLayout from '../../components/DemoListLayout';
import type { Broadcasting } from '../../types/demoContents';
import parseLanguages from '../../utils/parseLanguages';
import DemoBroadcastingList from './DemoBroadcastingList';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';

const DemoBroadcastingLayout = () => {
  const navigate = useNavigate();
  const [broadcasting, setBroadcasting] = useState<Broadcasting[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('all');
  const [programCounts, setProgramCounts] = useState<Record<number, number>>(
    {}
  );

  useEffect(() => {
    const fetchProgramCounts = async () => {
      const data = await fetchAllSupabaseRows<{
        broadcasting_id: number;
        language: string | string[];
      }>({
        table: 'programs',
        select: 'broadcasting_id, language',
        orderColumn: 'broadcasting_id',
      });

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
        if (selectedLang === 'all' || langs.includes(selectedLang)) {
          counts[row.broadcasting_id] = (counts[row.broadcasting_id] || 0) + 1;
        }
      });
      setProgramCounts(counts);
    };
    fetchProgramCounts();
  }, [selectedLang]);

  const filteredBroadcasting = (
    selectedLang === 'all'
      ? broadcasting
      : broadcasting.filter((brod) => {
          const langs = parseLanguages(brod.language);
          return langs.includes(selectedLang);
        })
  ).map((brod) => ({
    ...brod,
    programsCount: programCounts[brod.id] || 0,
  }));

  const fetchBroadcasting = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllSupabaseRows<Broadcasting>({
        table: 'broadcastings',
        select: '*',
        orderColumn: 'id',
      });
      setBroadcasting(data);
    } catch (error) {
      setError((error as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBroadcasting();
  }, []);

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='방송사 관리'
      count={filteredBroadcasting.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='방송사 추가'
      onAdd={() => navigate('/demo/broadcasting/new')}
    >
      <LoadingOverlay loading={loading}>
        방송사 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoBroadcastingList
          broadcasting={filteredBroadcasting}
          selectedLang={selectedLang}
          onDeleted={fetchBroadcasting}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoBroadcastingLayout;
