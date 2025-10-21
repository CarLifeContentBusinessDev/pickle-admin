import MenuButton from './components/MenuButton';

const Sidebar = () => {
  return (
    <aside className='w-80 flex-shrink-0 bg-[#1B1E2F] shadow-md'>
      <nav className='mt-5'>
        <ul>
          <li>
            <MenuButton to='/channel-book-list'>채널·도서 관리</MenuButton>
            <MenuButton to='/'>에피소드 관리</MenuButton>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
