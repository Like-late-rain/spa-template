import { createTokenBalanceRefreshAtom, createWalletAtoms } from '@yuechu/wallet-jotai';
import { atom } from 'jotai';
import AAVEPoolABI from '@/abis/AAVEPool.json';
import ATokenABI from '@/abis/AToken.json';
import addresses from '@/abis/addresses.json';
import WETHABI from '@/abis/WETH.json';
import { walletLogin } from '@/services/userApi';
import { UniversityCourse__factory, YCToken__factory } from '@/types';
import type { User } from '@/types/users';

// 定义合约配置（使用 as const 让 TypeScript 推断具体类型）
const contractsConfig = {
  // 使用 typechain factory（有类型提示）
  universityCourse: {
    address: addresses.UniversityCourse,
    factory: UniversityCourse__factory,
  },
  ycToken: {
    address: addresses.YCToken,
    factory: YCToken__factory,
  },
  // 使用普通 ABI
  aavePool: {
    address: addresses.AAVEPool,
    abi: AAVEPoolABI.abi,
  },
  weth: {
    address: addresses.WETH,
    abi: WETHABI.abi,
  },
  aWETH: {
    address: addresses.aWETH,
    abi: ATokenABI.abi,
  },
} as const;

// 创建钱包 atoms，传入配置
export const walletAtoms = createWalletAtoms<User, typeof contractsConfig>({
  contracts: contractsConfig,
  // 连接成功后调用登录
  onConnect: async (address) => {
    return await walletLogin(address);
  },
});

// 解构导出基础 atoms
export const {
  signerAtom,
  providerAtom,
  accountAtom,
  balanceAtom,
  chainIdAtom,
  currentUserAtom,
  connectWalletAtom,
  autoConnectWalletAtom,
  refreshWalletAtom,
  switchNetworkAtom,
  disconnectWalletAtom,
  contractAtoms,
} = walletAtoms;

// 导出具体合约 atom（现在自动推断类型，不需要类型断言！）
export const universityCourseAtom = contractAtoms.universityCourse;
export const ycTokenAtom = contractAtoms.ycToken;
export const wethContractAtom = contractAtoms.weth;
export const aWETHContractAtom = contractAtoms.aWETH;
export const aavePoolAtom = contractAtoms.aavePool;

// 代币余额 atoms
export const yctBalanceAtom = atom<string | null>(null);
export const wethBalanceAtom = atom<string | null>(null);
export const aWETHBalanceAtom = atom<string | null>(null);

// 创建刷新余额的 action atoms
export const refreshYCTBalanceAtom = createTokenBalanceRefreshAtom(
  ycTokenAtom,
  accountAtom,
  yctBalanceAtom
);

export const refreshWETHBalanceAtom = createTokenBalanceRefreshAtom(
  wethContractAtom,
  accountAtom,
  wethBalanceAtom
);

export const refreshAWETHBalanceAtom = createTokenBalanceRefreshAtom(
  aWETHContractAtom,
  accountAtom,
  aWETHBalanceAtom
);
