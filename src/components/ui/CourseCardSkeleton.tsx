import { Skeleton } from "./skeleton";

export const CourseCardSkeleton = () => {
  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-40 w-full rounded-none" variant="shimmer" />
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-3/4" variant="shimmer" />
        
        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-full" variant="shimmer" />
          <Skeleton className="h-3 w-2/3" variant="shimmer" />
        </div>
        
        {/* Stats row */}
        <div className="flex items-center gap-4 pt-2">
          <Skeleton className="h-4 w-16" variant="shimmer" />
          <Skeleton className="h-4 w-20" variant="shimmer" />
          <Skeleton className="h-4 w-12" variant="shimmer" />
        </div>
        
        {/* Progress bar */}
        <Skeleton className="h-2 w-full rounded-full" variant="shimmer" />
        
        {/* Button */}
        <Skeleton className="h-10 w-full rounded-lg" variant="shimmer" />
      </div>
    </div>
  );
};

export const DashboardStatSkeleton = () => {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-lg" variant="shimmer" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-20" variant="shimmer" />
          <Skeleton className="h-6 w-16" variant="shimmer" />
        </div>
      </div>
    </div>
  );
};

export const TableRowSkeleton = () => {
  return (
    <tr className="border-b border-border/50">
      <td className="py-3 px-4"><Skeleton className="h-4 w-24" variant="shimmer" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-32" variant="shimmer" /></td>
      <td className="py-3 px-4"><Skeleton className="h-4 w-20" variant="shimmer" /></td>
      <td className="py-3 px-4"><Skeleton className="h-6 w-16 rounded-full" variant="shimmer" /></td>
    </tr>
  );
};

export const ProfileSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Avatar and name */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" variant="shimmer" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" variant="shimmer" />
          <Skeleton className="h-4 w-32" variant="shimmer" />
        </div>
      </div>
      
      {/* Form fields */}
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" variant="shimmer" />
            <Skeleton className="h-10 w-full rounded-lg" variant="shimmer" />
          </div>
        ))}
      </div>
    </div>
  );
};
