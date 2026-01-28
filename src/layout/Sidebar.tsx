import { useState } from 'react';
import Button from '../components/Button';
import MenuButton from './components/MenuButton';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`flex-shrink-0 bg-[#1B1E2F] shadow-md transition-all duration-300 ${isOpen ? 'w-80' : 'w-20'}`}
    >
      <div className='flex justify-end my-3 px-3'>
        <Button
          className='!border-none !px-4'
          onClick={() => setIsOpen(!isOpen)}
        >
          <img
            src={isOpen ? '/close.svg' : '/open.svg'}
            alt={isOpen ? '닫기' : '열기'}
            width={24}
            height={24}
          />
        </Button>
      </div>

      <nav className='mt-5'>
        <MenuButton to='/curation-list' isOpen={isOpen}>
          <img src='/quration.svg' width={24} height={24} alt='큐레이션' />
          {isOpen && <span>큐레이션 관리</span>}
        </MenuButton>
        <MenuButton to='/channel-book-list' isOpen={isOpen}>
          <img src='/channel-book.svg' width={24} height={24} alt='채널·도서' />
          {isOpen && <span>채널·도서 관리</span>}
        </MenuButton>
        <MenuButton to='/' isOpen={isOpen}>
          <img src='/episode.svg' width={24} height={24} alt='에피소드' />
          {isOpen && <span>에피소드 관리</span>}
        </MenuButton>
      </nav>
    </aside>
  );
};

export default Sidebar;
