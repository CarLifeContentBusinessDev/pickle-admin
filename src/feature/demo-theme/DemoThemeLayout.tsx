import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import type { LanguageCode } from '../../constants/languages';
import { useEffect, useState } from 'react';
import DemoThemeList from './DemoThemeList';
import fetchAllSupabaseRows from '../../utils/fetchAllSupabaseRows';
import parseLanguages from '../../utils/parseLanguages';
import type { Theme } from '../../types/demoContents';

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

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='테마 관리'
      count={filteredTheme.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='테마 추가'
      onAdd={() => {}}
    >
      <LoadingOverlay loading={loading}>
        테마 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoThemeList
          themes={filteredTheme}
          selectedLang={selectedLang}
          onDeleted={fetchThemes}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoThemeLayout;
