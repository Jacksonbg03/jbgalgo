export function Stat({ title, value, color }) {
  return (
    <div className="stat text-center">
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${color}`}>{value}</div>
    </div>
  );
}