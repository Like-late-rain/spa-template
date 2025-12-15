import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  accountAtom,
  autoConnectWalletAtom,
  balanceAtom,
  chainIdAtom,
  connectWalletAtom,
  refreshWalletAtom,
  switchNetworkAtom,
} from '@/stores/web3Atoms';

// 支持的网络列表
const NETWORKS = {
  1: { name: 'Ethereum', color: '#627EEA' },
  11155111: { name: 'Sepolia', color: '#7B3FE4' },
  137: { name: 'Polygon', color: '#8247E5' },
  56: { name: 'BSC', color: '#F3BA2F' },
} as const;

const Index = () => {
  // 获取账户地址、余额和网络
  const account = useAtomValue(accountAtom);
  const balance = useAtomValue(balanceAtom);
  const chainId = useAtomValue(chainIdAtom);
  const connectWallet = useSetAtom(connectWalletAtom);
  const autoConnect = useSetAtom(autoConnectWalletAtom);
  const switchNetwork = useSetAtom(switchNetworkAtom);
  const refreshWallet = useSetAtom(refreshWalletAtom);
  const [showDetails, setShowDetails] = useState(false);
  const [showNetworks, setShowNetworks] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 获取当前网络名称
  const getNetworkName = (chainId: number | null) => {
    if (!chainId) return 'Unknown';
    return NETWORKS[chainId as keyof typeof NETWORKS]?.name || `Chain ${chainId}`;
  };

  // 获取当前网络颜色
  const getNetworkColor = (chainId: number | null) => {
    if (!chainId) return '#6B7280';
    return NETWORKS[chainId as keyof typeof NETWORKS]?.color || '#6B7280';
  };

  // 切换网络
  const handleSwitchNetwork = async (targetChainId: number) => {
    try {
      await switchNetwork(targetChainId);
      setShowNetworks(false);
    } catch (error) {
      console.error('切换网络失败:', error);
    }
  };

  // 手动连接钱包（会弹出授权窗口）
  const handleConnect = useCallback(async () => {
    try {
      await connectWallet();
      console.log('钱包连接成功');
    } catch (error) {
      console.error('连接失败:', error);
    }
  }, [connectWallet]);

  // 页面加载时尝试自动重连（不会弹窗）
  useEffect(() => {
    autoConnect();
  }, [autoConnect]);

  // 点击外部区域关闭详情
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showDetails &&
        detailsRef.current &&
        buttonRef.current &&
        !detailsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDetails(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDetails]);

  // 监听网络变化
  useEffect(() => {
    if (!account) return;

    const ethereum = (
      window as {
        ethereum?: {
          on?: (event: string, handler: (...args: unknown[]) => void) => void;
          removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
        };
      }
    ).ethereum;

    if (!ethereum?.on) return;

    const handleChainChanged = () => {
      // 网络变化时刷新钱包信息
      refreshWallet();
    };

    ethereum.on('chainChanged', handleChainChanged);

    return () => {
      ethereum.removeListener?.('chainChanged', handleChainChanged);
    };
  }, [account, refreshWallet]);

  // 格式化地址：0x1234...5678
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="p-5 relative">
      {!account ? (
        <button
          type="button"
          onClick={handleConnect}
          aria-label="Connect wallet"
          className="bg-gradient-to-br from-purple-600 to-pink-500 text-white border-none rounded-xl px-6 py-2.5 text-sm font-semibold cursor-pointer shadow-[0_2px_8px_rgba(139,92,246,0.3)] transition-all duration-200 inline-flex items-center gap-2 uppercase tracking-wide hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(139,92,246,0.4)]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-label="User icon">
            <title>User icon</title>
            <path
              d="M17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M3 21C3.95728 17.9237 6.41998 17 12 17C17.58 17 20.0427 17.9237 21 21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Connect Wallet
        </button>
      ) : (
        <button
          ref={buttonRef}
          type="button"
          className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-400/20 rounded-xl px-3 py-1.5 cursor-pointer transition-all duration-200 inline-flex items-center gap-2.5 hover:bg-slate-800/80 hover:border-purple-500/40"
          onClick={() => setShowDetails(!showDetails)}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-lg flex-shrink-0">
            🐷
          </div>

          <div className="flex flex-col items-start">
            <div className="text-slate-200 text-[13px] font-semibold font-mono">
              {formatAddress(account)}
            </div>
            <div className="text-green-500 text-[11px] font-medium">{balance} ETH</div>
          </div>

          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] flex-shrink-0" />
        </button>
      )}

      {showDetails && account && (
        <div
          ref={detailsRef}
          className="absolute top-[78px] left-5 bg-dark-card backdrop-blur-3xl border border-purple-500/30 rounded-2xl p-4 min-w-[280px] shadow-[0_8px_24px_rgba(0,0,0,0.4)] z-[1000] animate-slide-down"
        >
          <div className="text-slate-400 text-[11px] font-semibold uppercase mb-3 tracking-wide">
            钱包详情
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <div className="text-slate-500 text-[11px] mb-1.5">完整地址</div>
              <div className="text-slate-200 text-xs font-mono bg-slate-700/60 px-2.5 py-2 rounded-lg break-all">
                {account}
              </div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px] mb-1.5">余额</div>
              <div className="text-green-500 text-lg font-bold">{balance} ETH</div>
            </div>

            <div>
              <div className="text-slate-500 text-[11px] mb-1.5 flex justify-between items-center">
                <span>网络</span>
                <button
                  type="button"
                  onClick={() => setShowNetworks(!showNetworks)}
                  className="bg-transparent border-none text-purple-500 text-[11px] cursor-pointer px-1.5 py-0.5 rounded transition-colors hover:bg-purple-500/10"
                >
                  切换
                </button>
              </div>

              {!showNetworks ? (
                <div className="text-slate-200 text-[13px] font-medium flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: getNetworkColor(chainId) }}
                  />
                  {getNetworkName(chainId)}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {Object.entries(NETWORKS).map(([id, network]) => {
                    const networkId = Number(id);
                    const isActive = chainId === networkId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleSwitchNetwork(networkId)}
                        className={`rounded-lg px-2.5 py-2 flex items-center gap-2 transition-all duration-200 ${
                          isActive
                            ? 'bg-purple-500/20 border border-purple-500/50 cursor-default'
                            : 'bg-slate-700/40 border border-transparent cursor-pointer hover:bg-slate-700/60'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ background: network.color }}
                        />
                        <span
                          className={`text-slate-200 text-[13px] ${isActive ? 'font-semibold' : 'font-medium'}`}
                        >
                          {network.name}
                        </span>
                        {isActive && <span className="ml-auto text-green-500 text-[11px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
