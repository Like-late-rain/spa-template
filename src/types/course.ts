export interface Course {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  priceYCT: bigint;
  instructor: string;
  isActive: boolean;
  createdAt: number;
  totalStudents: number;
}

export interface UserProfile {
  address: string;
  ensName?: string;
  nickname?: string;
  ethBalance: bigint;
  yctBalance: bigint;
  usdtBalance: bigint;
}

export interface AAVEPosition {
  ethDeposited: bigint;
  yctDeposited: bigint;
  totalEarned: bigint;
}
