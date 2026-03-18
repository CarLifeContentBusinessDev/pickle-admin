import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import SortControls from '../../components/SortControls';
import type { LanguageCode } from '../../constants/languages';
import { useEffect, useState } from 'react';
import type { Sereis } from '../../types/demoContents';
import useListSort from '../../hook/useListSort';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';
import parseLanguages from '../../utils/parseLanguages';
import DemoSeriesList from './DemoSeriesList';

const SORT_KEY_OPTIONS: Array<{ value: 'id' | 'order'; label: string }> = [
  { value: 'id', label: 'ID 기준' },
  { value: 'order', label: '순위 기준' },
];

const DemoSeriesLayout = () => {
  const [series, setSeries] = useState<Sereis[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('all');

  const fetchSeries = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllSupabaseRows<Sereis>({
        table: 'series',
        select: '*, sections(title)',
        orderColumn: 'id',
      });
      setSeries(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);

  const filteredSeries =
    selectedLang === 'all'
      ? series
      : series.filter((ser) => {
          const langs = parseLanguages(ser.language);
          return langs.includes(selectedLang);
        });

  const {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    sortedData: sortedSeries,
  } = useListSort({
    data: filteredSeries,
    sortOptions: SORT_KEY_OPTIONS,
    initialSortKey: 'id',
    initialSortDirection: 'asc',
    emptyLastOnAscKeys: ['order'],
  });

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='시리즈 관리'
      count={sortedSeries.length}
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
      addLabel='시리즈 추가'
      onAdd={() => {}}
    >
      <LoadingOverlay loading={loading}>
        시리즈 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoSeriesList
          series={sortedSeries}
          selectedLang={selectedLang}
          onDeleted={fetchSeries}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoSeriesLayout;
