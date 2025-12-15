import { BookOpen, ChevronDown } from 'lucide-react';
import type React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ConnectButton from '../dapp';

interface MenuItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
}

interface HeaderProps {
  menuItems?: MenuItem[];
}

/**
 * Header 导航栏组件 - 使用 Tailwind CSS
 * @param menuItems - 导航菜单项
 * @param className - 额外的自定义类名
 */
const Header: React.FC<HeaderProps> = ({ menuItems = [] }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const isItemActive = (item: MenuItem): boolean => {
    if (item.path && isActive(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => child.path && isActive(child.path));
    }
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-lg blur opacity-75 group-hover:opacity-100 transition"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyber-cyan to-cyber-blue rounded-lg flex items-center justify-center">
                <BookOpen className="text-white" size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold gradient-text">Web3 University</span>
              <span className="text-xs text-gray-400">涂山大学</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => {
              // 如果有子菜单，渲染下拉菜单
              if (item.children && item.children.length > 0) {
                return (
                  <div key={item.label} className="relative group">
                    <button
                      type="button"
                      className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg flex items-center gap-1 ${
                        isItemActive(item) ? 'text-cyber-cyan' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {isItemActive(item) && (
                        <div className="absolute inset-0 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30"></div>
                      )}
                      <span className="relative">{item.label}</span>
                      <ChevronDown
                        size={16}
                        className="relative transition-transform group-hover:rotate-180"
                      />
                    </button>

                    {/* 下拉菜单 */}
                    <div className="absolute top-full left-0 mt-1 min-w-[180px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="glass rounded-lg border border-white/10 py-2 shadow-xl">
                        {item.children.map((child) => (
                          <Link
                            key={child.path}
                            to={child.path || '#'}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              child.path && isActive(child.path)
                                ? 'text-cyber-cyan bg-cyber-cyan/10'
                                : 'text-gray-300 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              // 普通菜单项
              return (
                <Link
                  key={item.path}
                  to={item.path || '#'}
                  className={`relative px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                    item.path && isActive(item.path)
                      ? 'text-cyber-cyan'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.path && isActive(item.path) && (
                    <div className="absolute inset-0 bg-cyber-cyan/10 rounded-lg border border-cyber-cyan/30"></div>
                  )}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu */}
          <div className=" flex items-center space-x-4">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
