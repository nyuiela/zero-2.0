import { useModal } from "../hooks/use-modal";

export const ActivityButton = () => {
  const activityModal = useModal("Activity");

  return (
    <button
      onClick={() => activityModal.open()}
      className="p-2 rounded-lg hover:bg-muted transition-colors"
      title="Activity"
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
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </button>
  );
}; 