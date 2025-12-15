import type { ClassValue } from 'clsx';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatEther(value: bigint, decimals = 4): string {
  const eth = Number(value) / 1e18;
  return eth.toFixed(decimals);
}

export function parseEther(value: string): bigint {
  return BigInt(Math.floor(parseFloat(value) * 1e18));
}
