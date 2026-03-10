import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingOverlay from '../../components/LoadingOverlay';
import { LANG_COLUMN_MAP, type LanguageCode } from '../../constants/languages';
import DemoListLayout from '../../components/DemoListLayout';
import { supabase } from '../../lib/supabase';
import DemoCategoryList from './DemoCategoryList';

interface Category {
  id: number;
  title: string;
  [key: string]: any;
}

const DemoCategoryLayout = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('ko');
  const [programCounts, setProgramCounts] = useState<Record<number, number>>(
    {}
  );

  // 언어별로 보여줄 컬럼명 매핑 (공통 상수 사용)
  const langColumnMap = LANG_COLUMN_MAP;

  // programs 테이블에서 category_id별 프로그램 수 조회
  useEffect(() => {
    const fetchProgramCounts = async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('category_id, language')
        .returns<{ category_id: number; language: string | string[] }[]>();
      if (error || !data) return;
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
        if (langs.includes(selectedLang)) {
          counts[row.category_id] = (counts[row.category_id] || 0) + 1;
        }
      });
      setProgramCounts(counts);
    };
    fetchProgramCounts();
  }, [selectedLang]);

  // 필터링된 데이터 생성
  const filteredCategories = categories.map((cat) => ({
    id: cat.id,
    title: cat[langColumnMap[selectedLang].title],
    img_url: cat[langColumnMap[selectedLang].img_url],
    order: cat.order,
    created_at: cat.created_at,
    language: cat.language,
    programsCount: programCounts[cat.id] || 0,
  }));

  const fetchCategories = async () => {
    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      setError(error.message);
    } else {
      setCategories(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <DemoListLayout
      parentMenu='데모 콘텐츠 관리'
      childMenu='카테고리 관리'
      count={categories.length}
      selectedLang={selectedLang}
      onLangChange={setSelectedLang}
      addLabel='카테고리 추가'
      onAdd={() => navigate('/demo/category/new')}
    >
      <LoadingOverlay loading={loading}>
        카테고리 목록을 불러오는 중입니다.
      </LoadingOverlay>

      {!loading && !error && (
        <DemoCategoryList
          categories={filteredCategories}
          selectedLang={selectedLang}
          onDeleted={fetchCategories}
        />
      )}
    </DemoListLayout>
  );
};

export default DemoCategoryLayout;
