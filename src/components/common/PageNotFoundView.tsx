import type React from 'react';
import { useNavigate } from 'react-router-dom';

interface PageNotFoundViewProps {
  title?: string;
  description?: string;
  homeButtonText?: string;
}

/**
 * 404 页面未找到组件
 * @param title - 标题文字
 * @param description - 描述文字
 * @param homeButtonText - 返回首页按钮文字
 */
const PageNotFoundView: React.FC<PageNotFoundViewProps> = ({
  title = '404',
  description = '抱歉，您访问的页面不存在',
  homeButtonText = '返回首页',
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '20px',
    backgroundColor: '#f5f5f5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '120px',
    fontWeight: 700,
    margin: 0,
    color: '#1890ff',
    lineHeight: 1,
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '20px',
    color: '#666',
    marginTop: '24px',
    marginBottom: '40px',
    textAlign: 'center',
    maxWidth: '500px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '12px 32px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#1890ff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const iconStyle: React.CSSProperties = {
    fontSize: '64px',
    marginBottom: '20px',
  };

  return (
    <div style={containerStyle}>
      <div style={iconStyle}>🔍</div>
      <h1 style={titleStyle}>{title}</h1>
      <p style={descriptionStyle}>{description}</p>
      <button
        type="button"
        style={buttonStyle}
        onClick={handleGoHome}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#40a9ff';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#1890ff';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }}
      >
        {homeButtonText}
      </button>
    </div>
  );
};

export default PageNotFoundView;
