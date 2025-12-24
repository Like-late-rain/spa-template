// 用户信息接口
export interface User {
  id: string;
  walletAddress: string | null;
  signature: string | null;
  timestamp: number | null;
  username: string;
  email: string | null;
  avatarUrl: string | null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}
