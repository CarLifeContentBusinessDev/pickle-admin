import { useEffect, useState } from 'react';
import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import { type LanguageCode } from '../../constants/languages';
import { useNavigate } from 'react-router-dom';
import type { Episode } from '../../types/demoContents';
import { supabase } from '../../lib/supabase';
import parseLanguages from '../../utils/parseLanguages';
import DemoEpisodeList from './DemoEpisodeList';

const DemoEpisodeLayout = () => {
  const navigate = useNavigate();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ko');

  const fetchEpisodes = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('episodes')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setEpisodes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const filteredEpisodes = episodes.filter((ep) => {
    const langs = parseLanguages(ep.language);
    return langs.includes(selectedLang);
  });

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='에피소드 관리'
      count={filteredEpisodes.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='에피소드 추가'
      onAdd={() => navigate('/demo/program/new')}
    >
      <LoadingOverlay loading={loading}>
        에피소드 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoEpisodeList
          episodes={filteredEpisodes}
          selectedLang={selectedLang}
          onDeleted={fetchEpisodes}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoEpisodeLayout;
