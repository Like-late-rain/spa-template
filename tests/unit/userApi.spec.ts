import { walletLogin, getUserById, updateUser } from '@/services/userApi';
import { User } from '@/types/users';

// Mock fetch API
global.fetch = jest.fn();

describe('userApi 测试套件', () => {
  const mockUser: User = {
    id: '123',
    walletAddress: '0x1234567890abcdef',
    signature: null,
    timestamp: null,
    username: 'testuser',
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
    name: 'Test User',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(() => {
    // 每个测试前重置 mock
    (fetch as jest.Mock).mockClear();
  });

  describe('walletLogin', () => {
    it('应该成功登录并返回用户信息', async () => {
      // 模拟成功的 API 响应
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockUser,
        }),
      });

      const result = await walletLogin('0x1234567890abcdef');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/wallet-login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ walletAddress: '0x1234567890abcdef' }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('应该在 API 返回错误时抛出异常', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await expect(walletLogin('0x1234567890abcdef')).rejects.toThrow('钱包登录失败');
    });

    it('应该在 success 为 false 时抛出异常', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          message: '钱包地址无效',
        }),
      });

      await expect(walletLogin('0xinvalid')).rejects.toThrow('钱包地址无效');
    });

    it('应该在没有返回数据时抛出异常', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: null,
        }),
      });

      await expect(walletLogin('0x1234567890abcdef')).rejects.toThrow('钱包登录失败');
    });
  });

  describe('getUserById', () => {
    it('应该成功获取用户信息', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockUser,
        }),
      });

      const result = await getUserById('123');

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/users/123'));
      expect(result).toEqual(mockUser);
    });

    it('应该在用户不存在时抛出异常', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(getUserById('999')).rejects.toThrow('获取用户信息失败');
    });

    it('应该处理网络错误', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(getUserById('123')).rejects.toThrow('Network error');
    });
  });

  describe('updateUser', () => {
    it('应该成功更新用户信息', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: updatedUser,
        }),
      });

      const result = await updateUser('123', updateData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/users/123'),
        expect.objectContaining({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        })
      );
      expect(result.name).toBe('Updated Name');
    });

    it('应该成功更新包含签名的用户信息', async () => {
      const timestamp = Date.now();
      const updateData = {
        name: 'Updated Name',
        signature: '0xsignature',
        timestamp,
      };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: updatedUser,
        }),
      });

      const result = await updateUser('123', updateData);

      expect(result.name).toBe('Updated Name');
    });

    it('应该在签名验证失败时抛出异常', async () => {
      const updateData = {
        name: 'Updated Name',
        signature: '0xinvalid',
        timestamp: Date.now(),
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
      });

      await expect(updateUser('123', updateData)).rejects.toThrow('更新用户信息失败');
    });

    it('应该在更新不存在的用户时抛出异常', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      await expect(updateUser('999', { name: 'Test' })).rejects.toThrow('更新用户信息失败');
    });

    it('应该处理服务器错误', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: false,
          message: '服务器内部错误',
        }),
      });

      await expect(updateUser('123', { name: 'Test' })).rejects.toThrow('服务器内部错误');
    });
  });
});
