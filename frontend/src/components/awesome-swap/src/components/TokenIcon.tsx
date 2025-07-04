interface TokenIconProps {
  token: any;
  className?: string;
}

export const TokenIcon: React.FC<TokenIconProps> = ({ token, className }) => {
  return (
    <div
      className={`bg-muted rounded-full flex items-center justify-center text-xs font-semibold ${className}`}
    >
      {token?.symbol?.charAt(0) || "T"}
    </div>
  );
}; 