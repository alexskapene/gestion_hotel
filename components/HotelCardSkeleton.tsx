export const HotelCardSkeleton = () => {
  return (
    <article className="card-luxe flex flex-col shadow-md/5">
      {/* Image Skeleton */}
      <div className="relative aspect-4/3 overflow-hidden bg-muted animate-pulse">
        <div className="absolute top-4 right-4 w-16 h-6 rounded-full bg-muted-foreground/20" />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title Skeleton */}
        <div className="h-7 w-3/4 bg-muted animate-pulse rounded mb-2" />

        <div className="flex flex-col justify-between gap-4 pt-3 border-t border-border">
          <div>
            {/* Price label and location */}
            <div className="w-full flex justify-between mb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            </div>

            {/* Price Skeleton */}
            <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />

            {/* Amenities Skeleton */}
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-muted animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* CTA Skeleton */}
          <div className="text-end">
            <div className="h-5 w-24 bg-muted animate-pulse rounded ml-auto" />
          </div>
        </div>
      </div>
    </article>
  );
};
