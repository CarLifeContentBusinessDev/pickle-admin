import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import type { Category } from '../../types/demoContents';
import { ThumbnailPreview } from '../../components/ThumbnailPreview';

const LANG_SECTIONS = [
  { lang: 'en', label: '북미', titleKey: 'en_title', imgKey: 'en_img_url' },
  { lang: 'de', label: '독일', titleKey: 'de_title', imgKey: 'de_img_url' },
  { lang: 'jp', label: '일본', titleKey: 'jp_title', imgKey: 'jp_img_url' },
] as const;

const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div className='flex flex-col gap-1.5'>
    <label className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
      {label}
    </label>
    {children}
    {hint && <p className='text-xs text-gray-400'>{hint}</p>}
  </div>
);

const DemoCategoryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL의 lang 파라미터로 초기 탭 결정
  const initLang = searchParams.get('lang') ?? 'ko';
  const [activeTab, setActiveTab] = useState<'basic' | 'localize'>(
    initLang === 'ko' ? 'basic' : 'localize'
  );

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // 해당 언어 섹션으로 스크롤하기 위한 ref map
  const langRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('카테고리 정보를 불러올 수 없습니다.');
        } else {
          setCategory(data);
        }
        setLoading(false);
      });
  }, [id]);

  // 데이터 로드 후 해당 언어 섹션으로 스크롤
  useEffect(() => {
    if (!category || activeTab !== 'localize') return;
    const el = langRefs.current[initLang];
    if (el) {
      setTimeout(
        () => el.scrollIntoView({ behavior: 'smooth', block: 'start' }),
        100
      );
    }
  }, [category, activeTab, initLang]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    setCategory({ ...category, [e.target.name]: e.target.value });
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    const langs = e.target.value.split(',').map((l) => l.trim());
    setCategory({ ...category, language: langs });
  };

  const handleSave = async () => {
    if (!category) return;
    setSaving(true);
    const { error } = await supabase
      .from('categories')
      .update({
        title: category.title,
        img_url: category.img_url,
        order: category.order,
        en_title: category.en_title,
        en_img_url: category.en_img_url,
        de_title: category.de_title,
        de_img_url: category.de_img_url,
        jp_title: category.jp_title,
        jp_img_url: category.jp_img_url,
        language: category.language,
      })
      .eq('id', category.id);
    setSaving(false);
    if (error) {
      console.error('Supabase update error:', error);
      setError(`저장에 실패했습니다: ${error.message}`);
    } else {
      navigate(-1);
    }
  };

  if (loading)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='flex flex-col items-center gap-3'>
          <div className='w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin' />
          <p className='text-sm text-gray-400'>불러오는 중...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <p className='text-red-500 font-medium'>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className='mt-4 text-sm text-gray-500 underline'
          >
            돌아가기
          </button>
        </div>
      </div>
    );

  if (!category) return null;

  return (
    <div className='p-10 flex flex-col h-screen'>
      <div className='flex items-center gap-3 mb-4'>
        <h1 className='text-3xl font-bold indent-1'>카테고리 편집</h1>
        <span className='ml-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm font-mono'>
          ID #{category.id}
        </span>
      </div>

      <div className='w-full rounded-2xl bg-white flex-1 mt-4 p-8 flex flex-col min-h-0'>
        {/* 탭 + 버튼 행 */}
        <div className='flex justify-between items-center flex-shrink-0 mb-6'>
          <div className='flex gap-1 p-1 bg-gray-100 rounded-xl w-fit'>
            {[
              { key: 'basic', label: '기본 정보 (한국)' },
              { key: 'localize', label: '해외 설정' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'basic' | 'localize')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className='flex gap-3'>
            <button
              onClick={() => navigate(-1)}
              className='px-5 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition'
            >
              취소
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className='px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2'
            >
              {saving && (
                <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
              )}
              {saving ? '저장 중...' : '저장하기'}
            </button>
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <div className='flex-1 overflow-y-auto min-h-0'>
          {activeTab === 'basic' && (
            <div className='flex flex-col gap-6'>
              <ThumbnailPreview
                url={category.img_url || ''}
                title={category.title || ''}
              />

              <div className='grid grid-cols-2 gap-6'>
                <Field label='Title (한국어)'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='title'
                    value={category.title || ''}
                    onChange={handleChange}
                    placeholder='카테고리 제목'
                  />
                </Field>
                <Field label='Order'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='order'
                    type='number'
                    value={category.order ?? ''}
                    onChange={handleChange}
                    placeholder='0'
                  />
                </Field>
              </div>

              <Field label='Thumbnail URL'>
                <input
                  className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition font-mono'
                  name='img_url'
                  value={category.img_url || ''}
                  onChange={handleChange}
                  placeholder='https://...'
                />
              </Field>

              <Field
                label='Language'
                hint='지원할 언어를 쉼표로 구분하여 입력하세요. 예: ko, en, de, jp'
              >
                <input
                  className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                  name='language'
                  value={
                    Array.isArray(category.language)
                      ? category.language.join(', ')
                      : ''
                  }
                  onChange={handleLangChange}
                  placeholder='ko, en, de, jp'
                />
                {Array.isArray(category.language) &&
                  category.language.length > 0 && (
                    <div className='flex gap-1.5 mt-1 flex-wrap'>
                      {category.language.map((lang) => (
                        <span
                          key={lang}
                          className='px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium'
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  )}
              </Field>
            </div>
          )}

          {activeTab === 'localize' && (
            <div className='flex flex-col divide-y divide-gray-100'>
              {LANG_SECTIONS.map((section) => {
                const isActive = section.lang === initLang;
                return (
                  <div
                    key={section.lang}
                    ref={(el) => {
                      langRefs.current[section.lang] = el;
                    }}
                    className={`py-6 rounded-xl transition-colors duration-500 px-4 ${
                      isActive ? 'bg-blue-50 ring-1 ring-blue-100' : ''
                    }`}
                  >
                    <div className='flex items-center gap-2 mb-4'>
                      <span className='font-semibold text-gray-700 text-sm'>
                        {section.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-mono ${
                          isActive
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {section.lang}
                      </span>
                      {isActive && (
                        <span className='text-xs text-blue-500 font-medium'>
                          현재 편집 중
                        </span>
                      )}
                    </div>

                    <div className='flex gap-6 items-start'>
                      <ThumbnailPreview
                        url={(category[section.imgKey] as string) || ''}
                        title={(category[section.titleKey] as string) || ''}
                      />
                      <div className='flex flex-col gap-4 flex-1'>
                        <Field label='Title'>
                          <input
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                            name={section.titleKey}
                            value={(category[section.titleKey] as string) || ''}
                            onChange={handleChange}
                            placeholder={`${section.label} 제목`}
                          />
                        </Field>
                        <Field label='Thumbnail URL'>
                          <input
                            className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition font-mono'
                            name={section.imgKey}
                            value={(category[section.imgKey] as string) || ''}
                            onChange={handleChange}
                            placeholder='https://...'
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoCategoryEdit;
