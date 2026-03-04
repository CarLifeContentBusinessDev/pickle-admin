import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ThumbnailPreview } from '../../components/ThumbnailPreview';

const LANG_OPTIONS = [
  { code: 'ko', label: '한국', titleKey: 'title', imgKey: 'img_url' },
  { code: 'en', label: '북미', titleKey: 'en_title', imgKey: 'en_img_url' },
  { code: 'de', label: '독일', titleKey: 'de_title', imgKey: 'de_img_url' },
  { code: 'jp', label: '일본', titleKey: 'jp_title', imgKey: 'jp_img_url' },
] as const;

const initialState = {
  order: '',
  language: ['ko'],
  title: '',
  img_url: '',
  en_title: '',
  en_img_url: '',
  de_title: '',
  de_img_url: '',
  jp_title: '',
  jp_img_url: '',
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='flex flex-col gap-1.5'>
    <label className='text-xs font-semibold uppercase tracking-widest text-gray-400'>
      {label}
    </label>
    {children}
  </div>
);

const DemoCategoryAdd = () => {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'order' ? Number(value) : value,
    }));
  };

  const handleLangToggle = (lang: string) => {
    if (lang === 'ko') return;

    setForm((prev) => {
      const exists = prev.language.includes(lang);

      return {
        ...prev,
        language: exists
          ? prev.language.filter((l) => l !== lang)
          : [...prev.language, lang],
      };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const { error } = await supabase.from('categories').insert([form]);

    setSaving(false);

    if (error) setError(error.message);
    else navigate(-1);
  };

  return (
    <div className='p-10 flex flex-col h-screen'>
      <h1 className='text-3xl font-bold mb-8'>카테고리 추가</h1>

      <div className='w-full rounded-2xl bg-white flex-1 p-8 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 mb-10'>
          <Field label='국가 선택'>
            <div className='flex gap-3 flex-wrap'>
              {LANG_OPTIONS.map((lang) => {
                const selected = form.language.includes(lang.code);

                return (
                  <button
                    key={lang.code}
                    type='button'
                    disabled={lang.code === 'ko'}
                    onClick={() => handleLangToggle(lang.code)}
                    className={`px-4 h-10 rounded-full text-sm font-medium transition border
              ${
                selected
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
              }
              ${lang.code === 'ko' && 'opacity-60 cursor-default'}
            `}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label='Order (공통)'>
            <input
              type='number'
              name='order'
              value={form.order}
              onChange={handleChange}
              className='w-1/4 px-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
            />
          </Field>
        </div>

        {/* 🌎 국가별 입력 영역 */}
        {LANG_OPTIONS.filter((lang) => form.language.includes(lang.code)).map(
          (lang) => (
            <div key={lang.code} className='mb-14 border-t pt-10'>
              <div className='flex items-center gap-2 mb-6'>
                <span className='font-semibold text-gray-800'>
                  {lang.label}
                </span>
                <span className='text-xs px-2 py-0.5 bg-gray-100 rounded font-mono text-gray-500'>
                  {lang.code}
                </span>
              </div>

              <div className='flex gap-8 items-start'>
                <ThumbnailPreview
                  url={form[lang.imgKey]}
                  title={form[lang.titleKey]}
                />

                <div className='flex flex-col gap-5 flex-1'>
                  <Field label='Title'>
                    <input
                      name={lang.titleKey}
                      value={form[lang.titleKey]}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
                    />
                  </Field>

                  <Field label='Thumbnail URL'>
                    <input
                      name={lang.imgKey}
                      value={form[lang.imgKey]}
                      onChange={handleChange}
                      className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900'
                    />
                  </Field>
                </div>
              </div>
            </div>
          )
        )}

        {/* 버튼 */}
        <div className='flex justify-end gap-3 mt-auto'>
          <button
            onClick={() => navigate(-1)}
            className='px-5 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50'
          >
            취소
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className='px-5 py-2 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2'
          >
            {saving && (
              <div className='w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin' />
            )}
            {saving ? '저장 중...' : '저장하기'}
          </button>
        </div>

        {error && <div className='text-red-500 text-sm mt-4'>{error}</div>}
      </div>
    </div>
  );
};

export default DemoCategoryAdd;
