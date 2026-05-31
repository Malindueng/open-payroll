import { useState, useEffect } from "react";
import { formatOPN } from "@/lib/utils";

/**
 * Given a salaryPerSec (in wei as bigint) and the lastClaimed timestamp,
 * returns a live-updating string of the current claimable amount.
 */
export function useLiveCounter(
  salaryPerSec: bigint,
  lastClaimed: bigint,
  active: boolean
): string {
  const [display, setDisplay] = useState("0.0000");

  useEffect(() => {
    if (!active || salaryPerSec === BigInt(0)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay("0.0000");
      return;
    }

    const tick = () => {
      const nowSec = BigInt(Math.floor(Date.now() / 1000));
      const elapsed = nowSec - lastClaimed;
      if (elapsed < BigInt(0)) return;
      const earned = salaryPerSec * elapsed;
      setDisplay(formatOPN(earned, 6));
    };

    tick(); // run immediately
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [salaryPerSec, lastClaimed, active]);

  return display;
}