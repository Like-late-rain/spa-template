import { User } from '@/types/users';

// 后端 API 基础 URL - 从环境变量读取
// 开发环境: .env 中的 REACT_APP_API_BASE_URL
// 生产环境: .env.production 中的 REACT_APP_API_BASE_URL
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

// API 响应格式
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

/**
 * 钱包登录/注册
 * @param walletAddress 钱包地址
 * @returns 用户信息
 */
export async function walletLogin(walletAddress: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/wallet-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    throw new Error('钱包登录失败');
  }

  const result: ApiResponse<User> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || '钱包登录失败');
  }

  return result.data;
}

/**
 * 获取用户详情
 * @param userId 用户ID
 * @returns 用户信息
 */
export async function getUserById(userId: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);

  if (!response.ok) {
    throw new Error('获取用户信息失败');
  }

  const result: ApiResponse<User> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || '获取用户信息失败');
  }

  return result.data;
}

/**
 * 更新用户信息
 * @param userId 用户ID
 * @param data 要更新的数据
 * @returns 更新后的用户信息
 */
export async function updateUser(
  userId: string,
  data: Partial<Pick<User, 'username' | 'name' | 'email' | 'avatarUrl' | 'signature' | 'timestamp'>>
): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('更新用户信息失败');
  }

  const result: ApiResponse<User> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || '更新用户信息失败');
  }

  return result.data;
}
