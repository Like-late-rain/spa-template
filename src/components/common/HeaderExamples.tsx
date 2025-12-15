/**
 * Header 组件使用示例
 * 这个文件仅用于演示，实际使用时可以删除
 */

import type React from 'react';
import Header from './Header';

/**
 * 基础 Header 示例
 */
export const BasicHeaderExample: React.FC = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '产品', path: '/products' },
    { label: '关于', path: '/about' },
    { label: '联系我们', path: '/contact' },
  ];

  return <Header logoText="我的应用" menuItems={menuItems} />;
};

/**
 * 带自定义 Logo 的 Header 示例
 */
export const HeaderWithCustomLogo: React.FC = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '服务', path: '/services' },
  ];

  const customLogo = (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: '#1890ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
      }}
    >
      MA
    </div>
  );

  return <Header logo={customLogo} logoText="My App" menuItems={menuItems} />;
};

/**
 * 带右侧内容的 Header 示例
 */
export const HeaderWithRightContent: React.FC = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '文档', path: '/docs' },
    { label: '博客', path: '/blog' },
  ];

  const rightContent = (
    <>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          border: '1px solid #1890ff',
          backgroundColor: 'transparent',
          color: '#1890ff',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        登录
      </button>
      <button
        type="button"
        style={{
          padding: '8px 16px',
          border: 'none',
          backgroundColor: '#1890ff',
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        注册
      </button>
    </>
  );

  return <Header logoText="平台" menuItems={menuItems} rightContent={rightContent} />;
};

/**
 * 带图标的菜单项示例
 */
export const HeaderWithIcons: React.FC = () => {
  const menuItems = [
    {
      label: '首页',
      path: '/',
      icon: <span style={{ fontSize: '18px' }}>🏠</span>,
    },
    {
      label: '搜索',
      path: '/search',
      icon: <span style={{ fontSize: '18px' }}>🔍</span>,
    },
    {
      label: '设置',
      path: '/settings',
      icon: <span style={{ fontSize: '18px' }}>⚙️</span>,
    },
  ];

  return <Header logoText="App" menuItems={menuItems} />;
};

/**
 * 自定义颜色的 Header 示例
 */
export const CustomColorHeader: React.FC = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '产品', path: '/products' },
    { label: '关于', path: '/about' },
  ];

  return (
    <Header
      logoText="Dark Theme"
      menuItems={menuItems}
      backgroundColor="#1a1a1a"
      textColor="#ffffff"
      activeColor="#52c41a"
    />
  );
};

/**
 * 简单的 Header（仅 Logo）
 */
export const SimpleHeader: React.FC = () => {
  return <Header logoText="Simple App" />;
};

/**
 * 带用户头像的完整示例
 */
export const CompleteHeaderExample: React.FC = () => {
  const menuItems = [
    { label: '工作台', path: '/dashboard' },
    { label: '项目', path: '/projects' },
    { label: '团队', path: '/team' },
  ];

  const userAvatar = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span style={{ fontSize: '14px', color: '#666' }}>欢迎，张三</span>
      <div
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: '#1890ff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        张三
      </div>
    </div>
  );

  return <Header logoText="企业平台" menuItems={menuItems} rightContent={userAvatar} />;
};
