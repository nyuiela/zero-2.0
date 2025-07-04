import { useConfigState } from "../state/config-store";

export const BuyButton = () => {
  const setFiatOnramp = useConfigState.useSetFiatOnramp();

  return (
    <button
      onClick={() => setFiatOnramp(true)}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      title="Buy Crypto"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        />
      </svg>
    </button>
  );
}; 