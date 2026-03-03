import { useState } from 'react';

interface MenuGroupItemProps {
  label: string;
  icon: React.ReactNode;
  isSidebarOpen: boolean;
  isActive: boolean;
  children: React.ReactNode;
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

export default MenuGroupItem;
