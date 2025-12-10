import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@components/common';

const Layout = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '关于', path: '/about' },
  ];

  return (
    <div>
      <Header logoText="My App" menuItems={menuItems} />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default memo(Layout);
