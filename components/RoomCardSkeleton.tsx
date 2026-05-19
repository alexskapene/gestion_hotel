import { Card, CardContent } from "@/components/ui/card";

export const RoomCardSkeleton = () => {
  return (
    <Card className="rounded-2xl overflow-hidden">
      {/* Image Skeleton */}
      <div className="relative">
        <div className="h-48 bg-muted animate-pulse" />
        <div className="absolute top-4 left-4 w-20 h-6 rounded-full bg-muted-foreground/20" />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <CardContent className="p-5 space-y-4">
        {/* Title and number */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="text-right space-y-1">
            <div className="h-7 w-20 bg-muted animate-pulse rounded ml-auto" />
            <div className="h-3 w-12 bg-muted animate-pulse rounded ml-auto" />
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>

        {/* Capacity and amenities */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex gap-1">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full bg-muted animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="flex-1 h-10 bg-muted animate-pulse rounded-full" />
          <div className="flex-1 h-10 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
};
