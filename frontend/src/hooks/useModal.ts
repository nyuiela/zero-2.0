import { useState } from "react";
// TODO: Implement modal state and logic
export function useModal(key: string) {
  // TODO: Replace with actual modal state and logic
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
  };
} 