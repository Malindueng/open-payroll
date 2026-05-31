export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
        active
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
          : "bg-gray-700/50 text-gray-400 border border-gray-700"
      }`}
    >
      {active ? "● Active" : "● Paused"}
    </span>
  );
}