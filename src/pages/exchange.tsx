import { parseEther } from 'ethers';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useYCToken } from '@/hooks/useYCToken';
import {
  accountAtom,
  balanceAtom,
  refreshWalletAtom,
  refreshYCTBalanceAtom,
} from '@/stores/web3Atoms';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export default function Exchange() {
  const account = useAtomValue(accountAtom);
  const ethBalance = useAtomValue(balanceAtom);
  const refreshETHBalance = useSetAtom(refreshWalletAtom);
  const refreshYCTBalance = useSetAtom(refreshYCTBalanceAtom);

  const {
    yctBalance,
    buyTokens,
    sellTokens,
    isBuying,
    isSelling,
    buySuccess,
    sellSuccess,
    buyHash,
  } = useYCToken();

  const isConnected = !!account;

  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [ethAmount, setEthAmount] = useState('');
  const [yctAmount, setYCTAmount] = useState('');

  const EXCHANGE_RATE = 10000; // 1 ETH = 10000 YCT

  // 初始加载时获取 YCT 余额
  useEffect(() => {
    if (isConnected) {
      refreshYCTBalance();
    }
  }, [isConnected, refreshYCTBalance]);

  const handleETHChange = (value: string) => {
    setEthAmount(value);
    if (value) {
      const yct = parseFloat(value) * EXCHANGE_RATE;
      setYCTAmount(yct.toString());
    } else {
      setYCTAmount('');
    }
  };

  const handleYCTChange = (value: string) => {
    setYCTAmount(value);
    if (value) {
      const eth = parseFloat(value) / EXCHANGE_RATE;
      setEthAmount(eth.toString());
    } else {
      setEthAmount('');
    }
  };

  const handleBuy = () => {
    if (!ethAmount || parseFloat(ethAmount) <= 0) {
      showErrorToast('请输入有效的 ETH 数量');
      return;
    }

    buyTokens(ethAmount);
  };

  // 出售 YCT
  const handleSell = () => {
    if (!yctAmount || parseFloat(yctAmount) <= 0) {
      showErrorToast('请输入有效的 YCT 数量');
      return;
    }

    const amount = parseEther(yctAmount) as bigint;
    sellTokens(amount);
  };

  // 监听购买成功
  useEffect(() => {
    if (buySuccess && buyHash) {
      showSuccessToast('购买成功！YCT 已到账');
      setEthAmount('');
      setYCTAmount('');

      // 延迟刷新，确保区块链状态已更新
      setTimeout(() => {
        Promise.all([refreshETHBalance(), refreshYCTBalance()]).then(() => {
          console.log('💰 余额已刷新');
        });
      }, 2000);
    }
  }, [buySuccess, buyHash, refreshETHBalance, refreshYCTBalance]);

  // 监听出售成功
  useEffect(() => {
    if (sellSuccess) {
      showSuccessToast('出售成功！ETH 已到账');
      setEthAmount('');
      setYCTAmount('');

      // 延迟刷新，确保区块链状态已更新
      setTimeout(() => {
        Promise.all([refreshETHBalance(), refreshYCTBalance()]);
      }, 2000);
    }
  }, [sellSuccess, refreshETHBalance, refreshYCTBalance]);

  return (
    <div className="min-w-[700px] mx-auto">
      {/* 页面头部 */}
      <div className="relative text-center mb-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyber-blue/10 blur-3xl -z-10"></div>
        <h1 className="text-5xl font-bold mb-4 gradient-text animate-slide-up">兑换中心</h1>
        <p className="text-xl text-gray-400 animate-slide-up">ETH 与 YCT 代币的快速兑换</p>
      </div>

      {/* 余额显示卡片 */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-gray-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition"></div>
          <div className="relative glass rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400 uppercase tracking-wider">ETH 余额</p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <title>ETH token icon</title>
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-1">{ethBalance || '0'}</p>
            <p className="text-sm text-gray-500">ETH</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-2xl blur opacity-40 group-hover:opacity-70 transition"></div>
          <div className="relative glass rounded-2xl p-8 border border-cyber-cyan/30">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400 uppercase tracking-wider">YCT 余额</p>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-blue flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>YCT token icon</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold gradient-text mb-1">{yctBalance || '0'}</p>
            <p className="text-sm text-gray-500">YCT</p>
          </div>
        </div>
      </div>

      {/* 兑换卡片 */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-2xl blur opacity-20"></div>
        <div className="relative glass rounded-2xl p-8 border border-white/10">
          {/* 模式切换 */}
          <div className="flex space-x-3 mb-8">
            <button
              type="button"
              onClick={() => setMode('buy')}
              className={`relative flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                mode === 'buy' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {mode === 'buy' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl"></div>
                </>
              )}
              <span className="relative">购买 YCT</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('sell')}
              className={`relative flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                mode === 'sell' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {mode === 'sell' && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl blur opacity-50"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl"></div>
                </>
              )}
              <span className="relative">出售 YCT</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* ETH 输入 */}
            <div>
              <label
                htmlFor="ethAmount"
                className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider"
              >
                {mode === 'buy' ? '支付 ETH' : '获得 ETH'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={ethAmount}
                  onChange={(e) => handleETHChange(e.target.value)}
                  step="0.0001"
                  min="0"
                  className="w-full px-6 py-4 bg-dark-card/50 border border-white/10 rounded-xl text-white text-lg font-mono focus:outline-none focus:border-cyber-cyan focus:ring-2 focus:ring-cyber-cyan/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.0000"
                  disabled={mode === 'sell'}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold">
                  ETH
                </div>
              </div>
            </div>

            {/* 箭头 */}
            <div className="flex justify-center relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative glass rounded-full p-3 border border-white/10">
                {mode === 'buy' ? (
                  <ArrowDown className="text-cyber-cyan" size={24} />
                ) : (
                  <ArrowUp className="text-cyber-blue" size={24} />
                )}
              </div>
            </div>

            {/* YCT 输入 */}
            <div>
              <label
                htmlFor="yctAmount"
                className="block text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider"
              >
                {mode === 'buy' ? '获得 YCT' : '支付 YCT'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={yctAmount}
                  onChange={(e) => handleYCTChange(e.target.value)}
                  step="1"
                  min="0"
                  className="w-full px-6 py-4 bg-dark-card/50 border border-white/10 rounded-xl text-white text-lg font-mono focus:outline-none focus:border-cyber-blue focus:ring-2 focus:ring-cyber-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.0000"
                  disabled={mode === 'buy'}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyber-cyan text-sm font-bold">
                  YCT
                </div>
              </div>
            </div>

            {/* 汇率提示 */}
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl blur opacity-20"></div>
              <div className="relative glass rounded-xl p-4 border border-cyber-cyan/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">兑换比例</span>
                  <span className="text-cyber-cyan font-bold">1 ETH = {EXCHANGE_RATE} YCT</span>
                </div>
              </div>
            </div>

            {/* 兑换按钮 */}
            <button
              type="button"
              onClick={mode === 'buy' ? handleBuy : handleSell}
              disabled={!isConnected || isBuying || isSelling}
              className="group relative w-full overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-purple rounded-xl blur opacity-60 group-hover:opacity-100 transition disabled:opacity-30"></div>
              <div className="relative px-8 py-5 bg-gradient-to-r from-cyber-cyan to-cyber-blue rounded-xl font-bold text-xl text-white transition-transform group-hover:scale-[1.02] disabled:transform-none">
                {isBuying || isSelling ? '处理中...' : mode === 'buy' ? '购买 YCT' : '出售 YCT'}
              </div>
            </button>

            {!isConnected && (
              <div className="text-center">
                <p className="text-red-400 text-sm font-medium">请先连接钱包</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
