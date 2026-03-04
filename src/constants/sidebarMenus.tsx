export interface MenuChild {
  id: string;
  to: string;
  label: string;
  icon?: React.ReactNode;
}

type MenuGroup =
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      children: MenuChild[];
      to?: never;
    }
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      children?: never;
      to: string;
    };

export const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'data-management',
    label: '상용 콘텐츠 관리',
    icon: (
      <img src='/radio.svg' width={24} height={24} alt='상용 콘텐츠 관리' />
    ),
    children: [
      {
        id: 'episode',
        to: '/',
        label: '에피소드 관리',
      },
      {
        id: 'channel-book-list',
        to: '/channel-book-list',
        label: '채널·도서 관리',
      },
      {
        id: 'curation-list',
        to: '/curation-list',
        label: '큐레이션 관리',
      },
    ],
  },
  {
    id: 'demo-data-mannagement',
    label: '데모 콘텐츠 관리',
    icon: (
      <img
        src='/radio-fill.svg'
        width={24}
        height={24}
        alt='데모 콘텐츠 관리'
      />
    ),
    children: [
      { id: 'programs', to: '/demo/program-list', label: '프로그램 관리' },
      { id: 'episodes', to: '/demo/episode-list', label: '에피소드 관리' },
      { id: 'series', to: '/demo/series-list', label: '시리즈 관리' },
      { id: 'themes', to: '/demo/theme-list', label: '테마 관리' },
      { id: 'categories', to: '/demo/category-list', label: '카테고리 관리' },
      {
        id: 'broadcastings',
        to: '/demo/broadcasting-list',
        label: '방송사 관리',
      },
    ],
  },
];
