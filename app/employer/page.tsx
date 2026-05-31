/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmployeeCard } from "@/components/EmployeeCard";
import { OPEN_PAYROLL_ABI } from "@/lib/abi";
import { formatOPN, dailyToPerSec } from "@/lib/utils";

const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export default function EmployerPage() {
  const { address, isConnected } = useAccount();

  // Form state
  const [employeeAddr, setEmployeeAddr] = useState("");
  const [dailySalary, setDailySalary] = useState("");
  const [depositAmount, setDepositAmount] = useState("");

  // Read employer balance
  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "employerBalance",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Read employee list
  const { data: employeeAddresses, refetch: refetchEmployees } = useReadContract({
    address: CONTRACT,
    abi: OPEN_PAYROLL_ABI,
    functionName: "getEmployees",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Write: deposit funds
  const {
    writeContract: deposit,
    data: depositTx,
    isPending: depositPending,
  } = useWriteContract();

  const { isLoading: depositConfirming } = useWaitForTransactionReceipt({
    hash: depositTx,
    onReplaced: () => { refetchBalance(); setDepositAmount(""); },
  });

  // Write: add employee
  const {
    writeContract: addEmployee,
    data: addTx,
    isPending: addPending,
  } = useWriteContract();

  const { isLoading: addConfirming } = useWaitForTransactionReceipt({
    hash: addTx,
    onReplaced: () => { refetchEmployees(); setEmployeeAddr(""); setDailySalary(""); },
  });

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
      args: [
        employeeAddr as `0x${string}`,
        dailyToPerSec(dailySalary),
      ],
    });
  };

  const refetchAll = () => {
    refetchBalance();
    refetchEmployees();
  };

  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-gray-400">Connect your wallet to manage payroll</p>
          <ConnectButton />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-2">Employer Dashboard</h1>
        <p className="text-gray-500 text-sm mb-8">
          Manage your payroll streams on OPN Chain
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

          {/* Balance card */}
          <Card>
            <div className="text-xs text-gray-500 mb-1">Contract Balance</div>
            <div className="text-3xl font-mono font-bold text-white mb-4">
              {balance !== undefined ? formatOPN(balance as bigint) : "—"} OPN
            </div>
            <Input
              label="Deposit amount (OPN)"
              placeholder="e.g. 100"
              value={depositAmount}
              onChange={setDepositAmount}
              type="number"
            />
            <Button
              className="w-full mt-3"
              onClick={handleDeposit}
              disabled={depositPending || depositConfirming || !depositAmount}
            >
              {depositPending || depositConfirming ? "Depositing..." : "Deposit Funds"}
            </Button>
          </Card>

          {/* Add employee card */}
          <Card className="lg:col-span-2">
            <div className="text-sm font-medium text-white mb-4">Add Employee</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Employee wallet address"
                placeholder="0x..."
                value={employeeAddr}
                onChange={setEmployeeAddr}
                hint="Must be a valid 0x address"
              />
              <Input
                label="Daily salary (OPN)"
                placeholder="e.g. 10"
                value={dailySalary}
                onChange={setDailySalary}
                type="number"
                hint="Streams per second on-chain"
              />
            </div>
            <Button
              onClick={handleAddEmployee}
              disabled={addPending || addConfirming || !employeeAddr || !dailySalary}
            >
              {addPending || addConfirming ? "Adding..." : "+ Add Employee"}
            </Button>
          </Card>
        </div>

        {/* Employee list */}
        <h2 className="text-lg font-semibold text-white mb-4">
          Team ({employeeAddresses?.length ?? 0})
        </h2>

        {!employeeAddresses || employeeAddresses.length === 0 ? (
          <Card className="text-center text-gray-500 py-12">
            No employees yet. Add one above to start streaming salary.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(employeeAddresses as string[]).map((addr) => (
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
    </>
  );
}

// Wrapper to fetch individual employee data
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
  });

  if (!data || !(data as any).exists) return null;

  return <EmployeeCard employee={data as any} onAction={onAction} />;
}