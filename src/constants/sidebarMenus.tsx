export interface MenuChild {
  id: string;
  to: string;
  label: string;
  icon?: React.ReactNode;
  openInNewTab?: boolean;
}

type MenuGroup =
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      children: MenuChild[];
      to?: never;
      openInNewTab?: never;
    }
  | {
      id: string;
      label: string;
      icon: React.ReactNode;
      to: string;
      children?: never;
      openInNewTab?: boolean;
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
      {
        id: 'stg_episode',
        to: '/stg/episode-list',
        label: '에피소드 관리 (stg)',
      },
      {
        id: 'stg_channel-book-list',
        to: '/stg/channel-book-list',
        label: '채널·도서 관리 (stg)',
      },
      {
        id: 'stg_curation-list',
        to: '/stg/curation-list',
        label: '큐레이션 관리 (stg)',
      },
    ],
  },
  {
    id: 'prod-admin',
    label: '상용 어드민 바로가기',
    icon: '',
    to: import.meta.env.VITE_ADMIN_EPI_URL,
    openInNewTab: true,
  },
  {
    id: 'stg-admin',
    label: '검증 어드민 바로가기',
    icon: '',
    to: import.meta.env.VITE_ADMIN_EPI_URL,
    openInNewTab: true,
  },
];
