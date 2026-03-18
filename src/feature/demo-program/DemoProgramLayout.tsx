import { useEffect, useState } from 'react';
import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import DemoProgramList from './DemoProgramList';
import type { LanguageCode } from '../../constants/languages';
import { useNavigate } from 'react-router-dom';
import SortControls from '../../components/SortControls';
import type { Program } from '../../types/demoContents';
import useListSort from '../../hook/useListSort';
import parseLanguages from '../../utils/parseLanguages';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';

const SORT_KEY_OPTIONS: Array<{ value: 'id'; label: string }> = [
  { value: 'id', label: 'ID 기준' },
];

const DemoProgramLayout = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('all');

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllSupabaseRows<Program>({
        table: 'programs',
        select: '*, categories(title), broadcastings(title, channel)',
        orderColumn: 'id',
      });
      setPrograms(data);
    } catch (error) {
      setError((error as Error).message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const filteredPrograms =
    selectedLang === 'all'
      ? programs
      : programs.filter((prog) => {
          const langs = parseLanguages(prog.language);
          return langs.includes(selectedLang);
        });

  const displayPrograms = filteredPrograms.map((prog) => {
    const broadcasting = (prog as any).broadcastings;
    const broadcastingLabel = [broadcasting?.title, broadcasting?.channel]
      .filter(Boolean)
      .join(' ');

    return {
      ...prog,
      broadcastingLabel,
    };
  });

  const {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    sortedData: sortedPrograms,
  } = useListSort({
    data: displayPrograms,
    sortOptions: SORT_KEY_OPTIONS,
    initialSortKey: 'id',
    initialSortDirection: 'asc',
  });

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='프로그램 관리'
      count={sortedPrograms.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      extraControls={
        <SortControls
          sortKey={sortKey}
          sortOptions={SORT_KEY_OPTIONS}
          onSortKeyChange={setSortKey}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
        />
      }
      addLabel='프로그램 추가'
      onAdd={() => navigate('/demo/program/new')}
    >
      <LoadingOverlay loading={loading}>
        프로그램 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoProgramList
          programs={sortedPrograms}
          selectedLang={selectedLang}
          onDeleted={fetchPrograms}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoProgramLayout;
