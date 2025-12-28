import { useState, useEffect } from 'react';
import type React from 'react';

/**
 * ✅ 遵守单一职责原则 (SRP)
 *
 * 优点：
 * 1. 每个函数/类只负责一件事
 * 2. 代码易于测试和维护
 * 3. 高复用性
 * 4. 修改某个功能不会影响其他功能
 */

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

// 职责1: 数据验证 - 独立的验证器
class UserValidator {
  static validateEmail(email: string): boolean {
    return email.includes('@') && email.length > 5;
  }

  static validatePhone(phone: string): boolean {
    return phone.replace(/\D/g, '').length >= 10;
  }

  static validate(user: Partial<User>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (user.email && !this.validateEmail(user.email)) {
      errors.push('Invalid email');
    }

    if (user.phone && !this.validatePhone(user.phone)) {
      errors.push('Invalid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// 职责2: 本地存储 - 独立的存储服务
class UserStorage {
  private static STORAGE_KEY = 'user';

  static save(user: User): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
  }

  static load(): User | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// 职责3: 数据获取 - 独立的API服务
class UserApiService {
  static async fetchUser(userId: number): Promise<User> {
    const response = await fetch(`/api/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json();
  }
}

// 职责4: 格式化 - 独立的格式化工具
class DateFormatter {
  static format(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}

class PhoneFormatter {
  static format(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`;
    }
    return phone;
  }
}

// 职责5: 自定义Hook - 负责用户数据管理
function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadUser = async () => {
      // 先尝试从缓存加载
      const cachedUser = UserStorage.load();
      if (cachedUser) {
        setUser(cachedUser);
        return;
      }

      // 从API获取
      setLoading(true);
      try {
        const fetchedUser = await UserApiService.fetchUser(userId);

        // 验证数据
        const validation = UserValidator.validate(fetchedUser);
        if (!validation.isValid) {
          throw new Error(validation.errors.join(', '));
        }

        // 保存到缓存
        UserStorage.save(fetchedUser);
        setUser(fetchedUser);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return { user, loading, error };
}

// 职责6: UI组件 - 只负责展示
const UserInfo: React.FC<{ user: User }> = ({ user }) => (
  <div className="space-y-2">
    <p className="text-gray-700">
      <span className="font-semibold">邮箱:</span> {user.email}
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">电话:</span> {PhoneFormatter.format(user.phone)}
    </p>
    <p className="text-gray-700">
      <span className="font-semibold">加入日期:</span> {DateFormatter.format(user.joinDate)}
    </p>
  </div>
);

// 主组件 - 只负责组合和布局
const UserProfileGood: React.FC = () => {
  const { user, loading, error } = useUser(123);

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
      <UserInfo user={user} />
    </div>
  );
};

export default UserProfileGood;
