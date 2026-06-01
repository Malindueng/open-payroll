/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { EmployeeCard } from "@/components/EmployeeCard";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { formatOPN, dailyToPerSec } from "@/lib/utils";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function EmployerPage() {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();

  const [employeeAddr, setEmployeeAddr] = useState("");
  const [dailySalary, setDailySalary] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "employerBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 5000 },
  });

  const { data: employeeAddresses, refetch: refetchEmployees } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "getEmployees",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const refetchAll = async () => {
    await queryClient.invalidateQueries();
    await refetchBalance();
    await refetchEmployees();
  };

  // ── Deposit ──
  const {
    writeContract: deposit,
    data: depositTx,
    isPending: depositPending,
  } = useWriteContract();

  const { isLoading: depositConfirming, isSuccess: depositSuccess } =
    useWaitForTransactionReceipt({ hash: depositTx });

  // Watch deposit success
useEffect(() => {
  if (depositSuccess) {
    refetchAll();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDepositAmount("");
  }
}, [depositSuccess]);

  // ── Add employee ──
  const {
    writeContract: addEmployee,
    data: addTx,
    isPending: addPending,
  } = useWriteContract();

  const { isLoading: addConfirming, isSuccess: addSuccess } =
    useWaitForTransactionReceipt({ hash: addTx });

  useEffect(() => {
  if (addSuccess) {
    refetchAll();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmployeeAddr("");
    setDailySalary("");
  }
}, [addSuccess]);

  const handleDeposit = () => {
    if (!depositAmount) return;
    deposit({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "depositFunds",
      value: parseEther(depositAmount),
    });
  };

  const handleAddEmployee = () => {
    if (!employeeAddr || !dailySalary) return;
    addEmployee({
      address: CONTRACT,
      abi: OPEN_PAYROLL_ABI,
      functionName: "addEmployee",
      args: [employeeAddr as `0x${string}`, dailyToPerSec(dailySalary)],
    });
  };

  const uniqueAddresses = [...new Set((employeeAddresses as string[]) ?? [])];

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
            Connect your wallet to manage payroll
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e1a" }}>
      <Navbar />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "1.5rem" }}>
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
            Employer Dashboard
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#475569" }}>
            Manage your payroll streams on OPN Chain
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {/* Balance card */}
          <Card>
            <div
              style={{
                fontSize: "0.7rem",
                color: "#475569",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "0.25rem",
              }}
            >
              Contract Balance
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                fontFamily: "monospace",
                color: "#f1f5f9",
                marginBottom: "1rem",
              }}
            >
              {balance !== undefined ? formatOPN(balance as bigint) : "—"}{" "}
              <span style={{ fontSize: "1rem", color: "#475569" }}>OPN</span>
            </div>
            <Input
              label="Deposit amount (OPN)"
              placeholder="e.g. 100"
              value={depositAmount}
              onChange={setDepositAmount}
              type="number"
            />
            <button
              className="btn-primary"
              style={{ width: "100%", marginTop: "0.75rem" }}
              onClick={handleDeposit}
              disabled={depositPending || depositConfirming || !depositAmount}
            >
              {depositPending || depositConfirming ? "Depositing..." : "Deposit Funds"}
            </button>
          </Card>

          {/* Add employee */}
          <Card>
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#f1f5f9",
                marginBottom: "1rem",
              }}
            >
              Add Employee
            </div>
            <div className="grid-2" style={{ marginBottom: "1rem" }}>
              <Input
                label="Employee wallet address"
                placeholder="0x..."
                value={employeeAddr}
                onChange={setEmployeeAddr}
              />
              <Input
                label="Daily salary (OPN)"
                placeholder="e.g. 10"
                value={dailySalary}
                onChange={setDailySalary}
                type="number"
              />
            </div>
            <button
              className="btn-primary"
              onClick={handleAddEmployee}
              disabled={addPending || addConfirming || !employeeAddr || !dailySalary}
            >
              {addPending || addConfirming ? "Adding..." : "+ Add Employee"}
            </button>
          </Card>
        </div>

        {/* Team */}
        <div style={{ marginBottom: "0.75rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#f1f5f9" }}>
            Team
          </h2>
        </div>

        {uniqueAddresses.length === 0 ? (
          <Card>
            <div
              style={{
                textAlign: "center",
                color: "#334155",
                padding: "2rem 0",
                fontSize: "0.875rem",
              }}
            >
              No employees yet. Add one above to start streaming salary.
            </div>
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1rem",
            }}
          >
            {uniqueAddresses.map((addr) => (
              <EmployeeCardWrapper
                key={addr}
                employerAddress={address!}
                employeeAddress={addr}
                onAction={refetchAll}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmployeeCardWrapper({
  employerAddress,
  employeeAddress,
  onAction,
}: {
  employerAddress: string;
  employeeAddress: string;
  onAction: () => void;
}) {
  const { data } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "getEmployee",
    args: [
      employerAddress as `0x${string}`,
      employeeAddress as `0x${string}`,
    ],
    query: {
      // Poll every 5 seconds — catches claims and changes from employee side
      refetchInterval: 5000,
    },
  });

  if (!data || !(data as any).exists) return null;

  return <EmployeeCard employee={data as any} onAction={onAction} />;
}