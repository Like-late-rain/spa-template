import type { Eip1193Provider, Signer, JsonRpcSigner } from 'ethers';
import { BrowserProvider, Contract } from 'ethers';
import type { Atom, PrimitiveAtom, WritableAtom } from 'jotai';
import { atom } from 'jotai';
import type { WalletConfig, ContractsConfig, ExtractContractsTypes } from './types';

// 导出类型
export type {
  ContractConfig,
  WalletConfig,
  ContractsConfig,
  ExtractContractType,
  ExtractContractsTypes,
} from './types';

// 连接结果类型
export interface ConnectResult {
  signer: JsonRpcSigner;
  address: string;
  balance: string;
  chainId: number;
}

// 定义返回类型（带泛型）
export interface WalletAtoms<
  TUser = unknown,
  TContracts extends ContractsConfig = ContractsConfig,
> {
  // 基础状态
  signerAtom: PrimitiveAtom<Signer | null>;
  providerAtom: PrimitiveAtom<BrowserProvider | null>;
  accountAtom: PrimitiveAtom<string | null>;
  balanceAtom: PrimitiveAtom<string | null>;
  chainIdAtom: PrimitiveAtom<number | null>;
  currentUserAtom: PrimitiveAtom<TUser | null>;

  // 合约 atoms（保留具体类型）
  contractAtoms: {
    [K in keyof TContracts]: Atom<ExtractContractsTypes<TContracts>[K] | null>;
  };

  // Action atoms
  connectWalletAtom: WritableAtom<null, [], Promise<ConnectResult>>;
  autoConnectWalletAtom: WritableAtom<null, [], Promise<ConnectResult | null>>;
  refreshWalletAtom: WritableAtom<null, [], Promise<void>>;
  switchNetworkAtom: WritableAtom<null, [number], Promise<void>>;
  disconnectWalletAtom: WritableAtom<null, [], Promise<void>>;
}

/**
 * 创建钱包相关的 Jotai atoms
 * @param config 钱包配置
 * @returns 所有钱包相关的 atoms
 *
 * @example
 * ```typescript
 * const walletAtoms = createWalletAtoms({
 *   contracts: {
 *     myToken: {
 *       address: '0x...',
 *       factory: MyToken__factory,  // typechain 生成的 factory
 *     },
 *   },
 * });
 *
 * // contractAtoms.myToken 会自动推断为 Atom<MyToken | null>
 * const tokenAtom = walletAtoms.contractAtoms.myToken;
 * ```
 */
export function createWalletAtoms<
  TUser = unknown,
  TContracts extends ContractsConfig = ContractsConfig,
