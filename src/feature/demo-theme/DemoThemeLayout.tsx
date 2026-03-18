import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import SortControls from '../../components/SortControls';
import type { LanguageCode } from '../../constants/languages';
import { useEffect, useState } from 'react';
import DemoThemeList from './DemoThemeList';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';
import parseLanguages from '../../utils/parseLanguages';
import useListSort from '../../hook/useListSort';
import type { Theme } from '../../types/demoContents';

const SORT_KEY_OPTIONS: Array<{ value: 'id' | 'order'; label: string }> = [
  { value: 'id', label: 'ID 기준' },
  { value: 'order', label: '순위 기준' },
];

const DemoThemeLayout = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('all');

  const fetchThemes = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllSupabaseRows<Theme>({
        table: 'themes',
        select: '*, sections(title)',
      });
      setThemes(data);
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  const filteredTheme =
    selectedLang === 'all'
      ? themes
      : themes.filter((t) => {
          const langs = parseLanguages(t.language);
          return langs.includes(selectedLang);
        });

  const {
    sortKey,
    setSortKey,
    sortDirection,
    setSortDirection,
    sortedData: sortedThemes,
  } = useListSort({
    data: filteredTheme,
    sortOptions: SORT_KEY_OPTIONS,
    initialSortKey: 'id',
    initialSortDirection: 'asc',
    emptyLastOnAscKeys: ['order'],
  });

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='테마 관리'
      count={sortedThemes.length}
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
      addLabel='테마 추가'
      onAdd={() => {}}
    >
      <LoadingOverlay loading={loading}>
        테마 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoThemeList
          themes={sortedThemes}
          selectedLang={selectedLang}
          onDeleted={fetchThemes}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoThemeLayout;
