import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ThumbnailPreview } from '../../components/ThumbnailPreview';
import { supabase } from '../../lib/supabase';
import type { Broadcasting } from '../../types/demoContents';

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

const DemoBroadcastingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL의 lang 파라미터로 초기 탭 결정
  const initLang = searchParams.get('lang') ?? 'ko';
  const [activeTab, setActiveTab] = useState<'basic' | 'localize'>(
    initLang === 'ko' ? 'basic' : 'localize'
  );

  const [broadcasting, setBroadcasting] = useState<Broadcasting | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from('broadcastings')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('방송사 정보를 불러올 수 없습니다.');
        } else {
          setBroadcasting(data);
        }
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!broadcasting) return;
    setBroadcasting({ ...broadcasting, [e.target.name]: e.target.value });
  };

  const handleLangChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!broadcasting) return;
    const langs = e.target.value.split(',').map((l) => l.trim());
    setBroadcasting({ ...broadcasting, language: langs });
  };

  const handleSave = async () => {
    if (!broadcasting) return;
    setSaving(true);
    const { error } = await supabase
      .from('broadcastings')
      .update({
        title: broadcasting.title,
        channel: broadcasting.channel,
        frequency: broadcasting.frequency,
        img_url: broadcasting.img_url,
        order: broadcasting.order,
        language: broadcasting.language,
      })
      .eq('id', broadcasting.id);
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

  if (!broadcasting) return null;

  return (
    <div className='p-10 flex flex-col h-screen'>
      <div className='flex items-center gap-3 mb-4'>
        <h1 className='text-3xl font-bold indent-1'>방송사 편집</h1>
        <span className='ml-2 px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm font-mono'>
          ID #{broadcasting.id}
        </span>
      </div>

      <div className='w-full rounded-2xl bg-white flex-1 mt-4 p-8 flex flex-col min-h-0'>
        {/* 탭 + 버튼 행 */}
        <div className='flex justify-between items-center flex-shrink-0 mb-6'>
          <div className='flex gap-1 p-1 bg-gray-100 rounded-xl w-fit'>
            {[{ key: 'basic', label: '기본 정보' }].map((tab) => (
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
                url={broadcasting.img_url || ''}
                title={broadcasting.title || ''}
              />

              <div className='grid grid-cols-2 gap-6'>
                <Field label='Title'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='title'
                    value={broadcasting.title || ''}
                    onChange={handleChange}
                    placeholder='title'
                  />
                </Field>
                <Field label='channel'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='channel'
                    value={broadcasting.channel || ''}
                    onChange={handleChange}
                    placeholder='channel'
                  />
                </Field>
                <Field label='frequency'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='frequency'
                    value={broadcasting.frequency || ''}
                    onChange={handleChange}
                    placeholder='frequency'
                  />
                </Field>
                <Field label='Order'>
                  <input
                    className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition'
                    name='order'
                    type='number'
                    value={broadcasting.order ?? ''}
                    onChange={handleChange}
                    placeholder='0'
                  />
                </Field>
              </div>

              <Field label='Thumbnail URL'>
                <input
                  className='w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition font-mono'
                  name='img_url'
                  value={broadcasting.img_url || ''}
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
                    Array.isArray(broadcasting.language)
                      ? broadcasting.language.join(', ')
                      : ''
                  }
                  onChange={handleLangChange}
                  placeholder='ko, en, de, jp'
                />
                {Array.isArray(broadcasting.language) &&
                  broadcasting.language.length > 0 && (
                    <div className='flex gap-1.5 mt-1 flex-wrap'>
                      {broadcasting.language.map((lang) => (
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
        </div>
      </div>
    </div>
  );
};

export default DemoBroadcastingEdit;
