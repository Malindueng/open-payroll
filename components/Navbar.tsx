"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-semibold text-white">
            💸 Open Payroll
          </Link>
          <div className="flex gap-6 text-sm text-gray-400">
            <Link href="/employer" className="hover:text-white transition-colors">
              Employer
            </Link>
            <Link href="/employee" className="hover:text-white transition-colors">
              Employee
            </Link>
          </div>
        </div>
        <ConnectButton />
      </div>
    </nav>
  );
}