import type React from 'react';
import Header from '../components/common/Header';

/**
 * Header 组件使用示例
 * 展示三种不同的 Header 变体
 */
const HeaderExample: React.FC = () => {
  // 示例菜单项
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '关于', path: '/about' },
    { label: 'Demo', path: '/demo' },
  ];

  return (
    <div className="space-y-8">
      {/* 浅色主题 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">浅色主题 (Light)</h2>
        <Header menuItems={menuItems} />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 深色主题 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">深色主题 (Dark)</h2>
        <Header menuItems={menuItems} />
        <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 主题色 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">主题色 (Primary)</h2>
        <Header menuItems={menuItems} />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 带图标的 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">带图标的菜单</h2>
        <Header
          menuItems={[
            {
              label: '首页',
              path: '/',
              icon: <span>🏠</span>,
            },
            {
              label: '关于',
              path: '/about',
              icon: <span>ℹ️</span>,
            },
            {
              label: 'Demo',
              path: '/demo',
              icon: <span>🎨</span>,
            },
          ]}
        />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>
    </div>
  );
};

export default HeaderExample;
