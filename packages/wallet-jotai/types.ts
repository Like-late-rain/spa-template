import type { Signer, ContractRunner, InterfaceAbi, BaseContract } from 'ethers';

/**
 * 单个合约的配置
 * @template T 合约类型，用于 factory 返回值的类型推断
 */
export interface ContractConfig<T extends BaseContract = BaseContract> {
  address: string;
  abi?: InterfaceAbi;
  factory?: {
    connect: (address: string, signerOrProvider: Signer | ContractRunner) => T;
  };
}

/**
 * 合约配置映射类型
 * 用于从配置中提取合约类型
 */
export type ContractsConfig = Record<string, ContractConfig<BaseContract>>;

/**
 * 从合约配置中提取合约类型
 * 如果有 factory，使用 factory.connect 的返回类型
 * 否则使用 BaseContract
 */
export type ExtractContractType<T> = T extends ContractConfig<infer C> ? C : BaseContract;

/**
 * 从合约配置映射中提取所有合约类型的映射
 */
export type ExtractContractsTypes<T extends ContractsConfig> = {
  [K in keyof T]: ExtractContractType<T[K]>;
};

export interface WalletConfig<
  TUser = unknown,
  TContracts extends ContractsConfig = ContractsConfig,
> {
  /** 合约配置，key 为合约名称 */
  contracts?: TContracts;
  /** 连接钱包成功后的回调，用于登录等业务逻辑 */
  onConnect?: (address: string) => Promise<TUser | null>;
  /** 自动重连成功后的回调，如果不提供则使用 onConnect */
  onAutoConnect?: (address: string) => Promise<TUser | null>;
}
