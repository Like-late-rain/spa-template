/**
 * 组件使用示例
 * 这个文件仅用于演示，实际使用时可以删除
 */

import React, { useState } from 'react';
import { Loading, PageNotFoundView } from './index';

/**
 * Loading 组件示例
 */
export const LoadingExamples: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Loading 组件示例</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3>不同尺寸</h3>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <div>
            <p>Small</p>
            <Loading size="small" />
          </div>
          <div>
            <p>Medium (默认)</p>
            <Loading size="medium" />
          </div>
          <div>
            <p>Large</p>
            <Loading size="large" />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>不同颜色</h3>
        <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
          <Loading color="#1890ff" text="蓝色" />
          <Loading color="#52c41a" text="绿色" />
          <Loading color="#ff4d4f" text="红色" />
          <Loading color="#faad14" text="橙色" />
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>自定义文字</h3>
        <Loading text="正在加载数据..." />
      </div>
    </div>
  );
};

/**
 * 全屏 Loading 示例
 */
export const FullScreenLoadingExample: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // 模拟异步操作
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>全屏 Loading 示例</h2>
      <button
        type="button"
        onClick={handleClick}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        显示全屏加载（3秒）
      </button>
      {loading && <Loading fullScreen text="加载中，请稍候..." />}
    </div>
  );
};

/**
 * PageNotFoundView 组件示例
 */
export const PageNotFoundViewExample: React.FC = () => {
  return (
    <div>
      <h2 style={{ padding: '20px' }}>PageNotFoundView 组件示例</h2>
      <PageNotFoundView />
    </div>
  );
};

/**
 * 自定义 404 页面示例
 */
export const CustomPageNotFoundExample: React.FC = () => {
  return (
    <PageNotFoundView
      title="Oops!"
      description="看起来你迷路了～这个页面不存在哦"
      homeButtonText="带我回家"
    />
  );
};

/**
 * 完整应用示例
 */
export const CompleteExample: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  React.useEffect(() => {
    // 模拟数据加载
    const timer = setTimeout(() => {
      setLoading(false);
      // 模拟加载失败
      setError(Math.random() > 0.5);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading fullScreen text="正在加载页面..." />;
  }

  if (error) {
    return <PageNotFoundView />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>页面内容</h1>
      <p>数据加载成功！</p>
    </div>
  );
};
