import { parseEther } from 'ethers';
import { useAtomValue } from 'jotai';
import { AlertCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';

import NumberInput from '@/components/common/NumberInput';
import { useAAVE } from '@/hooks/useAAVE';
import { accountAtom, balanceAtom } from '@/stores/web3Atoms';
import { dismissToast, showErrorToast, showLoadingToast, showSuccessToast } from '@/utils/toast';

export default function AAVE() {
  const ethBalance = useAtomValue(balanceAtom);
  const account = useAtomValue(accountAtom);

  const {
    wethBalance,
    aWETHBalance,
    useWrapETH,
    useUnwrapWETH,
    useApproveWETH,
    useSupplyWETH,
    useWithdrawWETH,
    refreshWETHBalance,
    refreshAWETHBalance,
  } = useAAVE();

  // 初始化所有操作 hooks
  const wrapETH = useWrapETH();
  const unwrapWETH = useUnwrapWETH();
  const approveWETH = useApproveWETH();
  const supplyWETH = useSupplyWETH();
  const withdrawWETH = useWithdrawWETH();

  // 本地状态
  const [amount, setAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // APY 计算（简化为固定值）
  const wethAPY = '0.00';

  // 存款逻辑 - 简化版，顺序执行
  const handleDeposit = async () => {
    if (!account || !amount || parseFloat(amount) <= 0) {
      showErrorToast('请输入有效的存款金额');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const amountInWei = parseEther(amount);

      // 步骤 1: 包装 ETH 为 WETH
      showLoadingToast(`包装 ${amount} ETH 为 WETH...`);
      await wrapETH.wrap(amountInWei);
      dismissToast();

      showSuccessToast('ETH 包装成功！');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 步骤 2: 授权 WETH 给 AAVE Pool
      showLoadingToast('授权 WETH...');
      await approveWETH.approve(amountInWei);
      dismissToast();

      showSuccessToast('授权成功！');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 步骤 3: 存入 WETH 到 AAVE
      showLoadingToast('存入 AAVE...');
      await supplyWETH.supply(amountInWei, account);
      dismissToast();

      showSuccessToast('存款成功！');
      setAmount('');

      // 刷新余额
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refreshWETHBalance();
      await refreshAWETHBalance();
    } catch (error) {
      dismissToast();
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      showErrorToast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 取款逻辑 - 简化版
  const handleWithdraw = async () => {
    if (!account || !withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      showErrorToast('请输入有效的取款金额');
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);
      const amountInWei = parseEther(withdrawAmount);

      // 步骤 1: 从 AAVE 取款
      showLoadingToast('从 AAVE 取款...');
      await withdrawWETH.withdraw(amountInWei, account);
      dismissToast();

      showSuccessToast('取款成功！');
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 步骤 2: 解包 WETH 为 ETH
      showLoadingToast('解包 WETH 为 ETH...');
      await unwrapWETH.unwrap(amountInWei);
      dismissToast();

      showSuccessToast('解包成功！ETH 已到账');
      setWithdrawAmount('');

      // 刷新余额
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await refreshWETHBalance();
      await refreshAWETHBalance();
    } catch (error) {
      dismissToast();
      const errorMessage = error instanceof Error ? error.message : '操作失败';
      showErrorToast(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 刷新所有余额
  const refreshAllBalances = async () => {
    await refreshWETHBalance();
    await refreshAWETHBalance();
  };

  return (
    <>
      <title>AAVE 理财 - Web3 涂山大学</title>

      {/* 背景装饰 */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 mb-8 animate-gradient">
          AAVE 理财协议
        </h1>

        {/* 提示 - 玻璃态效果 */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 flex items-start space-x-3">
            <AlertCircle
              className="text-cyan-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              size={20}
            />
            <div>
              <p className="text-sm text-cyan-300 font-semibold mb-1">AAVE 协议集成</p>
              <p className="text-sm text-gray-300">
                您可以将 ETH 存入 AAVE 协议赚取收益。存款将自动生成利息。
              </p>
            </div>
          </div>
        </div>

        {/* 教育提示 - 玻璃态效果 */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
          <div className="relative bg-gray-900/50 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-5 flex items-start space-x-3">
            <AlertCircle
              className="text-yellow-400 flex-shrink-0 mt-1 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
              size={20}
            />
            <div>
              <p className="text-sm text-yellow-300 font-semibold mb-2">
                📚 教育提示：关于测试网收益率
              </p>
              <p className="text-sm text-gray-300 mb-2">
                当前使用 <strong className="text-yellow-400">Sepolia 测试网</strong>
                ，APY 接近 0% 是正常现象。这是因为测试网几乎没有借款需求，资金利用率接近 0%。
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-yellow-400">主网参考收益率：</strong> WETH 约 1-2% APY，USDT
                约 3-5% APY。 本课程重点是学习 DeFi 协议的工作原理和智能合约交互。
              </p>
            </div>
          </div>
        </div>

        {/* 余额显示 - 科技卡片 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ETH 余额卡片 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition duration-300">
              <p className="text-sm text-cyan-400 mb-2 font-medium">可用 ETH</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                {ethBalance || '0'}
              </p>
              <p className="text-xs text-gray-400 mt-1">ETH</p>
            </div>
          </div>

          {/* WETH 余额卡片 */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition duration-300">
              <p className="text-sm text-purple-400 mb-2 font-medium">可用 WETH</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                {wethBalance || '0'}
              </p>
              <p className="text-xs text-gray-400 mt-1">WETH</p>
            </div>
          </div>
        </div>

        {/* 存款区域 - 未来感面板 */}
        <div className="relative group mb-6">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-6">
              存款到 AAVE
            </h2>

            <div className="space-y-6">
              {/* 金额输入 */}
              <NumberInput
                label="存款金额 (ETH)"
                value={amount}
                onChange={setAmount}
                placeholder="输入 ETH 数量"
                step="0.01"
                min="0"
                size="md"
              />

              {/* APY 显示 */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="text-green-600" size={20} />
                    <span className="text-sm text-green-700 font-semibold">当前 APY (WETH)</span>
                  </div>
                  <span className="text-lg font-bold text-green-600">{wethAPY}%</span>
                </div>
                <p className="text-xs text-green-600 mt-2">实际收益率会根据 AAVE 协议实时变化</p>
              </div>

              {/* 存款按钮 - 科技感 */}
              <button
                type="button"
                onClick={handleDeposit}
                disabled={
                  !account ||
                  isProcessing ||
                  wrapETH.isPending ||
                  approveWETH.isPending ||
                  supplyWETH.isPending
                }
                className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300 group-disabled:opacity-30"></div>
                <div className="relative px-6 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 group-hover:scale-105">
                  {wrapETH.isPending
                    ? '🔄 包装 ETH...'
                    : approveWETH.isPending
                      ? '🔄 授权中...'
                      : supplyWETH.isPending
                        ? '🔄 存入中...'
                        : '⚡ 存入 AAVE'}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* 我的存款 - 未来感面板 */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                我的存款
              </h2>
              <button type="button" onClick={refreshAllBalances} className="relative group/btn">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur opacity-40 group-hover/btn:opacity-60 transition"></div>
                <div className="relative px-4 py-2 text-sm bg-gray-800 text-violet-400 rounded-lg hover:text-violet-300 transition border border-violet-500/30">
                  🔄 刷新数据
                </div>
              </button>
            </div>

            <div className="space-y-6">
              {/* 总存款显示 - 霓虹卡片 */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-30"></div>
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 rounded-2xl p-6 border border-emerald-500/40">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-emerald-400 mb-2 font-medium">总存款</p>
                      <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">
                        {aWETHBalance || '0.0000'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">ETH</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-emerald-500/20">
                      <div className="bg-gray-900/50 rounded-xl p-3 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400 mb-1">当前 APY</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
                          {wethAPY}%
                        </p>
                      </div>
                      <div className="bg-gray-900/50 rounded-xl p-3 border border-purple-500/20">
                        <p className="text-xs text-purple-400 mb-1">预计年收益</p>
                        <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                          {aWETHBalance && parseFloat(wethAPY) > 0
                            ? `${((parseFloat(aWETHBalance) * parseFloat(wethAPY)) / 100).toFixed(6)} ETH`
                            : '0.000000 ETH'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 取款操作 */}
              <div className="bg-gray-900/50 rounded-xl p-5 border border-red-500/20">
                <h3 className="text-lg font-semibold text-red-400 mb-4">💸 取款操作</h3>
                <div className="space-y-3">
                  <NumberInput
                    label="取款金额 (ETH)"
                    value={withdrawAmount}
                    onChange={setWithdrawAmount}
                    placeholder="输入取款金额"
                    step="0.01"
                    min="0"
                    max={aWETHBalance || '0'}
                    size="sm"
                  />

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (aWETHBalance) {
                          setWithdrawAmount(aWETHBalance);
                        }
                      }}
                      disabled={!aWETHBalance || parseFloat(aWETHBalance) === 0}
                      className="px-5 py-3 text-sm bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition border border-gray-700 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                      全部取出
                    </button>

                    <button
                      type="button"
                      onClick={handleWithdraw}
                      disabled={
                        !account ||
                        isProcessing ||
                        withdrawWETH.isPending ||
                        unwrapWETH.isPending ||
                        !withdrawAmount ||
                        !aWETHBalance ||
                        parseFloat(aWETHBalance) === 0
                      }
                      className="relative flex-1 group/withdraw disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-60 group-hover/withdraw:opacity-100 transition group-disabled/withdraw:opacity-30"></div>
                      <div className="relative px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white font-bold shadow-lg hover:shadow-red-500/50 transition-all duration-300 group-hover/withdraw:scale-105">
                        {withdrawWETH.isPending
                          ? '🔄 取款中...'
                          : unwrapWETH.isPending
                            ? '🔄 解包中...'
                            : '💰 确认取款'}
                      </div>
                    </button>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3 border border-cyan-500/20 mt-3">
                    <p className="text-xs text-cyan-400 flex items-start">
                      <span className="mr-2">💡</span>
                      <span>提示：取款后资金将返回到您的钱包地址（需支付 Gas 费用）</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!account && (
          <div className="relative mt-8">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl blur opacity-50"></div>
            <div className="relative bg-gray-900/90 backdrop-blur-xl border border-red-500/50 rounded-xl p-4 text-center">
              <p className="text-red-400 text-sm font-semibold">⚠️ 请先连接钱包</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
