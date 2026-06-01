export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span className={active ? "badge-active" : "badge-paused"}>
      <span className={active ? "dot-pulse" : "dot-idle"} />
      {active ? "Active" : "Paused"}
    </span>
  );
}