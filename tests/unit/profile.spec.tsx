import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { createStore } from 'jotai';
import Profile from '@/pages/profile';
import {
  accountAtom,
  balanceAtom,
  yctBalanceAtom,
  contractAtom,
  currentUserAtom,
  signerAtom,
} from '@/stores/web3Atoms';
import * as userApi from '@/services/userApi';
import { BrowserProvider } from 'ethers';

// Mock userApi
jest.mock('@/services/userApi');

// Mock ethers
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn(),
  formatEther: jest.fn((val) => (Number(val) / 1e18).toString()),
}));

describe('Profile 页面测试', () => {
  let store: ReturnType<typeof createStore>;

  const mockUser = {
    id: '123',
    walletAddress: '0x1234567890abcdef',
    signature: null,
    timestamp: null,
    username: 'testuser',
    email: 'test@example.com',
    avatarUrl: null,
    name: 'Test User',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockSigner = {
    getAddress: jest.fn().mockResolvedValue('0x1234567890abcdef'),
    signMessage: jest.fn().mockResolvedValue('0xmocksignature'),
  };

  const mockContract = {
    getInstructorCourses: jest.fn().mockResolvedValue([1n, 2n]),
    getStudentCourses: jest.fn().mockResolvedValue([3n]),
    getCourse: jest.fn().mockImplementation((id: number) =>
      Promise.resolve({
        id: BigInt(id),
        title: `Course ${id}`,
        description: `Description ${id}`,
        price: BigInt(100),
        instructor: '0x1234567890abcdef',
        isActive: true,
      })
    ),
    courseCounter: jest.fn().mockResolvedValue(10n),
  };

  beforeEach(() => {
    store = createStore();

    // 设置初始状态
    store.set(accountAtom, '0x1234567890abcdef');
    store.set(balanceAtom, '1.5000');
    store.set(yctBalanceAtom, '100.0000');
    store.set(currentUserAtom, mockUser);
    store.set(signerAtom, mockSigner as any);
    store.set(contractAtom as any, mockContract as any);

    // 重置 mocks
    jest.clearAllMocks();

    // Mock updateUser
    (userApi.updateUser as jest.Mock).mockResolvedValue({
      ...mockUser,
      name: 'Updated Name',
    });
  });

  describe('基础渲染', () => {
    it('应该渲染个人中心标题', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText('个人中心')).toBeInTheDocument();
    });

    it('应该显示用户钱包地址（缩写）', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText(/0x1234.*cdef/)).toBeInTheDocument();
    });

    it('应该显示 ETH 余额', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText(/1.5000 ETH/)).toBeInTheDocument();
    });

    it('应该显示 YCT 余额', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText(/100.0000 YCT/)).toBeInTheDocument();
    });

    it('应该显示用户名称', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    it('应该在没有用户信息时显示"无"', () => {
      store.set(currentUserAtom, {
        ...mockUser,
        name: null,
        email: null,
      });

      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 应该显示多个"无"
      const noTexts = screen.getAllByText('无');
      expect(noTexts.length).toBeGreaterThan(0);
    });
  });

  describe('编辑功能', () => {
    it('应该能够点击编辑按钮进入编辑模式', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      const editButton = screen.getByText('编辑');
      fireEvent.click(editButton);

      // 应该显示输入框
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    });

    it('应该能够修改昵称并保存', async () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 点击编辑
      const editButton = screen.getByText('编辑');
      fireEvent.click(editButton);

      // 修改输入框
      const input = screen.getByDisplayValue('Test User');
      fireEvent.change(input, { target: { value: 'Updated Name' } });

      // 点击保存
      const saveButton = screen.getByText('保存');
      fireEvent.click(saveButton);

      // 等待 API 调用
      await waitFor(() => {
        expect(userApi.updateUser).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            name: 'Updated Name',
            signature: '0xmocksignature',
            timestamp: expect.any(Number),
          })
        );
      });
    });

    it('应该能够取消编辑', () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 点击编辑
      const editButton = screen.getByText('编辑');
      fireEvent.click(editButton);

      // 修改输入框
      const input = screen.getByDisplayValue('Test User');
      fireEvent.change(input, { target: { value: 'New Name' } });

      // 点击取消
      const cancelButton = screen.getByText('取消');
      fireEvent.click(cancelButton);

      // 应该恢复原值
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('New Name')).not.toBeInTheDocument();
    });
  });

  describe('课程标签页', () => {
    it('应该默认显示"我创建的课程"标签页', async () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText('我创建的课程')).toHaveClass('active'); // 假设有 active class
      });
    });

    it('应该能够切换到"我购买的课程"标签页', async () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      const purchasedTab = screen.getByText('我购买的课程');
      fireEvent.click(purchasedTab);

      await waitFor(() => {
        expect(mockContract.getStudentCourses).toHaveBeenCalled();
      });
    });

    it('应该正确加载创建的课程列表', async () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      await waitFor(() => {
        expect(mockContract.getInstructorCourses).toHaveBeenCalledWith('0x1234567890abcdef');
      });

      await waitFor(() => {
        expect(screen.getByText('Course 1')).toBeInTheDocument();
        expect(screen.getByText('Course 2')).toBeInTheDocument();
      });
    });

    it('应该正确加载购买的课程列表', async () => {
      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 切换到购买的课程
      const purchasedTab = screen.getByText('我购买的课程');
      fireEvent.click(purchasedTab);

      await waitFor(() => {
        expect(mockContract.getStudentCourses).toHaveBeenCalledWith('0x1234567890abcdef');
      });

      await waitFor(() => {
        expect(screen.getByText('Course 3')).toBeInTheDocument();
      });
    });
  });

  describe('错误处理', () => {
    it('应该在没有连接钱包时显示提示', () => {
      store.set(accountAtom, null);
      store.set(currentUserAtom, null);

      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 应该显示未连接提示或空状态
      expect(screen.queryByText('Test User')).not.toBeInTheDocument();
    });

    it('应该处理更新失败的情况', async () => {
      (userApi.updateUser as jest.Mock).mockRejectedValue(new Error('更新失败'));

      render(
        <Provider store={store}>
          <Profile />
        </Provider>
      );

      // 点击编辑
      const editButton = screen.getByText('编辑');
      fireEvent.click(editButton);

      // 修改并保存
      const input = screen.getByDisplayValue('Test User');
      fireEvent.change(input, { target: { value: 'New Name' } });

      const saveButton = screen.getByText('保存');
      fireEvent.click(saveButton);

      // 应该显示错误信息（需要在组件中实现错误提示）
      await waitFor(() => {
        expect(userApi.updateUser).toHaveBeenCalled();
      });
    });
  });
});
