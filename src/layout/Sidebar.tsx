import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { MENU_GROUPS } from '../constants/sidebarMenus';
import MenuButton from './components/MenuButton';
import MenuGroupItem from './components/MenuGroupItem';

const Sidebar = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
      className={`flex-shrink-0 bg-[#1B1E2F] shadow-md transition-all duration-300 ${
        isOpen ? 'w-80' : 'w-20'
      }`}
    >
      <div className='flex justify-end my-3 px-3'>
        <Button
          className='!border-none !px-4'
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <img
            src={isOpen ? '/close.svg' : '/open.svg'}
            alt={isOpen ? '닫기' : '열기'}
            width={24}
            height={24}
          />
        </Button>
      </div>

      <nav className='mt-5 flex flex-col gap-1'>
        {MENU_GROUPS.map((group, index) => {
          const isActive = group.children.some((item) => item.to === pathname);

          return (
            <div key={group.id}>
              {index > 0 && <hr className='border-white/10 mx-4' />}
              <MenuGroupItem
                key={group.id}
                label={group.label}
                icon={group.icon}
                isSidebarOpen={isOpen}
                isActive={isActive}
              >
                {group.children.map((item) => (
                  <MenuButton key={item.id} to={item.to} isOpen={isOpen}>
                    {isOpen && <span className='pl-8'>{item.label}</span>}
                  </MenuButton>
                ))}
              </MenuGroupItem>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
