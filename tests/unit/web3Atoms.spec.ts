import { createStore } from 'jotai';
import {
  accountAtom,
  balanceAtom,
  chainIdAtom,
  connectWalletAtom,
  autoConnectWalletAtom,
  contractAtom,
  providerAtom,
  refreshWalletAtom,
  refreshYCTBalanceAtom,
  signerAtom,
  ycTokenAtom,
  yctBalanceAtom,
  currentUserAtom,
} from '@/stores/web3Atoms';
import * as userApi from '@/services/userApi';

// Mock ethers 库
jest.mock('ethers', () => ({
  BrowserProvider: jest.fn().mockImplementation(() => ({
    getSigner: jest.fn().mockResolvedValue({
      getAddress: jest.fn().mockResolvedValue('0x1234567890abcdef'),
    }),
    getBalance: jest.fn().mockResolvedValue(BigInt('1000000000000000000')), // 1 ETH
    getNetwork: jest.fn().mockResolvedValue({ chainId: BigInt(11155111) }), // Sepolia
  })),
  Contract: jest.fn(),
}));

// Mock userApi
jest.mock('@/services/userApi');

// Mock UniversityCourse 和 YCToken factories
jest.mock('@/types', () => ({
  UniversityCourse__factory: {
    connect: jest.fn().mockReturnValue({
      getInstructorCourses: jest.fn().mockResolvedValue([1, 2, 3]),
      getCourse: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Course',
        instructor: '0x1234567890abcdef',
      }),
    }),
  },
  YCToken__factory: {
    connect: jest.fn().mockReturnValue({
      balanceOf: jest.fn().mockResolvedValue(BigInt('5000000000000000000')), // 5 YCT
    }),
  },
}));

