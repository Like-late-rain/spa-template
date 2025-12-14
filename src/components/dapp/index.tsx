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
    <div style={{ padding: '20px', position: 'relative' }}>
      {!account ? (
        <button
          type="button"
          onClick={handleConnect}
          aria-label="Connect wallet"
          style={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(139, 92, 246, 0.3)';
          }}
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
          style={{
            position: 'relative',
            background: 'rgba(30, 41, 59, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            padding: '6px 12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
          }}
          onClick={() => setShowDetails(!showDetails)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)';
            e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 0.6)';
            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.2)';
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            🐷
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div
              style={{
                color: '#E2E8F0',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'monospace',
              }}
            >
              {formatAddress(account)}
            </div>
            <div
              style={{
                color: '#10B981',
                fontSize: '11px',
                fontWeight: '500',
              }}
            >
              {balance} ETH
            </div>
          </div>

          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#10B981',
              boxShadow: '0 0 6px rgba(16, 185, 129, 0.8)',
              flexShrink: 0,
            }}
          />
        </button>
      )}

      {showDetails && account && (
        <div
          ref={detailsRef}
          style={{
            position: 'absolute',
            top: '78px',
            left: '20px',
            background: 'rgba(17, 24, 39, 0.98)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '16px',
            padding: '16px',
            minWidth: '280px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            zIndex: 1000,
            animation: 'slideDown 0.2s ease',
          }}
        >
          <div
            style={{
              color: '#94A3B8',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              marginBottom: '12px',
              letterSpacing: '0.5px',
            }}
          >
            钱包详情
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ color: '#64748B', fontSize: '11px', marginBottom: '6px' }}>
                完整地址
              </div>
              <div
                style={{
                  color: '#E2E8F0',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  background: 'rgba(51, 65, 85, 0.6)',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  wordBreak: 'break-all',
                }}
              >
                {account}
              </div>
            </div>

            <div>
              <div style={{ color: '#64748B', fontSize: '11px', marginBottom: '6px' }}>余额</div>
              <div
                style={{
                  color: '#10B981',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
              >
                {balance} ETH
              </div>
            </div>

            <div>
              <div
                style={{
                  color: '#64748B',
                  fontSize: '11px',
                  marginBottom: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>网络</span>
                <button
                  type="button"
                  onClick={() => setShowNetworks(!showNetworks)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#8B5CF6',
                    fontSize: '11px',
                    cursor: 'pointer',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  切换
                </button>
              </div>

              {!showNetworks ? (
                <div
                  style={{
                    color: '#E2E8F0',
                    fontSize: '13px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: getNetworkColor(chainId),
                      display: 'inline-block',
                    }}
                  />
                  {getNetworkName(chainId)}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {Object.entries(NETWORKS).map(([id, network]) => {
                    const networkId = Number(id);
                    const isActive = chainId === networkId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => handleSwitchNetwork(networkId)}
                        style={{
                          background: isActive
                            ? 'rgba(139, 92, 246, 0.2)'
                            : 'rgba(51, 65, 85, 0.4)',
                          border: `1px solid ${isActive ? 'rgba(139, 92, 246, 0.5)' : 'transparent'}`,
                          borderRadius: '8px',
                          padding: '8px 10px',
                          cursor: isActive ? 'default' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.background = 'rgba(51, 65, 85, 0.4)';
                          }
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: network.color,
                            display: 'inline-block',
                          }}
                        />
                        <span
                          style={{
                            color: '#E2E8F0',
                            fontSize: '13px',
                            fontWeight: isActive ? '600' : '500',
                          }}
                        >
                          {network.name}
                        </span>
                        {isActive && (
                          <span
                            style={{
                              marginLeft: 'auto',
                              color: '#10B981',
                              fontSize: '11px',
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