>(
  config: WalletConfig<TUser, TContracts> = {} as WalletConfig<TUser, TContracts>
): WalletAtoms<TUser, TContracts> {
  // ============ 基础状态 atoms ============

  // Signer 状态
  const signerAtom = atom<Signer | null>(null);

  // Provider 状态
  const providerAtom = atom<BrowserProvider | null>(null);

  // 连接的账户地址
  const accountAtom = atom<string | null>(null);

  // 账户余额（ETH）
  const balanceAtom = atom<string | null>(null);

  // 当前网络 ID
  const chainIdAtom = atom<number | null>(null);

  // 当前登录的用户信息
  const currentUserAtom = atom<TUser | null>(null);

  // ============ 动态合约 atoms ============

  const contractAtoms = {} as {
    [K in keyof TContracts]: Atom<ExtractContractsTypes<TContracts>[K] | null>;
  };

  if (config.contracts) {
    for (const [name, contractConfig] of Object.entries(config.contracts)) {
      const contractAtom = atom((get) => {
        const signer = get(signerAtom);
        if (!signer) return null;

        // 如果提供了 factory，使用 factory 创建（支持 typechain 类型）
        if (contractConfig.factory) {
          return contractConfig.factory.connect(contractConfig.address, signer);
        }

        // 否则使用普通的 Contract 创建
        if (contractConfig.abi) {
          return new Contract(contractConfig.address, contractConfig.abi, signer);
        }

        console.warn(`Contract ${name} 缺少 abi 或 factory 配置`);
        return null;
      });

      // 使用类型断言赋值
      (contractAtoms as Record<string, Atom<unknown>>)[name] = contractAtom;
    }
  }

  // ============ Action atoms ============

  // 连接钱包的 action（会弹出授权窗口）
  const connectWalletAtom = atom(null, async (_get, set) => {
    const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;

    if (!ethereum) {
      throw new Error('请安装 MetaMask 或其他以太坊钱包');
    }

    // 请求账户权限，这会弹出 MetaMask 授权窗口
    await ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    // 获取余额
    const balance = await provider.getBalance(address);
    const balanceInEth = (Number(balance) / 1e18).toFixed(4);

    // 获取网络 ID
    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    set(providerAtom, provider);
    set(signerAtom, signer);
    set(accountAtom, address);
    set(balanceAtom, balanceInEth);
    set(chainIdAtom, chainId);

    // 钱包连接成功后，调用用户提供的回调
    if (config.onConnect) {
      try {
        const user = await config.onConnect(address);
        set(currentUserAtom, user);
      } catch (error) {
        console.error('用户登录失败:', error);
      }
    }

    return { signer, address, balance: balanceInEth, chainId };
  });

  // 自动重连（不会弹窗，只在已授权时连接）
  const autoConnectWalletAtom = atom(null, async (_get, set) => {
    const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;

    if (!ethereum) {
      return null;
    }

    try {
      // 使用 eth_accounts 不会弹窗，只返回已授权的账户
      const accounts = (await ethereum.request({
        method: 'eth_accounts',
      })) as string[];

      // 如果没有授权的账户，不自动连接
      if (!accounts || accounts.length === 0) {
        return null;
      }

      // 已授权，自动连接
      const provider = new BrowserProvider(ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // 获取余额
      const balance = await provider.getBalance(address);
      const balanceInEth = (Number(balance) / 1e18).toFixed(4);

      // 获取网络 ID
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      set(providerAtom, provider);
      set(signerAtom, signer);
      set(accountAtom, address);
      set(balanceAtom, balanceInEth);
      set(chainIdAtom, chainId);

      // 自动重连时调用用户提供的回调
      if (config.onAutoConnect) {
        try {
          const user = await config.onAutoConnect(address);
          set(currentUserAtom, user);
        } catch (error) {
          console.error('自动登录失败:', error);
        }
      } else if (config.onConnect) {
        // 如果没有单独的 onAutoConnect，则使用 onConnect
        try {
          const user = await config.onConnect(address);
          set(currentUserAtom, user);
        } catch (error) {
          console.error('自动登录失败:', error);
        }
      }

      return { signer, address, balance: balanceInEth, chainId };
    } catch (error) {
      console.error('自动连接失败:', error);
      return null;
    }
  });

  // 刷新钱包信息（余额、网络等）
  const refreshWalletAtom = atom(null, async (get, set) => {
    const provider = get(providerAtom);
    const account = get(accountAtom);

    if (!provider || !account) {
      return;
    }

    try {
      // 获取最新余额
      const balance = await provider.getBalance(account);
      const balanceInEth = (Number(balance) / 1e18).toFixed(4);

      // 获取最新网络
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);

      set(balanceAtom, balanceInEth);
      set(chainIdAtom, chainId);
    } catch (error) {
      console.error('刷新钱包信息失败:', error);
    }
  });

  // 切换网络
  const switchNetworkAtom = atom(null, async (_get, set, targetChainId: number) => {
    const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;

    if (!ethereum) {
      throw new Error('请安装 MetaMask');
    }

    try {
      // 尝试切换网络
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });

      // 等待一小段时间，确保网络切换完成
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 刷新钱包信息
      const refresh = set as (atom: typeof refreshWalletAtom) => Promise<void>;
      await refresh(refreshWalletAtom);
    } catch (error) {
      // 如果网络不存在，则添加网络
      if (typeof error === 'object' && error !== null && 'code' in error && error.code === 4902) {
        throw new Error('该网络未添加到钱包中');
      }
      throw error;
    }
  });

  // 断开钱包连接
  const disconnectWalletAtom = atom(null, async (_get, set) => {
    set(signerAtom, null);
    set(providerAtom, null);
    set(accountAtom, null);
    set(balanceAtom, null);
    set(chainIdAtom, null);
    set(currentUserAtom, null);
  });

  return {
    // 基础状态
    signerAtom,
    providerAtom,
    accountAtom,
    balanceAtom,
    chainIdAtom,
    currentUserAtom,

    // 合约 atoms
    contractAtoms,

    // Action atoms
    connectWalletAtom,
    autoConnectWalletAtom,
    refreshWalletAtom,
    switchNetworkAtom,
    disconnectWalletAtom,
  };
}

/**
 * 创建代币余额刷新 atom 的工厂函数
 * @param contractAtom 合约 atom
 * @param accountAtom 账户 atom
 * @param balanceAtom 余额 atom（用于存储结果）
 * @param decimals 代币精度，默认 18
 */
export function createTokenBalanceRefreshAtom(
  contractAtom: Atom<unknown>,
  accountAtom: Atom<string | null>,
  balanceAtom: PrimitiveAtom<string | null>,
  decimals: number = 18
) {
  return atom(null, async (get, set) => {
    const contract = get(contractAtom);
    const account = get(accountAtom);

    if (!contract || !account) {
      return;
    }

    try {
      const balance = await (contract as Contract).balanceOf(account);
      const formattedBalance = (Number(balance) / 10 ** decimals).toFixed(4);
      set(balanceAtom, formattedBalance);
      return formattedBalance;
    } catch (error) {
      console.error('刷新代币余额失败:', error);
      return null;
    }
  });
}
