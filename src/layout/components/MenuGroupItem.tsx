import { useState } from 'react';
import MenuButton from './MenuButton';

interface MenuItem {
  id: string;
  to: string;
  label: string;
  icon?: React.ReactNode;
}

interface MenuGroupItemProps {
  label: string;
  icon: React.ReactNode;
  isSidebarOpen: boolean;
  isActive: boolean;
  items: MenuItem[];
}

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

const MenuGroupItem = ({
  label,
  icon,
  isSidebarOpen,
  isActive,
  items,
}: MenuGroupItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className='relative'
      onMouseEnter={() => !isSidebarOpen && setIsHovered(true)}
      onMouseLeave={() => !isSidebarOpen && setIsHovered(false)}
    >
      <button
        type='button'
        aria-disabled={!isSidebarOpen}
        onClick={() => isSidebarOpen && setIsExpanded((prev) => !prev)}
        className={`w-full flex items-center px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors ${
          isSidebarOpen ? 'justify-between' : 'justify-center cursor-default'
        }`}
      >
        <div className='flex items-center gap-3'>
          {icon && icon}
          {isSidebarOpen && (
            <span
              className={`text-md font-semibold ${isActive ? 'text-white' : ''}`}
            >
              {label}
            </span>
          )}
        </div>
        {isSidebarOpen && <ChevronIcon isOpen={isExpanded} />}
      </button>

      {/* 사이드바 열렸을 때: 인라인 서브메뉴 */}
      {isSidebarOpen && (
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div>
            {items.map((item) => (
              <MenuButton key={item.id} to={item.to} isOpen={true}>
                {item.icon && item.icon}
                <span className='pl-10'>{item.label}</span>
              </MenuButton>
            ))}
          </div>
        </div>
      )}

      {/* 사이드바 접혔을 때: 호버 시 플로팅 서브메뉴 */}
      {!isSidebarOpen && isHovered && (
        <div className='absolute left-full top-0 ml-1 w-48 bg-[#1B1E2F] z-50 rounded-md overflow-hidden'>
          {items.map((item) => (
            <MenuButton key={item.id} to={item.to} isOpen={true}>
              {item.icon && item.icon}
              <span>{item.label}</span>
            </MenuButton>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuGroupItem;
