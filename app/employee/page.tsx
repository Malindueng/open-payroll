/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { useLiveCounter } from "@/hooks/useLiveCounter";
import { formatOPN, formatDate, shortAddress } from "@/lib/utils";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function EmployeePage() {
  const { address, isConnected } = useAccount();
  const [employerAddr, setEmployerAddr] = useState("");
  const [lookedUpAddr, setLookedUpAddr] = useState("");

  // Look up stream data for this employee from a given employer
  const { data: employeeData, refetch } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "getEmployee",
    args:
      address && lookedUpAddr
        ? [lookedUpAddr as `0x${string}`, address]
        : undefined,
    query: { enabled: !!address && !!lookedUpAddr },
  });

  const emp = employeeData as any;

  // Live counter
  const liveEarned = useLiveCounter(
    emp?.salaryPerSec ?? BigInt(0),
    emp?.lastClaimed ?? BigInt(0),
    emp?.active ?? false
  );

  // Claim salary
  const { writeContract: claim, data: claimTx, isPending: claimPending } =
    useWriteContract();

  const { isLoading: claimConfirming } = useWaitForTransactionReceipt({
    hash: claimTx,
    onReplaced: () => {
      refetch();
    },
  });

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
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-400">Connect your wallet to view your salary stream</p>
          <ConnectButton />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">My Salary Stream</h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter your employer&apos;s address to view and claim your salary
        </p>

        {/* Employer lookup */}
        <Card className="mb-6">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                label="Employer wallet address"
                placeholder="0x..."
                value={employerAddr}
                onChange={setEmployerAddr}
              />
            </div>
            <Button
              onClick={() => setLookedUpAddr(employerAddr)}
              disabled={!employerAddr}
            >
              Look up
            </Button>
          </div>
        </Card>

        {/* Stream data */}
        {lookedUpAddr && emp?.exists && (
          <>
            <Card className="mb-4">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Employer</div>
                  <div className="font-mono text-sm text-white">
                    {shortAddress(lookedUpAddr)}
                  </div>
                </div>
                <StatusBadge active={emp.active} />
              </div>

              {/* Big live counter */}
              <div className="bg-gray-800/60 rounded-xl p-6 text-center mb-6">
                <div className="text-xs text-gray-500 mb-2 uppercase tracking-widest">
                  Claimable right now
                </div>
                <div className="text-5xl font-mono font-bold text-emerald-400 mb-1">
                  {liveEarned}
                </div>
                <div className="text-gray-400 text-sm">OPN</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Daily rate</div>
                  <div className="text-white font-medium">
                    {formatOPN(emp.salaryPerSec * BigInt(86400))} OPN
                  </div>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Total claimed</div>
                  <div className="text-white font-medium">
                    {formatOPN(emp.totalClaimed)} OPN
                  </div>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Stream started</div>
                  <div className="text-white font-medium">
                    {formatDate(emp.startTime)}
                  </div>
                </div>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="text-gray-500 text-xs mb-1">Per second</div>
                  <div className="text-white font-medium font-mono text-xs">
                    {emp.salaryPerSec.toString()} wei
                  </div>
                </div>
              </div>

              <Button
                className="w-full py-3"
                onClick={handleClaim}
                disabled={
                  !emp.active ||
                  claimPending ||
                  claimConfirming
                }
              >
                {claimPending || claimConfirming
                  ? "Claiming..."
                  : emp.active
                  ? "Claim Salary"
                  : "Stream is paused"}
              </Button>
            </Card>
          </>
        )}

        {lookedUpAddr && emp && !emp.exists && (
          <Card className="text-center text-gray-500 py-12">
            No stream found for your wallet from this employer.
          </Card>
        )}
      </main>
    </>
  );
}