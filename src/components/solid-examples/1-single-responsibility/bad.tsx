import { useState, useEffect } from 'react';
import type React from 'react';

/**
 * ❌ 违反单一职责原则 (SRP)
 *
 * 问题：
 * 1. UserProfile组件承担了太多职责：
 *    - UI渲染
 *    - 数据获取
 *    - 数据验证
 *    - 本地存储管理
 *    - 格式化逻辑
 *
 * 2. 组件难以测试，因为所有逻辑耦合在一起
 * 3. 修改任何一个功能都可能影响其他功能
 * 4. 代码复用性差
 */

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

const UserProfileBad: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // 职责1: 数据获取
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/user/123');
        const data = await response.json();

        // 职责2: 数据验证
        if (!data.email || !data.email.includes('@')) {
          throw new Error('Invalid email');
        }

        if (!data.phone || data.phone.length < 10) {
          throw new Error('Invalid phone number');
        }

        // 职责3: 本地存储
        localStorage.setItem('user', JSON.stringify(data));

        setUser(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    // 职责4: 从本地存储读取
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    } else {
      fetchUser();
    }
  }, []);

  // 职责5: 日期格式化
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 职责6: 电话号码格式化
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  };

  // 职责7: UI渲染
  if (loading) {
    return <div className="text-center p-4">加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">错误: {error}</div>;
  }

  if (!user) {
    return <div className="text-gray-500 p-4">未找到用户</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
      <div className="space-y-2">
        <p className="text-gray-700">
          <span className="font-semibold">邮箱:</span> {user.email}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">电话:</span> {formatPhone(user.phone)}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">加入日期:</span> {formatDate(user.joinDate)}
        </p>
      </div>
    </div>
  );
};

export default UserProfileBad;
