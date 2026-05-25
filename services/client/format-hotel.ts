const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop";

export function formatHotelForFrontend(hotel: {
  id: string;
  name: string;
  city: string;
  description?: string | null;
  averageRating?: number;
  stars?: number;
  coverImage?: string | null;
  logo?: string | null;
  isFeatured?: boolean;
  images?: { imageUrl: string }[];
  amenities?: { name: string }[];
  rooms?: { price: number }[];
  _count?: { reviews: number };
}) {
  const imageUrl =
    hotel.coverImage ||
    hotel.logo ||
    hotel.images?.[0]?.imageUrl ||
    DEFAULT_HOTEL_IMAGE;

  return {
    id: hotel.id,
    name: hotel.name,
    city: hotel.city,
    rating: hotel.averageRating ?? hotel.stars ?? 0,
    reviews: hotel._count?.reviews ?? 0,
    price: hotel.rooms?.[0]?.price ?? 0,
    image: [imageUrl],
    amenities: (hotel.amenities ?? []).map((a) => a.name.toLowerCase()),
    description: hotel.description ?? "",
    revenue: 0,
    occupancy: 0,
    featured: !!hotel.isFeatured,
    rooms: [],
  };
}
