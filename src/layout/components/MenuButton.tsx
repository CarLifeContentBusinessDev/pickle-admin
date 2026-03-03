import { NavLink } from 'react-router-dom';

interface MenuButtonProps {
  children: React.ReactNode;
  to: string;
  isOpen: boolean;
}

const MenuButton = ({ children, to, isOpen }: MenuButtonProps) => {
  const activeLinkClass = 'bg-indigo-500 text-white font-bold rounded-xl';
  const defaultLinkClass =
    'text-gray-400 hover:bg-gray-700 hover:text-white hover:rounded-xl';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center ${isOpen ? 'p-4 gap-3' : 'p-4 justify-center'} transition-colors duration-200 ${
          isActive ? activeLinkClass : defaultLinkClass
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default MenuButton;
