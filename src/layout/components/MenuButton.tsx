import { NavLink } from 'react-router-dom';

interface MenuButtonProps {
  children: React.ReactNode;
  to: string;
}

const MenuButton = ({ children, to }: MenuButtonProps) => {
  const activeLinkClass = 'bg-indigo-500 text-white font-bold';
  const defaultLinkClass = 'text-gray-400 hover:bg-gray-700 hover:text-white';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center p-4 transition-colors duration-200 ${
          isActive ? activeLinkClass : defaultLinkClass
        }`
      }
    >
      <span className='mx-4 font-medium'>{children}</span>
    </NavLink>
  );
};

export default MenuButton;
