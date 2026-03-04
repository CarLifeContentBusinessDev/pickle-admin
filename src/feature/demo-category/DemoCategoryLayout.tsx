import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LoadingOverlay from '../../components/LoadingOverlay';
import DemoCategoryList from './DemoCategoryList';

interface Category {
  id: number;
  title: string;
  [key: string]: any;
}

const DemoCategoryLayout = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedLang, setSelectedLang] = useState<'ko' | 'en' | 'de' | 'jp'>(
    'ko'
  );
  const [programCounts, setProgramCounts] = useState<Record<number, number>>(
    {}
  );

  // 언어별로 보여줄 컬럼명 매핑
  const langColumnMap = {
    ko: { title: 'title', img_url: 'img_url' },
    en: { title: 'en_title', img_url: 'en_img_url' },
    de: { title: 'de_title', img_url: 'de_img_url' },
    jp: { title: 'jp_title', img_url: 'jp_img_url' },
  };

  // programs 테이블에서 category_id별 프로그램 수 조회
  useEffect(() => {
    const fetchProgramCounts = async () => {
      const { data, error } = await supabase
        .from('programs')
        .select('category_id, language')
        .returns<{ category_id: number; language: string | string[] }[]>();
      if (error || !data) return;
      // 언어별로 카운트
      const counts: Record<number, number> = {};
      data.forEach((row) => {
        // 언어 필터: 선택된 언어가 포함된 프로그램만 카운트
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

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('id', { ascending: true });
      if (error) {
        setError(error.message);
      } else {
        setCategories(data || []);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className='p-10 flex flex-col h-screen'>
      <h1 className='text-3xl font-bold mb-4 indent-1'>데모 카테고리 관리</h1>
      <div className='w-full rounded-2xl bg-white flex-1 mt-4 p-8 flex flex-col min-h-0'>
        <div className='flex justify-between items-center flex-shrink-0'>
          <h3 className='text-point-color font-semibold'>
            새로운 카테고리 총{' '}
            <span className='font-extrabold'>{categories.length}</span>개
          </h3>
          <div className='flex gap-8 items-center'>
            <select
              value={selectedLang}
              onChange={(e) =>
                setSelectedLang(e.target.value as 'ko' | 'en' | 'de' | 'jp')
              }
              className='w-fit appearance-none border border-gray-300 px-4 py-2 pr-10 rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition cursor-pointer'
            >
              <option value='ko'>한국(ko)</option>
              <option value='en'>영어(en)</option>
              <option value='de'>독일어(de)</option>
              <option value='jp'>일본어(jp)</option>
            </select>
          </div>
        </div>
        <div className='w-full flex-1 gap-4 flex flex-col mt-4 min-h-0'>
          <LoadingOverlay loading={loading}>
            카테고리 목록을 불러오는 중입니다.
            <br />
            잠시만 기다려주세요!
          </LoadingOverlay>
          {!loading && error && (
            <div className='text-red-500 text-center mt-8'>{error}</div>
          )}
          {!loading && !error && (
            <div className='flex-1 overflow-y-auto max-h-[calc(100vh-200px)]'>
              <DemoCategoryList categories={filteredCategories} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoCategoryLayout;
