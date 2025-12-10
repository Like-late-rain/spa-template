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

  // 示例右侧内容
  const rightContent = (
    <div className="flex items-center gap-3">
      <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
        登录
      </button>
      <button className="px-4 py-2 text-sm font-medium bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
        注册
      </button>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* 浅色主题 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">浅色主题 (Light)</h2>
        <Header
          logoText="My App"
          menuItems={menuItems}
          rightContent={rightContent}
          variant="light"
        />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 深色主题 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">深色主题 (Dark)</h2>
        <Header
          logoText="My App"
          menuItems={menuItems}
          rightContent={
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                登录
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-colors">
                注册
              </button>
            </div>
          }
          variant="dark"
        />
        <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 主题色 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">主题色 (Primary)</h2>
        <Header
          logoText="My App"
          menuItems={menuItems}
          rightContent={
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                登录
              </button>
              <button className="px-4 py-2 text-sm font-medium bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors">
                注册
              </button>
            </div>
          }
          variant="primary"
        />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>

      {/* 带图标的 Header */}
      <div>
        <h2 className="text-2xl font-bold mb-4 px-6">带图标的菜单</h2>
        <Header
          logo={
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
          }
          logoText="My App"
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
          rightContent={rightContent}
          variant="light"
        />
        <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-500">
          页面内容区域
        </div>
      </div>
    </div>
  );
};

export default HeaderExample;
