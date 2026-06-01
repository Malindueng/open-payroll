import { useState, useEffect } from "react";
import { formatOPN } from "@/lib/utils";

export function useLiveCounter(
  salaryPerSec: bigint,
  lastClaimed: bigint,
  active: boolean,
  pendingAmount: bigint = BigInt(0),
): string {
  const [display, setDisplay] = useState("0.000000");

  useEffect(() => {
    if (!active) {
      // Show the snapshotted pending amount when paused — not zero
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(formatOPN(pendingAmount, 6));
      return;
    }

    const tick = () => {
      const nowSec = BigInt(Math.floor(Date.now() / 1000));
      const elapsed = nowSec > lastClaimed ? nowSec - lastClaimed : BigInt(0);
      const earned = salaryPerSec * elapsed + pendingAmount;
      setDisplay(formatOPN(earned, 6));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [salaryPerSec, lastClaimed, active, pendingAmount]);

  return display;
}