describe('web3Atoms 测试套件', () => {
  let store: ReturnType<typeof createStore>;

  // Mock window.ethereum
  const mockEthereum = {
    request: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn(),
  };

  beforeAll(() => {
    // 设置全局 window.ethereum
    (global as any).window = {
      ethereum: mockEthereum,
    };
  });

  beforeEach(() => {
    // 每个测试前创建新的 store
    store = createStore();

    // 重置所有 mocks
    jest.clearAllMocks();

    // 默认 mock 行为
    mockEthereum.request.mockImplementation((args: any) => {
      if (args.method === 'eth_requestAccounts') {
        return Promise.resolve(['0x1234567890abcdef']);
      }
      if (args.method === 'eth_accounts') {
        return Promise.resolve(['0x1234567890abcdef']);
      }
      return Promise.resolve();
    });

    // Mock walletLogin 返回用户数据
    (userApi.walletLogin as jest.Mock).mockResolvedValue({
      id: '123',
      walletAddress: '0x1234567890abcdef',
      username: 'testuser',
      name: 'Test User',
    });
  });

  describe('基础 atoms', () => {
    it('signerAtom 初始值应该为 null', () => {
      const signer = store.get(signerAtom);
      expect(signer).toBeNull();
    });

    it('accountAtom 初始值应该为 null', () => {
      const account = store.get(accountAtom);
      expect(account).toBeNull();
    });

    it('balanceAtom 初始值应该为 null', () => {
      const balance = store.get(balanceAtom);
      expect(balance).toBeNull();
    });

    it('chainIdAtom 初始值应该为 null', () => {
      const chainId = store.get(chainIdAtom);
      expect(chainId).toBeNull();
    });

    it('currentUserAtom 初始值应该为 null', () => {
      const user = store.get(currentUserAtom);
      expect(user).toBeNull();
    });
  });

  describe('connectWalletAtom', () => {
    it('应该成功连接钱包并设置所有状态', async () => {
      await store.set(connectWalletAtom);

      // 验证 eth_requestAccounts 被调用
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });

      // 验证状态被正确设置
      expect(store.get(accountAtom)).toBe('0x1234567890abcdef');
      expect(store.get(balanceAtom)).toBe('1.0000'); // 1 ETH
      expect(store.get(chainIdAtom)).toBe(11155111); // Sepolia
      expect(store.get(providerAtom)).not.toBeNull();
      expect(store.get(signerAtom)).not.toBeNull();
    });

    it('应该在连接后自动调用 walletLogin', async () => {
      await store.set(connectWalletAtom);

      // 验证 walletLogin 被调用
      expect(userApi.walletLogin).toHaveBeenCalledWith('0x1234567890abcdef');

      // 验证用户信息被设置
      const user = store.get(currentUserAtom);
      expect(user).toEqual({
        id: '123',
        walletAddress: '0x1234567890abcdef',
        username: 'testuser',
        name: 'Test User',
      });
    });

    it('应该在没有 MetaMask 时抛出错误', async () => {
      // 临时移除 window.ethereum
      const originalEthereum = (global as any).window.ethereum;
      (global as any).window.ethereum = undefined;

      await expect(store.set(connectWalletAtom)).rejects.toThrow(
        '请安装 MetaMask 或其他以太坊钱包'
      );

      // 恢复
      (global as any).window.ethereum = originalEthereum;
    });

    it('应该在 walletLogin 失败时仍然完成钱包连接', async () => {
      // Mock walletLogin 失败
      (userApi.walletLogin as jest.Mock).mockRejectedValue(new Error('登录失败'));

      await store.set(connectWalletAtom);

      // 钱包应该成功连接
      expect(store.get(accountAtom)).toBe('0x1234567890abcdef');

      // 但用户信息为 null
      expect(store.get(currentUserAtom)).toBeNull();
    });
  });

  describe('autoConnectWalletAtom', () => {
    it('应该在已授权时自动连接', async () => {
      mockEthereum.request.mockImplementation((args: any) => {
        if (args.method === 'eth_accounts') {
          return Promise.resolve(['0x1234567890abcdef']);
        }
        return Promise.resolve();
      });

      await store.set(autoConnectWalletAtom);

      // 验证不会调用 eth_requestAccounts（不弹窗）
      expect(mockEthereum.request).not.toHaveBeenCalledWith({
        method: 'eth_requestAccounts',
      });

      // 验证调用了 eth_accounts
      expect(mockEthereum.request).toHaveBeenCalledWith({
        method: 'eth_accounts',
      });

      // 验证状态被设置
      expect(store.get(accountAtom)).toBe('0x1234567890abcdef');
    });

    it('应该在未授权时不连接', async () => {
      mockEthereum.request.mockImplementation((args: any) => {
        if (args.method === 'eth_accounts') {
          return Promise.resolve([]); // 没有授权的账户
        }
        return Promise.resolve();
      });

      const result = await store.set(autoConnectWalletAtom);

      expect(result).toBeNull();
      expect(store.get(accountAtom)).toBeNull();
    });

    it('应该在没有 MetaMask 时返回 null', async () => {
      const originalEthereum = (global as any).window.ethereum;
      (global as any).window.ethereum = undefined;

      const result = await store.set(autoConnectWalletAtom);

      expect(result).toBeNull();

      (global as any).window.ethereum = originalEthereum;
    });
  });

  describe('派生 atoms', () => {
    it('contractAtom 应该在有 signer 时返回合约实例', async () => {
      await store.set(connectWalletAtom);

      const contract = store.get(contractAtom);
      expect(contract).not.toBeNull();
    });

    it('contractAtom 应该在没有 signer 时返回 null', () => {
      const contract = store.get(contractAtom);
      expect(contract).toBeNull();
    });

    it('ycTokenAtom 应该在有 signer 时返回合约实例', async () => {
      await store.set(connectWalletAtom);

      const ycToken = store.get(ycTokenAtom);
      expect(ycToken).not.toBeNull();
    });

    it('ycTokenAtom 应该在没有 signer 时返回 null', () => {
      const ycToken = store.get(ycTokenAtom);
      expect(ycToken).toBeNull();
    });
  });

  describe('refreshWalletAtom', () => {
    it('应该刷新余额和网络信息', async () => {
      // 先连接钱包
      await store.set(connectWalletAtom);

      // 修改 mock 返回值
      const mockProvider = store.get(providerAtom);
      if (mockProvider) {
        (mockProvider.getBalance as jest.Mock).mockResolvedValue(
          BigInt('2000000000000000000') // 2 ETH
        );
        (mockProvider.getNetwork as jest.Mock).mockResolvedValue({
          chainId: BigInt(1), // Mainnet
        });
      }

      // 刷新
      await store.set(refreshWalletAtom);

      // 验证更新
      expect(store.get(balanceAtom)).toBe('2.0000');
      expect(store.get(chainIdAtom)).toBe(1);
    });

    it('应该在没有 provider 时不执行刷新', async () => {
      await store.set(refreshWalletAtom);
      // 不应该抛出错误，只是不执行
      expect(store.get(balanceAtom)).toBeNull();
    });
  });

  describe('refreshYCTBalanceAtom', () => {
    it('应该刷新 YCT 余额', async () => {
      // 先连接钱包
      await store.set(connectWalletAtom);

      // 刷新 YCT 余额
      await store.set(refreshYCTBalanceAtom);

      // 验证余额被设置
      expect(store.get(yctBalanceAtom)).toBe('5.0000');
    });

    it('应该在没有 ycToken 时不执行刷新', async () => {
      await store.set(refreshYCTBalanceAtom);
      // 不应该抛出错误
      expect(store.get(yctBalanceAtom)).toBeNull();
    });
  });
});
