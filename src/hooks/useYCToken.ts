import { parseEther } from 'ethers';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import {
  accountAtom,
  refreshYCTBalanceAtom,
  ycTokenAtom,
  yctBalanceAtom,
} from '@/stores/web3Atoms';
import { showErrorToast } from '@/utils/toast';

export const useYCToken = () => {
  const ycToken = useAtomValue(ycTokenAtom);
  const account = useAtomValue(accountAtom);
  const yctBalance = useAtomValue(yctBalanceAtom);
  const refreshYCTBalance = useSetAtom(refreshYCTBalanceAtom);

  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [sellSuccess, setSellSuccess] = useState(false);
  const [buyHash, setBuyHash] = useState<string | null>(null);

  // 购买代币
  const buyTokens = useCallback(
    async (ethAmount: string) => {
      if (!ycToken || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsBuying(true);
        setBuySuccess(false);
        setBuyHash(null);

        const value = parseEther(ethAmount);
        console.log('💰 购买 YCT，支付 ETH:', ethAmount);

        const tx = await ycToken.buyTokens({ value });
        console.log('📝 交易已提交:', tx.hash);
        setBuyHash(tx.hash);

        await tx.wait();
        console.log('✅ 交易已确认');

        setBuySuccess(true);
      } catch (error) {
        console.error('购买失败:', error);
        // showErrorToast(error?.message || '购买失败');
      } finally {
        setIsBuying(false);
      }
    },
    [ycToken, account]
  );

  // 出售代币
  const sellTokens = useCallback(
    async (yctAmount: bigint) => {
      if (!ycToken || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsSelling(true);
        setSellSuccess(false);

        console.log('💸 出售 YCT:', yctAmount.toString());

        const tx = await ycToken.sellTokens(yctAmount);
        console.log('📝 交易已提交:', tx.hash);

        await tx.wait();
        console.log('✅ 交易已确认');

        setSellSuccess(true);
      } catch (error) {
        console.error('出售失败:', error);
        // showErrorToast(error?.message || '出售失败');
      } finally {
        setIsSelling(false);
      }
    },
    [ycToken, account]
  );

  // 获取余额（返回格式化的字符串）
  const getBalance = useCallback(async () => {
    if (!ycToken || !account) return '0';

    try {
      const balance = await ycToken.balanceOf(account);
      return (Number(balance) / 1e18).toFixed(4);
    } catch (error) {
      console.error('获取 YCT 余额失败:', error);
      return '0';
    }
  }, [ycToken, account]);

  // 刷新余额
  const refetchBalance = useCallback(async () => {
    await refreshYCTBalance();
  }, [refreshYCTBalance]);

  // 授权代币
  const useApprove = () => {
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const approve = useCallback(async (spender: string, amount: bigint) => {
      if (!ycToken || !account) {
        showErrorToast('请先连接钱包');
        return;
      }

      try {
        setIsPending(true);
        setIsSuccess(false);
        setError(null);

        console.log('📝 授权 YCT 代币:', { spender, amount: amount.toString() });

        const tx = await ycToken.approve(spender, amount);
        console.log('📝 授权交易已提交:', tx.hash);

        await tx.wait();
        console.log('✅ 授权成功');

        setIsSuccess(true);
      } catch (err) {
        console.error('授权失败:', err);
        // setError(err);
        // showErrorToast(err?.message || '授权失败');
      } finally {
        setIsPending(false);
      }
    }, []);

    // 重置成功状态
    useEffect(() => {
      if (isSuccess) {
        const timer = setTimeout(() => setIsSuccess(false), 3000);
        return () => clearTimeout(timer);
      }
    }, [isSuccess]);

    return {
      approve,
      isPending,
      isSuccess,
      error,
    };
  };

  // 重置成功状态（用于清理状态）
  useEffect(() => {
    if (buySuccess) {
      const timer = setTimeout(() => setBuySuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [buySuccess]);

  useEffect(() => {
    if (sellSuccess) {
      const timer = setTimeout(() => setSellSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [sellSuccess]);

  return {
    // 状态
    yctBalance,
    isBuying,
    isSelling,
    buySuccess,
    sellSuccess,
    buyHash,

    // 方法
    buyTokens,
    sellTokens,
    getBalance,
    refetchBalance,
    useApprove,
  };
};
