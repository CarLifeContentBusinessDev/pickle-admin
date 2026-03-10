import { useState } from 'react';
import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import DemoProgramList from './DemoThemeList';
import type { LanguageCode } from '../../constants/languages';

const DemoThemeLayout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ko');

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='테마 관리'
      // count={filteredBroadcasting.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='테마 추가'
      // onAdd={() => navigate('/demo/program/new')}
    >
      <LoadingOverlay loading={loading}>
        테마 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {/* {!loading && !error && (
        <DemoProgramList
        programs={filteredBroadcasting}
        selectedLang={selectedLang}
        onDeleted={fetchProgram}
        />
      )} */}
    </DemoListLayout>
  );
};

export default DemoThemeLayout;
