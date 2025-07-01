export default function TransactionError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-hidden text-ellipsis text-wrap">
      <h4 className="text-red-800 font-semibold text-sm mb-2">Transaction Error:</h4>
      <p className="text-red-700 text-sm">{error}</p>
    </div>
  );
} 