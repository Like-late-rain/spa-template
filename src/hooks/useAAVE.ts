import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import addresses from '@/abis/addresses.json';
import {
  aavePoolAtom,
  accountAtom,
  aWETHBalanceAtom,
  refreshAWETHBalanceAtom,
  refreshWETHBalanceAtom,
  wethBalanceAtom,
  wethContractAtom,
} from '@/stores/web3Atoms';
import { showErrorToast } from '@/utils/toast';

// YCT 兑换 ETH 的比率（示例：1 ETH = 1000 YCT）
export const YCT_TO_ETH_RATE = 1000;

export const useAAVE = () => {
  const account = useAtomValue(accountAtom);
  const aavePool = useAtomValue(aavePoolAtom);
  const wethContract = useAtomValue(wethContractAtom);
  const wethBalance = useAtomValue(wethBalanceAtom);
  const aWETHBalance = useAtomValue(aWETHBalanceAtom);

  const refreshWETHBalance = useSetAtom(refreshWETHBalanceAtom);
  const refreshAWETHBalance = useSetAtom(refreshAWETHBalanceAtom);

  //   包装 ETH 为 WETH
  const useWrapETH = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const wrap = useCallback(async (amount: bigint) => {
      if (!wethContract || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);

        const tx = await wethContract.deposit({ value: amount });
        console.log('📝 包装交易已提交:', tx.hash);
        await tx.wait();
        console.log('✅ 包装交易已确认');

        setIsSuccess(true);
        await refreshWETHBalance();
      } catch (err) {
        console.error('包装失败:', err);
      } finally {
        setIsPending(false);
      }
    }, []);

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return {
      wrap,
      isPending,
      isSuccess,
    };
  };

  // 解包 WETH 为 ETH
  const useUnwrapWETH = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const unwrap = useCallback(async (amount: bigint) => {
      if (!wethContract || !account) {
        showErrorToast('请先连接钱包');
        return;
      }
      try {
        setIsPending(true);
        setIsSuccess(false);
        const tx = await wethContract.withdraw(amount);
        console.log('📝 解包交易已提交:', tx.hash);
        await tx.wait();
        console.log('✅ 解包交易已确认');

        setIsSuccess(true);
        await refreshWETHBalance();
      } catch (err) {
        console.error('解包失败:', err);
      } finally {
        setIsPending(false);
      }
    }, []);

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => {
          setIsSuccess(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return {
      unwrap,
      isPending,
      isSuccess,
    };
  };

  // 3. 授权 WETH 给 AAVE Pool
  const useApproveWETH = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const approve = useCallback(async (amount: bigint) => {
      if (!wethContract || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);

        console.log('✅ 授权 WETH 给 AAVE Pool');
        const tx = await wethContract.approve(addresses.AAVEPool, amount);
        await tx.wait();

        setIsSuccess(true);
      } catch (error) {
        console.error('授权失败:', error);
      } finally {
        setIsPending(false);
      }
    }, []);

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setIsSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return { approve, isPending, isSuccess };
  };

  // 4. 存入 WETH 到 AAVE
  const useSupplyWETH = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const supply = useCallback(async (amount: bigint, onBehalfOf: string) => {
      if (!aavePool || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);

        console.log('💰 存入 WETH 到 AAVE');
        const tx = await aavePool.supply(addresses.WETH, amount, onBehalfOf, 0);
        await tx.wait();

        setIsSuccess(true);
        await refreshAWETHBalance();
      } catch (error) {
        console.error('存入失败:', error);
      } finally {
        setIsPending(false);
      }
    }, []);

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setIsSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return { supply, isPending, isSuccess };
  };

  // 5. 从 AAVE 取款
  const useWithdrawWETH = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const withdraw = useCallback(async (amount: bigint, to: string) => {
      if (!aavePool || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);

        console.log('💸 从 AAVE 取款');
        const tx = await aavePool.withdraw(addresses.WETH, amount, to);
        await tx.wait();

        setIsSuccess(true);
        await refreshAWETHBalance();
        await refreshWETHBalance();
      } catch (error) {
        console.error('取款失败:', error);
      } finally {
        setIsPending(false);
      }
    }, []);

    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setIsSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return { withdraw, isPending, isSuccess };
  };

  // 计算 APY (简化版本)
  const calculateAPY = (liquidityRate: bigint) => {
    // AAVE 的 liquidityRate 是 Ray 格式 (1e27)
    const rate = Number(liquidityRate) / 1e27;
    const apy = (rate * 100).toFixed(2);
    return apy;
  };

  return {
    // 状态
    wethBalance,
    aWETHBalance,

    // Hooks
    useWrapETH,
    useUnwrapWETH,
    useApproveWETH,
    useSupplyWETH,
    useWithdrawWETH,

    // 工具函数
    calculateAPY,
    YCT_TO_ETH_RATE,

    // 刷新函数
    refreshWETHBalance,
    refreshAWETHBalance,
  };
};
