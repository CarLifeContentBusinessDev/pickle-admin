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
        id: 'curation-list',
        to: '/curation-list',
        label: '큐레이션 관리',
      },
      {
        id: 'channel-book-list',
        to: '/channel-book-list',
        label: '채널·도서 관리',
      },
      {
        id: 'episode',
        to: '/',
        label: '에피소드 관리',
      },
    ],
  },
];
