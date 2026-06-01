export function Card({
  children,
  className = "",
  glow = false,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div className={`${glow ? "card-glow" : "card-base"} ${className}`}>
      {children}
    </div>
  );
}