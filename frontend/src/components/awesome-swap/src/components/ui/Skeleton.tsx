import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  );
}; 