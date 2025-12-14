import type React from 'react';
import { memo } from 'react';

/**
 * Tailwind CSS 演示页面 - 未来科技感
 * 展示赛博朋克风格的 Tailwind 样式和组件
 */
const TailwindDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      {/* 页面标题 */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center text-cyber-cyan mb-4 animate-slide-down">
          主题展示
        </h1>
        <p className="text-center text-cyber-blue mb-12 text-lg">
          未来科技感 · 赛博朋克风格组件展示
        </p>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 青色霓虹卡片 */}
          <div className="bg-dark-card rounded-lg shadow-neon-cyan hover:shadow-glass transition-all duration-300 p-6 border border-dark-border hover:border-cyber-cyan animate-float">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyber-cyan rounded-full flex items-center justify-center text-dark-bg font-bold text-xl shadow-neon-cyan">
                C
              </div>
              <h3 className="ml-4 text-xl font-semibold text-cyber-cyan">青色霓虹</h3>
            </div>
            <p className="text-gray-400 mb-4">赛博朋克经典青色，营造未来科技感氛围</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-cyber-cyan rounded shadow-neon-cyan"></div>
              <div className="w-8 h-8 bg-primary-500 rounded"></div>
              <div className="w-8 h-8 bg-primary-700 rounded"></div>
            </div>
          </div>

          {/* 紫色光晕卡片 */}
          <div className="bg-dark-card rounded-lg shadow-neon-purple hover:shadow-glass transition-all duration-300 p-6 border border-dark-border hover:border-cyber-purple">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-cyber-purple rounded-full flex items-center justify-center text-white font-bold text-xl shadow-neon-purple animate-glow">
                P
              </div>
              <h3 className="ml-4 text-xl font-semibold text-cyber-purple">紫色光晕</h3>
            </div>
            <p className="text-gray-400 mb-4">神秘的紫色光晕，增添科幻氛围</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-cyber-purple rounded shadow-neon-purple"></div>
              <div className="w-8 h-8 bg-cyber-pink rounded"></div>
              <div className="w-8 h-8 bg-cyber-blue rounded shadow-neon-blue"></div>
            </div>
          </div>

          {/* 多彩赛博卡片 */}
          <div className="bg-dark-card rounded-lg shadow-glass hover:shadow-neon-blue transition-all duration-300 p-6 border border-dark-border hover:border-cyber-blue">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan to-cyber-purple rounded-full flex items-center justify-center text-white font-bold text-xl">
                ✦
              </div>
              <h3 className="ml-4 text-xl font-semibold text-cyber-blue">赛博配色</h3>
            </div>
            <p className="text-gray-400 mb-4">丰富的赛博朋克色彩系统</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-cyber-green rounded"></div>
              <div className="w-8 h-8 bg-cyber-yellow rounded"></div>
              <div className="w-8 h-8 bg-cyber-pink rounded"></div>
            </div>
          </div>
        </div>

        {/* 按钮示例 */}
        <div className="bg-dark-card rounded-lg shadow-glass p-8 mb-12 border border-dark-border">
          <h2 className="text-3xl font-bold text-cyber-cyan mb-6">霓虹按钮</h2>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="px-6 py-3 bg-cyber-cyan text-dark-bg rounded-lg hover:shadow-neon-cyan active:scale-95 transition-all duration-200 font-medium shadow-neon-cyan"
            >
              青色霓虹
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-cyber-purple text-white rounded-lg hover:shadow-neon-purple active:scale-95 transition-all duration-200 font-medium shadow-neon-purple"
            >
              紫色光晕
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-dark-hover text-cyber-blue border-2 border-cyber-blue rounded-lg hover:bg-cyber-blue hover:text-dark-bg hover:shadow-neon-blue active:scale-95 transition-all duration-200 font-medium"
            >
              边框按钮
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-cyber-pink text-white rounded-lg hover:shadow-lg active:scale-95 transition-all duration-200 font-medium"
            >
              粉色强调
            </button>
          </div>
        </div>

        {/* 表单示例 */}
        <div className="bg-dark-card rounded-lg shadow-glass p-8 mb-12 border border-dark-border">
          <h2 className="text-3xl font-bold text-cyber-purple mb-6">未来表单</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-cyber-cyan mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan outline-none transition-all text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-cyber-cyan mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan outline-none transition-all text-white placeholder-gray-500"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-cyber-cyan mb-2">
                留言
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="请输入您的留言..."
                className="w-full px-4 py-2 bg-dark-hover border border-dark-border rounded-lg focus:ring-2 focus:ring-cyber-cyan focus:border-cyber-cyan outline-none transition-all resize-none text-white placeholder-gray-500"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 通知/警告框 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-dark-card border-l-4 border-cyber-green p-4 rounded-r-lg shadow-glass animate-slide-up">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-cyber-green text-xl">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-cyber-green">成功提示</h3>
                <p className="mt-1 text-sm text-gray-400">系统连接成功，数据同步完成！</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border-l-4 border-cyber-yellow p-4 rounded-r-lg shadow-glass">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-cyber-yellow text-xl">⚠</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-cyber-yellow">警告提示</h3>
                <p className="mt-1 text-sm text-gray-400">检测到异常流量，正在分析中...</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border-l-4 border-cyber-pink p-4 rounded-r-lg shadow-glass">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-cyber-pink text-xl">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-cyber-pink">错误提示</h3>
                <p className="mt-1 text-sm text-gray-400">连接失败，请检查网络设置后重试。</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card border-l-4 border-cyber-cyan p-4 rounded-r-lg shadow-glass">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-cyber-cyan text-xl">ℹ</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-cyber-cyan">信息提示</h3>
                <p className="mt-1 text-sm text-gray-400">新版本已就绪，建议立即更新。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 动画示例 */}
        <div className="bg-dark-card rounded-lg shadow-glass p-8 border border-dark-border">
          <h2 className="text-3xl font-bold text-cyber-blue mb-6">赛博动画</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-lg shadow-neon-cyan animate-pulse-slow flex items-center justify-center">
              <span className="text-white font-bold">脉冲</span>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-cyber-purple to-cyber-pink rounded-lg shadow-neon-purple animate-glow flex items-center justify-center">
              <span className="text-white font-bold">发光</span>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-cyber-blue to-cyber-purple rounded-lg shadow-neon-blue animate-float flex items-center justify-center">
              <span className="text-white font-bold">浮动</span>
            </div>
            <div className="w-32 h-32 bg-cyber-green rounded-lg shadow-lg hover:scale-110 hover:shadow-neon-cyan transition-all duration-300 flex items-center justify-center cursor-pointer">
              <span className="text-dark-bg font-bold">悬停</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TailwindDemo);
