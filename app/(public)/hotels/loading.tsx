import { HotelCardSkeleton } from "@/components/HotelCardSkeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 w-full">
        {/* HERO SECTION Skeleton */}
        <section className="relative min-h-[45vh] md:min-h-[50vh] flex items-center justify-center overflow-hidden py-16 md:py-0">
          <div className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 bg-muted animate-pulse" />
          <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white space-y-6">
            <div className="h-16 w-3/4 mx-auto bg-muted/30 animate-pulse rounded" />
            <div className="h-6 w-1/2 mx-auto bg-muted/30 animate-pulse rounded" />
          </div>
        </section>

        {/* RESULTS SECTION Skeleton */}
        <section className="py-24 container mx-auto px-6">
          <div className="flex flex-col gap-12">
            {/* Header Skeleton */}
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
                <div className="space-y-2">
                  <div className="h-12 w-64 bg-muted animate-pulse rounded" />
                  <div className="h-6 w-96 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-5 w-20 bg-muted animate-pulse rounded" />
                  <div className="h-10 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>

              {/* Search Bar Skeleton */}
              <div className="bg-white border border-border p-3 flex items-center gap-3 max-w-4xl">
                <div className="flex-1 h-12 bg-muted animate-pulse rounded" />
                <div className="h-8 w-px bg-border hidden md:block" />
                <div className="h-12 w-32 bg-muted animate-pulse rounded" />
              </div>
            </div>

            {/* Grid Skeleton - 8 cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <HotelCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
