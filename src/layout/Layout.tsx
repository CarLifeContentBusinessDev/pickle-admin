import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div className='bg-[#F6F7FA] w-screen min-h-screen'>
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
