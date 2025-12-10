import type React from 'react';
import { memo } from 'react';

/**
 * Tailwind CSS 演示页面
 * 展示各种常用的 Tailwind 样式和组件
 */
const TailwindDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {/* 页面标题 */}
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-4 animate-fade-in">
          Tailwind CSS Demo
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          展示经典的 Tailwind CSS 样式和组件
        </p>

        {/* 卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 主色调卡片 */}
          <div className="bg-white rounded-lg shadow-card hover:shadow-soft transition-shadow duration-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                P
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">主色调</h3>
            </div>
            <p className="text-gray-600 mb-4">
              使用自定义的 primary 颜色系列，从 50 到 950 共 11 个色阶。
            </p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-primary-300 rounded"></div>
              <div className="w-8 h-8 bg-primary-500 rounded"></div>
              <div className="w-8 h-8 bg-primary-700 rounded"></div>
            </div>
          </div>

          {/* 次色调卡片 */}
          <div className="bg-white rounded-lg shadow-card hover:shadow-soft transition-shadow duration-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                S
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">次色调</h3>
            </div>
            <p className="text-gray-600 mb-4">优雅的紫色系列，适合强调和装饰性元素。</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-secondary-300 rounded"></div>
              <div className="w-8 h-8 bg-secondary-500 rounded"></div>
              <div className="w-8 h-8 bg-secondary-700 rounded"></div>
            </div>
          </div>

          {/* 状态色卡片 */}
          <div className="bg-white rounded-lg shadow-card hover:shadow-soft transition-shadow duration-300 p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-success-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                ✓
              </div>
              <h3 className="ml-4 text-xl font-semibold text-gray-800">状态色</h3>
            </div>
            <p className="text-gray-600 mb-4">包含成功、警告、危险等状态颜色系统。</p>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 bg-success-500 rounded"></div>
              <div className="w-8 h-8 bg-warning-500 rounded"></div>
              <div className="w-8 h-8 bg-danger-500 rounded"></div>
            </div>
          </div>
        </div>

        {/* 按钮示例 */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">按钮样式</h2>
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              主要按钮
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 active:bg-secondary-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              次要按钮
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 font-medium"
            >
              轮廓按钮
            </button>
            <button
              type="button"
              className="px-6 py-3 bg-danger-500 text-white rounded-lg hover:bg-danger-600 active:bg-danger-700 transition-colors duration-200 font-medium shadow-sm hover:shadow-md"
            >
              危险按钮
            </button>
          </div>
        </div>

        {/* 表单示例 */}
        <div className="bg-white rounded-lg shadow-card p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">表单元素</h2>
          <div className="max-w-md space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                邮箱地址
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                留言
              </label>
              <textarea
                id="message"
                rows={4}
                placeholder="请输入您的留言..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* 通知/警告框 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-success-50 border-l-4 border-success-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-success-500 text-xl">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-success-800">成功提示</h3>
                <p className="mt-1 text-sm text-success-700">您的操作已成功完成！</p>
              </div>
            </div>
          </div>

          <div className="bg-warning-50 border-l-4 border-warning-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-warning-500 text-xl">⚠</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-warning-800">警告提示</h3>
                <p className="mt-1 text-sm text-warning-700">请注意，这个操作可能需要一些时间。</p>
              </div>
            </div>
          </div>

          <div className="bg-danger-50 border-l-4 border-danger-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-danger-500 text-xl">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-danger-800">错误提示</h3>
                <p className="mt-1 text-sm text-danger-700">抱歉，发生了一个错误，请重试。</p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="text-primary-500 text-xl">ℹ</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-800">信息提示</h3>
                <p className="mt-1 text-sm text-primary-700">这里是一条普通的信息通知。</p>
              </div>
            </div>
          </div>
        </div>

        {/* 动画示例 */}
        <div className="bg-white rounded-lg shadow-card p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">动画效果</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg shadow-lg animate-bounce-slow flex items-center justify-center">
              <span className="text-white font-bold">Bounce</span>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-secondary-400 to-secondary-600 rounded-lg shadow-lg animate-fade-in flex items-center justify-center">
              <span className="text-white font-bold">Fade In</span>
            </div>
            <div className="w-32 h-32 bg-gradient-to-br from-success-400 to-success-600 rounded-lg shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center cursor-pointer">
              <span className="text-white font-bold">Hover Me</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(TailwindDemo);
