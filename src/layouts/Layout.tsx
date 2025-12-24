import { Header } from '@components/common';
import { memo } from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const menuItems = [
    { label: '首页', path: '/' },
    { label: '课程市场', path: '/market' },
    { label: '创建课程', path: '/create-course' },
    { label: '兑换中心', path: '/exchange' },
    { label: '理财', path: '/aave' },
    { label: '个人中心', path: '/profile' },
    { label: '主题展示', path: '/theme-display' },
    {
      label: 'Demo',
      children: [
        { label: 'Why Did You Render', path: '/demo/wdyr' },
        { label: 'Jotai 状态管理', path: '/demo/jotai' },
        { label: '合约demo', path: '/demo/contract' },
        // 后续可以在这里添加更多 demo
      ],
    },
  ];

  return (
    <div className="relative flex flex-col h-screen">
      {/* 动态背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-cyan/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-72 h-72 bg-cyber-blue/10 rounded-full blur-3xl animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>
      {/* 导航栏 */}
      <Header menuItems={menuItems} />

      {/* 主内容区 */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="relative z-10 mt-20 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* 关于我们 */}
            <div>
              <h3 className="text-lg font-bold gradient-text mb-4">Web3 涂山大学</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                基于区块链技术的去中心化在线课程平台，打造未来教育新生态。
              </p>
            </div>

            {/* 快速链接 */}
            <div>
              <h3 className="text-lg font-bold text-cyber-cyan mb-4">快速链接</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="/" className="hover:text-cyber-cyan transition">
                    首页
                  </a>
                </li>
                <li>
                  <a href="/market" className="hover:text-cyber-cyan transition">
                    课程市场
                  </a>
                </li>
                <li>
                  <a href="/exchange" className="hover:text-cyber-cyan transition">
                    代币兑换
                  </a>
                </li>
                <li>
                  <a href="/aave" className="hover:text-cyber-cyan transition">
                    AAVE 理财
                  </a>
                </li>
              </ul>
            </div>

            {/* 联系方式 */}
            <div>
              <h3 className="text-lg font-bold text-cyber-purple mb-4">联系我们</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>邮箱: contact@web3-university.com</li>
                <li>Discord: Web3 University</li>
                <li>Twitter: @Web3University</li>
              </ul>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
              <p>&copy; 2024 Web3 涂山大学. All rights reserved.</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="/privacy" className="hover:text-cyber-cyan transition">
                  隐私政策
                </a>
                <a href="/terms" className="hover:text-cyber-cyan transition">
                  服务条款
                </a>
                <a href="/help" className="hover:text-cyber-cyan transition">
                  帮助中心
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default memo(Layout);
