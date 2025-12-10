import type React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface HeaderProps {
  logo?: React.ReactNode;
  logoText?: string;
  menuItems?: MenuItem[];
  rightContent?: React.ReactNode;
  variant?: 'light' | 'dark' | 'primary';
  className?: string;
}

/**
 * Header 导航栏组件 - 使用 Tailwind CSS
 * @param logo - 自定义 Logo 节点
 * @param logoText - Logo 文字，默认为 "My App"
 * @param menuItems - 导航菜单项
 * @param rightContent - 右侧自定义内容（如登录按钮、用户头像等）
 * @param variant - 主题变体：light(浅色), dark(深色), primary(主题色)
 * @param className - 额外的自定义类名
 */
const Header: React.FC<HeaderProps> = ({
  logo,
  logoText = 'My App',
  menuItems = [],
  rightContent,
  variant = 'light',
  className = '',
}) => {
  const location = useLocation();

  // 根据变体选择不同的样式
  const variantStyles = {
    light: {
      header: 'bg-white text-gray-800 shadow-md',
      logo: 'text-gray-800 hover:text-primary-600',
      menuItem: 'text-gray-700 hover:text-primary-600 hover:bg-gray-50',
      menuItemActive: 'text-primary-600 border-primary-600',
    },
    dark: {
      header: 'bg-gray-900 text-white shadow-lg',
      logo: 'text-white hover:text-gray-200',
      menuItem: 'text-gray-300 hover:text-white hover:bg-gray-800',
      menuItemActive: 'text-white border-white',
    },
    primary: {
      header: 'bg-primary-600 text-white shadow-lg',
      logo: 'text-white hover:text-primary-100',
      menuItem: 'text-primary-100 hover:text-white hover:bg-primary-700',
      menuItemActive: 'text-white border-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <header
      className={`
        flex items-center justify-between
        px-6 h-16
        sticky top-0 z-50
        transition-colors duration-300
        ${styles.header}
        ${className}
      `}
    >
      {/* Logo 区域 */}
      <Link
        to="/"
        className={`
          flex items-center gap-3
          text-xl font-semibold
          no-underline
          transition-colors duration-200
          ${styles.logo}
        `}
      >
        {logo && <div className="flex-shrink-0">{logo}</div>}
        <span className="font-bold">{logoText}</span>
      </Link>

      {/* 导航菜单 */}
      {menuItems.length > 0 && (
        <nav className="flex items-center gap-8 flex-1 ml-12">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-2
                  px-4 py-2
                  text-base
                  no-underline
                  border-b-2
                  transition-all duration-200
                  ${
                    isActive
                      ? `font-medium ${styles.menuItemActive}`
                      : `font-normal border-transparent ${styles.menuItem}`
                  }
                `}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* 右侧内容 */}
      {rightContent && (
        <div className="flex items-center gap-4">{rightContent}</div>
      )}
    </header>
  );
};

export default Header;
