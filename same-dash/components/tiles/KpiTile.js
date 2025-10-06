export default function KpiTile({ label, value, hint }){
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {hint && <div className="text-xs text-neutral-400 mt-1">{hint}</div>}
    </div>
  );
}