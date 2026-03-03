import { useState } from 'react';
import Button from '../components/Button';
import MenuButton from './components/MenuButton';
import { MENU_GROUPS } from '../constants/sidebarMenus';
import { useLocation } from 'react-router-dom';

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    width={24}
    height={24}
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
  >
    <polyline points='6 9 12 15 18 9' />
  </svg>
);

interface MenuGroupItemProps {
  label: string;
  icon: React.ReactNode;
  isSidebarOpen: boolean;
  isActive: boolean;
  children: React.ReactNode;
}

const MenuGroupItem = ({
  label,
  icon,
  isSidebarOpen,
  isActive,
  children,
}: MenuGroupItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div>
      <button
        onClick={() => isSidebarOpen && setIsExpanded((prev) => !prev)}
        className={`w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${
          isSidebarOpen ? 'justify-between' : 'justify-center cursor-default'
        }`}
      >
        <div className='flex items-center gap-3'>
          {icon}
          {isSidebarOpen && (
            <span
              className={`text-md font-semibold ${isActive ? 'text-white' : 'text-gray-400'}`}
            >
              {label}
            </span>
          )}
        </div>
        {isSidebarOpen && <ChevronIcon isOpen={isExpanded} />}
      </button>

      {isSidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-300 bg-[#000c17] ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='m-1 border-white/10'>{children}</div>
        </div>
      )}
    </div>
  );
};

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
            <>
              {index > 0 && (
                <hr
                  key={`divider-${group.id}`}
                  className='border-white/10 mx-4'
                />
              )}
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
            </>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
