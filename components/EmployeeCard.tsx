"use client";

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { shortAddress, formatOPN, formatDate } from "@/lib/utils";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface EmployeeData {
  wallet: string;
  salaryPerSec: bigint;
  startTime: bigint;
  lastClaimed: bigint;
  totalClaimed: bigint;
  active: boolean;
  exists: boolean;
}

export function EmployeeCard({
  employee,
  onAction,
}: {
  employee: EmployeeData;
  onAction: () => void;
}) {
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    onReplaced: onAction,
  });

  const liveEarned = useLiveCounter(
    employee.salaryPerSec,
    employee.lastClaimed,
    employee.active
  );

  const dailyOPN =
    parseFloat(
      formatOPN(employee.salaryPerSec * BigInt(86400), 4)
    ).toFixed(4);

  const busy = isPending || isConfirming;

  const pause = () =>
    writeContract({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "pauseStream",
      args: [employee.wallet as `0x${string}`],
    });

  const resume = () =>
    writeContract({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "resumeStream",
      args: [employee.wallet as `0x${string}`],
    });

  const terminate = () => {
    if (!confirm(`Terminate stream for ${shortAddress(employee.wallet)}? This cannot be undone.`))
      return;
    writeContract({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "terminateStream",
      args: [employee.wallet as `0x${string}`],
    });
  };

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-mono text-sm text-white mb-1">
            {shortAddress(employee.wallet)}
          </div>
          <div className="text-xs text-gray-500">
            Since {formatDate(employee.startTime)}
          </div>
        </div>
        <StatusBadge active={employee.active} />
      </div>

      {/* Live counter */}
      <div className="bg-gray-800/60 rounded-lg p-4 mb-4">
        <div className="text-xs text-gray-500 mb-1">Claimable now</div>
        <div className="text-2xl font-mono font-semibold text-emerald-400">
          {liveEarned} OPN
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {dailyOPN} OPN / day
        </div>
      </div>

      <div className="text-xs text-gray-600 mb-4">
        Total claimed: {formatOPN(employee.totalClaimed)} OPN
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-wrap">
        {employee.active ? (
          <Button variant="ghost" onClick={pause} disabled={busy}>
            {busy ? "..." : "⏸ Pause"}
          </Button>
        ) : (
          <Button variant="success" onClick={resume} disabled={busy}>
            {busy ? "..." : "▶ Resume"}
          </Button>
        )}
        <Button variant="danger" onClick={terminate} disabled={busy}>
          {busy ? "..." : "✕ Terminate"}
        </Button>
      </div>
    </Card>
  );
}