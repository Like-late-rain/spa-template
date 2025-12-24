import type { Eip1193Provider, Signer } from 'ethers';
import { BrowserProvider, Contract } from 'ethers';
import { atom } from 'jotai';
import AAVEPoolABI from '@/abis/AAVEPool.json';
import ATokenABI from '@/abis/AToken.json';
import addresses from '@/abis/addresses.json';
import WETHABI from '@/abis/WETH.json';
import { walletLogin } from '@/services/userApi';
import type { UniversityCourse, YCToken } from '@/types';
import { UniversityCourse__factory, YCToken__factory } from '@/types';
import { User } from '@/types/users';

// Signer 状态
export const signerAtom = atom<Signer | null>(null);

// Provider 状态
export const providerAtom = atom<BrowserProvider | null>(null);

// 连接的账户地址
export const accountAtom = atom<string | null>(null);

// 账户余额（ETH）
export const balanceAtom = atom<string | null>(null);

// YCT 代币余额
export const yctBalanceAtom = atom<string | null>(null);

// WETH 余额
export const wethBalanceAtom = atom<string | null>(null);

// aWETH 余额（存款凭证）
export const aWETHBalanceAtom = atom<string | null>(null);

// 当前网络 ID
export const chainIdAtom = atom<number | null>(null);

// 合约实例 - 派生 atom，自动根据 signer 创建
export const contractAtom = atom<UniversityCourse | null>((get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  const contractAddress = addresses.UniversityCourse as `0x${string}`;
  return UniversityCourse__factory.connect(contractAddress, signer);
});

// 合约实例 - YCToken atom，自动根据 signer 创建
export const ycTokenAtom = atom<YCToken | null>((get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  const contractAddress = addresses.YCToken as `0x${string}`;
  return YCToken__factory.connect(contractAddress, signer);
});

// 连接钱包的 action（会弹出授权窗口）
export const connectWalletAtom = atom(null, async (_get, set) => {
  // 类型断言：告诉 TypeScript window.ethereum 存在
  const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;
  console.log('手动连接···');
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

  // 钱包连接成功后，自动调用后端登录/注册
  try {
    const user = await walletLogin(address);
    set(currentUserAtom, user);
    console.log('✅ 用户登录成功:', user);
  } catch (error) {
    console.error('❌ 用户登录失败:', error);
    // 登录失败不影响钱包连接，只是用户信息为空
  }

  return { signer, address, balance: balanceInEth, chainId };
});

// 自动重连（不会弹窗，只在已授权时连接）
export const autoConnectWalletAtom = atom(null, async (_get, set) => {
  const ethereum = (window as { ethereum?: Eip1193Provider }).ethereum;
  console.log('调用自动登录');
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

    // TODO: 自动重连时的登录逻辑暂时注释，避免与 connectWalletAtom 重复调用
    // 后续可以优化：检查 currentUserAtom 是否为空，再决定是否调用登录
    try {
      const user = await walletLogin(address);
      set(currentUserAtom, user);
      console.log('✅ 自动登录成功:', user);
    } catch (error) {
      console.error('❌ 自动登录失败:', error);
    }

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

// 刷新 YCT 余额
export const refreshYCTBalanceAtom = atom(null, async (get, set) => {
  const ycToken = get(ycTokenAtom);
  const account = get(accountAtom);

  if (!ycToken || !account) {
    return;
  }

  try {
    const balance = await ycToken.balanceOf(account);
    const balanceInYCT = (Number(balance) / 1e18).toFixed(4);
    set(yctBalanceAtom, balanceInYCT);
    console.log('🪙 YCT 余额:', balanceInYCT);
  } catch (error) {
    console.error('刷新 YCT 余额失败:', error);
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

// AAVE 相关合约实例
export const aavePoolAtom = atom(async (get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  return new Contract(addresses.AAVEPool as `0x${string}`, AAVEPoolABI.abi, signer);
});

// WETH 合约实例
export const wethContractAtom = atom(async (get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  return new Contract(addresses.WETH as `0x${string}`, WETHABI.abi, signer);
});

// aWETH(aToken) 合约实例
export const aWETHContractAtom = atom(async (get) => {
  const signer = get(signerAtom);
  if (!signer) return null;

  return new Contract(addresses.aWETH as `0x${string}`, ATokenABI.abi, signer);
});

// 刷新 WETH 余额
export const refreshWETHBalanceAtom = atom(null, async (get, set) => {
  const wethContract = await get(wethContractAtom);
  const account = get(accountAtom);
  if (!wethContract || !account) {
    return;
  }

  try {
    const balance = await wethContract.balanceOf(account);
    const balanceInEth = (Number(balance) / 1e18).toFixed(4);
    set(wethBalanceAtom, balanceInEth);
    console.log('🪙 WETH 余额:', balanceInEth);
  } catch {
    console.error('刷新 WETH 余额失败:');
  }
});

// 刷新 aWETH 余额
export const refreshAWETHBalanceAtom = atom(null, async (get, set) => {
  const aWETHContract = await get(aWETHContractAtom);
  const account = get(accountAtom);

  if (!aWETHContract || !account) {
    return;
  }

  try {
    const balance = await aWETHContract.balanceOf(account);
    const balanceInEth = (Number(balance) / 1e18).toFixed(4);
    set(aWETHBalanceAtom, balanceInEth);
    console.log('📊 aWETH 余额:', balanceInEth);
  } catch (error) {
    console.error('刷新 aWETH 余额失败:', error);
  }
});

// 当前登录的用户信息（在其他 atom 定义后面添加）
export const currentUserAtom = atom<User | null>(null);
