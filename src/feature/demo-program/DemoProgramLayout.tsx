import { useEffect, useState } from 'react';
import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import DemoProgramList from './DemoProgramList';
import type { LanguageCode } from '../../constants/languages';
import { useNavigate } from 'react-router-dom';
import type { Program } from '../../types/demoContents';
import { supabase } from '../../lib/supabase';
import parseLanguages from '../../utils/parseLanguages';

const DemoProgramLayout = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ko');

  const fetchPrograms = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .order('id', { ascending: true });
    if (error) {
      setError(error.message);
    } else {
      setPrograms(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter((prog) => {
    const langs = parseLanguages(prog.language);
    return langs.includes(selectedLang);
  });

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='프로그램 관리'
      count={filteredPrograms.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='프로그램 추가'
      onAdd={() => navigate('/demo/program/new')}
    >
      <LoadingOverlay loading={loading}>
        프로그램 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoProgramList
          programs={filteredPrograms}
          selectedLang={selectedLang}
          onDeleted={fetchPrograms}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoProgramLayout;
