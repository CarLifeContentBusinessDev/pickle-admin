import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ThumbnailPreview } from '../../components/ThumbnailPreview';

const LANG_OPTIONS = [
  { code: 'ko', label: '한국' },
  { code: 'en', label: '북미' },
  { code: 'de', label: '독일' },
  { code: 'jp', label: '일본' },
] as const;

const initialState = {
  title: '',
  channel: '',
  frequency: '',
  img_url: '',
  order: '',
  language: [] as string[],
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

const DemoBroadcastingAdd = () => {
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
    if (!form.title.trim()) {
      setError('방송사 이름은 필수입니다.');
      return;
    }

    if (form.language.length === 0) {
      setError('최소 한 개 이상의 언어를 선택하세요.');
      return;
    }

    setSaving(true);
    setError('');

    const { error } = await supabase.from('broadcastings').insert([
      {
        title: form.title,
        channel: form.channel || null,
        frequency: form.frequency || null,
        img_url: form.img_url || null,
        order: form.order || 0,
        language: form.language,
      },
    ]);

    setSaving(false);

    if (error) setError(error.message);
    else navigate(-1);
  };

  return (
    <div className='p-10 flex flex-col h-screen'>
      <h1 className='text-3xl font-bold mb-8'>방송사 추가</h1>

      <div className='w-full rounded-2xl bg-white flex-1 p-8 flex flex-col overflow-y-auto'>
        <div className='flex flex-col gap-10 mb-10'>
          {/* 🌎 언어 선택 */}
          <Field label='국가 선택'>
            <div className='flex gap-3 flex-wrap'>
              {LANG_OPTIONS.map((lang) => {
                const selected = form.language.includes(lang.code);

                return (
                  <button
                    key={lang.code}
                    type='button'
                    onClick={() => handleLangToggle(lang.code)}
                    className={`px-4 h-10 rounded-full text-sm font-medium transition border
                      ${
                        selected
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-gray-500'
                      }
                    `}
                  >
                    {lang.label}
                  </button>
                );
              })}
            </div>
          </Field>

          {/* 썸네일 영역 */}
          <div className='flex gap-8 items-start'>
            <ThumbnailPreview url={form.img_url} title={form.title} />
          </div>

          {/* 공통 필드 */}
          <div className='grid grid-cols-2 gap-8'>
            <Field label='Title (필수)'>
              <input
                name='title'
                value={form.title}
                onChange={handleChange}
                className='w-full px-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
            </Field>

            <Field label='Order'>
              <input
                type='number'
                name='order'
                value={form.order}
                onChange={handleChange}
                className='w-full px-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
            </Field>

            <Field label='Channel'>
              <input
                name='channel'
                value={form.channel}
                onChange={handleChange}
                className='w-full px-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
            </Field>

            <Field label='Frequency'>
              <input
                name='frequency'
                value={form.frequency}
                onChange={handleChange}
                className='w-full px-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
            </Field>
          </div>
          <div className='flex flex-col gap-5 flex-1'>
            <Field label='Thumbnail URL'>
              <input
                name='img_url'
                value={form.img_url}
                onChange={handleChange}
                className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-900'
              />
            </Field>
          </div>
        </div>

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

export default DemoBroadcastingAdd;
