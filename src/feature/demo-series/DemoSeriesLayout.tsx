import DemoListLayout from '../../components/DemoListLayout';
import LoadingOverlay from '../../components/LoadingOverlay';
import type { LanguageCode } from '../../constants/languages';
import { useState } from 'react';

const DemoSeriesLayout = () => {
  const [loading] = useState(false);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('all');

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='시리즈 관리'
      // count={filteredBroadcasting.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='시리즈 추가'
      onAdd={() => {}}
    >
      <LoadingOverlay loading={loading}>
        시리즈 목록을 불러오는 중입니다.
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

export default DemoSeriesLayout;
