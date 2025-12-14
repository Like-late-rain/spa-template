import { atom } from 'jotai';
import type { Signer, Eip1193Provider } from 'ethers';
import { BrowserProvider } from 'ethers';
import type { UniversityCourse } from '@/types';
import { UniversityCourse__factory } from '@/types';
import addresses from '@/abis/addresses.json';

// Signer 状态
export const signerAtom = atom<Signer | null>(null);

// Provider 状态
export const providerAtom = atom<BrowserProvider | null>(null);

// 连接的账户地址
export const accountAtom = atom<string | null>(null);

// 账户余额（ETH）
export const balanceAtom = atom<string | null>(null);

// 当前网络 ID
export const chainIdAtom = atom<number | null>(null);

// 合约实例 - 派生 atom，自动根据 signer 创建
export const contractAtom = atom<UniversityCourse | null>((get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  const contractAddress = addresses.UniversityCourse as `0x${string}`;
  return UniversityCourse__factory.connect(contractAddress, signer);
});

// 连接钱包的 action（会弹出授权窗口）
export const connectWalletAtom = atom(null, async (_get, set) => {
  // 类型断言：告诉 TypeScript window.ethereum 存在
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

  return { signer, address, balance: balanceInEth, chainId };
});

// 自动重连（不会弹窗，只在已授权时连接）
export const autoConnectWalletAtom = atom(null, async (_get, set) => {
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
    console.log('🚀 ~ provider:', provider);
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

    return { signer, address, balance: balanceInEth, chainId };
  } catch (error) {
    console.error('自动连接失败:', error);
    return null;
  }
});

// 刷新钱包信息（余额、网络等）
export const refreshWalletAtom = atom(null, async (get, set) => {
  const provider = get(providerAtom);
  const account = get(accountAtom);

  if (!provider || !account) {
    return;
  }

  try {
    // 获取最新余额
    const balance = await provider.getBalance(account);
    console.log('🚀 ~ balance:', balance);
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
export const switchNetworkAtom = atom(null, async (_get, set, targetChainId: number) => {
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
