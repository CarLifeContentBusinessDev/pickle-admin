import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import type { LanguageCode } from '../../constants/languages';
import { useEffect, useState } from 'react';
import type { Sereis } from '../../types/demoContents';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';
import parseLanguages from '../../utils/parseLanguages';
import DemoSeriesList from './DemoSeriesList';

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

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='시리즈 관리'
      count={filteredSeries.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='시리즈 추가'
      onAdd={() => {}}
    >
      <LoadingOverlay loading={loading}>
        시리즈 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoSeriesList
          series={filteredSeries}
          selectedLang={selectedLang}
          onDeleted={fetchSeries}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoSeriesLayout;
