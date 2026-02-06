import { Skeleton } from "@/components/ui/skeleton";

interface NewsCardSkeletonProps {
  variant?: "default" | "featured" | "compact";
}

export const NewsCardSkeleton = ({
  variant = "default",
}: NewsCardSkeletonProps) => {
  if (variant === "featured") {
    return <Skeleton className="h-[500px] w-full rounded-lg" />;
  }

  if (variant === "compact") {
    return (
      <div className="flex gap-4 py-4">
        <Skeleton className="h-20 w-28 flex-shrink-0 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
};
