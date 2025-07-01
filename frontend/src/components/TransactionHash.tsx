export default function TransactionHash({ hash }: { hash?: string }) {
  if (!hash) return null;
  return (
    <div className="text-center">
      <a
        href={`https://sepolia.basescan.org/tx/${hash}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline text-sm"
      >
        Transaction Hash: {hash}
      </a>
    </div>
  );
} 