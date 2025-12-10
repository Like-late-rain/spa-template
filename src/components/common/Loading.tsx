import type React from 'react';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

/**
 * Loading 加载组件
 * @param size - 加载图标大小: 'small' | 'medium' | 'large'
 * @param color - 加载图标颜色
 * @param text - 加载提示文字
 * @param fullScreen - 是否全屏显示
 */
const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  color = '#1890ff',
  text = '加载中...',
  fullScreen = false,
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  const spinnerSize = sizeMap[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 9999,
    }),
  };

  const spinnerStyle: React.CSSProperties = {
    width: `${spinnerSize}px`,
    height: `${spinnerSize}px`,
    border: `${Math.max(2, spinnerSize / 10)}px solid #f3f3f3`,
    borderTop: `${Math.max(2, spinnerSize / 10)}px solid ${color}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  };

  const textStyle: React.CSSProperties = {
    color: '#666',
    fontSize: size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px',
    fontWeight: 400,
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={spinnerStyle} />
      {text && <div style={textStyle}>{text}</div>}
    </div>
  );
};

export default Loading;
