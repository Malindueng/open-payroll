"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { shortAddress, formatOPN, formatDate } from "@/lib/utils";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

interface EmployeeData {
  wallet: string;
  salaryPerSec: bigint;
  startTime: bigint;
  lastClaimed: bigint;
  pendingAmount: bigint;
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
  const queryClient = useQueryClient();

  const {
    writeContract,
    data: txHash,
    isPending,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash: txHash });

  // When any transaction confirms — invalidate all reads and trigger parent refetch
  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries();
      onAction();
      reset();
    }
  }, [isSuccess, onAction, queryClient, reset]);

  const liveEarned = useLiveCounter(
    employee.salaryPerSec,
    employee.lastClaimed,
    employee.active,
    employee.pendingAmount ?? BigInt(0),
  );

  const dailyOPN = parseFloat(
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
    if (
      !confirm(
        `Terminate stream for ${shortAddress(employee.wallet)}? This cannot be undone.`
      )
    )
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "1rem",
          gap: "0.5rem",
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "#f1f5f9",
              marginBottom: "0.25rem",
            }}
          >
            {shortAddress(employee.wallet)}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#334155" }}>
            Since {formatDate(employee.startTime)}
          </div>
        </div>
        <StatusBadge active={employee.active} />
      </div>

      <div
        style={{
          backgroundColor: "rgba(6, 182, 212, 0.05)",
          border: "1px solid rgba(6, 182, 212, 0.12)",
          borderRadius: "0.625rem",
          padding: "0.875rem",
          marginBottom: "0.875rem",
        }}
      >
        <div
          style={{
            fontSize: "0.65rem",
            color: "#475569",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: "0.375rem",
          }}
        >
          Claimable now
        </div>
        <div
          className="counter-glow"
          style={{
            fontFamily: "monospace",
            fontSize: "1.5rem",
            fontWeight: 700,
            color: employee.active ? "#06b6d4" : "#475569",
            letterSpacing: "-0.01em",
          }}
        >
          {liveEarned} OPN
        </div>
        <div style={{ fontSize: "0.7rem", color: "#334155", marginTop: "0.25rem" }}>
          {employee.active ? `${dailyOPN} OPN / day` : "Stream paused"}
        </div>
      </div>

      <div style={{ fontSize: "0.75rem", color: "#334155", marginBottom: "0.875rem" }}>
        Total claimed:{" "}
        <span style={{ color: "#475569" }}>
          {formatOPN(employee.totalClaimed)} OPN
        </span>
      </div>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {employee.active ? (
          <button
            className="btn-ghost"
            onClick={pause}
            disabled={busy}
            style={{ flex: 1, minWidth: "80px" }}
          >
            {busy ? "..." : "⏸ Pause"}
          </button>
        ) : (
          <button
            className="btn-success"
            onClick={resume}
            disabled={busy}
            style={{ flex: 1, minWidth: "80px" }}
          >
            {busy ? "..." : "▶ Resume"}
          </button>
        )}
        <button
          className="btn-danger"
          onClick={terminate}
          disabled={busy}
          style={{ flex: 1, minWidth: "80px" }}
        >
          {busy ? "..." : "✕ Terminate"}
        </button>
      </div>
    </Card>
  );
}