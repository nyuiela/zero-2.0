import { ChainDto } from "../types";

interface NetworkIconProps {
  chain: ChainDto | null;
  width?: number;
  height?: number;
  className?: string;
}

export const NetworkIcon: React.FC<NetworkIconProps> = ({
  chain,
  width = 32,
  height = 32,
  className,
}) => {
  if (!chain) {
    return (
      <div
        className={`bg-muted rounded-full ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div
      className={`bg-muted rounded-full flex items-center justify-center text-xs font-semibold ${className}`}
      style={{ width, height }}
    >
      {chain.name.charAt(0)}
    </div>
  );
}; 