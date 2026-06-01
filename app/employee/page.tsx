/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { formatOPN, formatDate, shortAddress } from "@/lib/utils";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function EmployeePage() {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [employerAddr, setEmployerAddr] = useState("");
  const [lookedUpAddr, setLookedUpAddr] = useState("");

  const { data: employeeData, refetch } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "getEmployee",
    args:
      address && lookedUpAddr
        ? [lookedUpAddr as `0x${string}`, address]
        : undefined,
    query: {
      enabled: !!address && !!lookedUpAddr,
      // Poll every 5 seconds so employee page stays fresh automatically
      refetchInterval: 5000,
    },
  });

  const emp = employeeData as any;

  const liveEarned = useLiveCounter(
    emp?.salaryPerSec ?? BigInt(0),
    emp?.lastClaimed ?? BigInt(0),
    emp?.active ?? false,
    emp?.pendingAmount ?? BigInt(0),
  );

  const {
    writeContract: claim,
    data: claimTx,
    isPending: claimPending,
    reset,
  } = useWriteContract();

  const { isLoading: claimConfirming, isSuccess: claimSuccess } =
    useWaitForTransactionReceipt({ hash: claimTx });

  useEffect(() => {
    if (claimSuccess) {
      queryClient.invalidateQueries();
      refetch();
      reset();
    }
  }, [claimSuccess, queryClient, refetch, reset]);

  const handleClaim = () => {
    claim({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "claimSalary",
      args: [lookedUpAddr as `0x${string}`],
    });
  };

  if (!isConnected) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#0a0e1a" }}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "calc(100vh - 60px)",
            gap: "1rem",
          }}
        >
          <div style={{ fontSize: "2rem" }}>💸</div>
          <p style={{ color: "#475569", fontSize: "0.9rem" }}>
            Connect your wallet to view your salary stream
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e1a" }}>
      <Navbar />
      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "1.5rem" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#f1f5f9",
              marginBottom: "0.25rem",
              letterSpacing: "-0.01em",
            }}
          >
            My Salary Stream
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#475569" }}>
            Enter your employer&apos;s address to view and claim your salary
          </p>
        </div>

        {/* Lookup */}
        <div style={{ marginBottom: "1rem" }}>
          <Card>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Employer wallet address"
                  placeholder="0x..."
                  value={employerAddr}
                  onChange={setEmployerAddr}
                />
              </div>
              <button
                className="btn-primary"
                onClick={() => setLookedUpAddr(employerAddr)}
                disabled={!employerAddr}
              >
                Look up
              </button>
            </div>
          </Card>
        </div>

        {/* Stream data */}
        {lookedUpAddr && emp?.exists && (
          <Card glow>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#475569",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: "0.25rem",
                  }}
                >
                  Employer
                </div>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    color: "#f1f5f9",
                  }}
                >
                  {shortAddress(lookedUpAddr)}
                </div>
              </div>
              <StatusBadge active={emp.active} />
            </div>

            {/* Live counter */}
            <div
              style={{
                backgroundColor: "rgba(6, 182, 212, 0.05)",
                border: "1px solid rgba(6, 182, 212, 0.15)",
                borderRadius: "0.75rem",
                padding: "1.5rem",
                textAlign: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.65rem",
                  color: "#475569",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "0.5rem",
                }}
              >
                Claimable right now
              </div>
              <div
                className="counter-glow"
                style={{
                  fontSize: "clamp(2rem, 8vw, 3rem)",
                  fontFamily: "monospace",
                  fontWeight: 700,
                  color: emp.active ? "#06b6d4" : "#475569",
                  letterSpacing: "-0.02em",
                }}
              >
                {liveEarned}
              </div>
              <div style={{ fontSize: "0.875rem", color: "#475569", marginTop: "0.25rem" }}>
                OPN {!emp.active && "· paused"}
              </div>
            </div>

            {/* Stats */}
            <div className="grid-2" style={{ marginBottom: "1.25rem" }}>
              {[
                {
                  label: "Daily rate",
                  value: `${formatOPN(emp.salaryPerSec * BigInt(86400))} OPN`,
                },
                {
                  label: "Total claimed",
                  value: `${formatOPN(emp.totalClaimed)} OPN`,
                },
                {
                  label: "Stream started",
                  value: formatDate(emp.startTime),
                },
                {
                  label: "Per second",
                  value: `${emp.salaryPerSec.toString()} wei`,
                  mono: true,
                },
              ].map((s) => (
                <div
                  key={s.label}
                  style={{
                    backgroundColor: "#0d1424",
                    border: "1px solid #1e2d3d",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "#475569",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: s.mono ? "0.7rem" : "0.875rem",
                      fontWeight: 500,
                      color: "#f1f5f9",
                      fontFamily: s.mono ? "monospace" : "inherit",
                      wordBreak: "break-all",
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "0.75rem" }}
              onClick={handleClaim}
              disabled={claimPending || claimConfirming}
            >
              {claimPending || claimConfirming ? "Claiming..." : "Claim Salary"}
            </button>
          </Card>
        )}

        {lookedUpAddr && emp && !emp.exists && (
          <Card>
            <div
              style={{
                textAlign: "center",
                color: "#334155",
                padding: "2rem 0",
                fontSize: "0.875rem",
              }}
            >
              No stream found for your wallet from this employer.
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}