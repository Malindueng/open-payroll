export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  hint,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition-colors"
      />
      {hint && <span className="text-xs text-gray-600">{hint}</span>}
    </div>
  );
}