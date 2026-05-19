import { RoomCardSkeleton } from "@/components/RoomCardSkeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-5 w-48 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-12 w-48 bg-muted animate-pulse rounded-full" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="h-12 w-full bg-muted animate-pulse rounded-full" />
        </div>
        <div className="h-12 w-40 bg-muted animate-pulse rounded-full" />
        <div className="h-12 w-48 bg-muted animate-pulse rounded-full" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <RoomCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
