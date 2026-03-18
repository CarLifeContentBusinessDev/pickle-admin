import DemoEntityDetail from '../../components/DemoEntityDetail';

const EPISODE_FIELD_LABELS = {
  id: 'ID',
  title: '제목',
  programs: '프로그램',
  program_id: '프로그램 ID',
  img_url: '썸네일',
  date: '게시일',
  duration: '재생 시간',
  durtaion: '재생 시간',
  language: '국가',
  audio_file: '오디오 파일',
  audioFile_dubbing: '더빙 오디오 파일',
  order: '순위',
  created_at: '생성일',
} as const;

const EPISODE_FIELD_ORDER = [
  'id',
  'title',
  'programs',
  'program_id',
  'img_url',
  'date',
  'duration',
  'durtaion',
  'language',
  'audio_file',
  'audioFile_dubbing',
  'order',
  'created_at',
];

const EPISODE_SUMMARY_FIELDS = [
  { key: 'created_at', label: '생성일' },
  { key: 'id', label: '에피소드 ID' },
  { key: ['duration', 'durtaion'], label: '재생 시간' },
];

const DemoEpisodeDetail = () => {
  return (
    <DemoEntityDetail
      parentMenu='데모 콘텐츠 관리'
      childMenu='에피소드 상세'
      tableName='episodes'
      listPath='/demo/episode'
      editPath='/demo/episode'
      select='*, programs(title)'
      fieldLabels={EPISODE_FIELD_LABELS}
      fieldOrder={EPISODE_FIELD_ORDER}
      summaryFields={EPISODE_SUMMARY_FIELDS}
    />
  );
};

export default DemoEpisodeDetail;
