import { formatEther } from "viem";

/**
 * Format wei to a readable OPN string
 * e.g. 1000000000000000000n → "1.0000"
 */
export function formatOPN(wei: bigint, decimals = 4): string {
  return parseFloat(formatEther(wei)).toFixed(decimals);
}

/**
 * Convert a daily OPN salary to salaryPerSec in wei
 * e.g. "1.5" OPN/day → BigInt salaryPerSec
 */
export function dailyToPerSec(dailyOPN: string): bigint {
  const daily = parseFloat(dailyOPN);
  if (isNaN(daily) || daily <= 0) return BigInt(0);
  const perSecEther = daily / 86400;
  // Convert to wei (18 decimals)
  return BigInt(Math.floor(perSecEther * 1e18));
}

/**
 * Shorten a wallet address for display
 * e.g. 0x1234...5678
 */
export function shortAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Format a Unix timestamp to a readable date
 */
export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}