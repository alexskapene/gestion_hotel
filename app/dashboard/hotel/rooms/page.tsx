import { RoomsPageClient } from "@/components/RoomsPageClient";
import { fetchRooms } from "@/lib/fetchRooms";

// Server Component - fetch les données de manière asynchrone
export default async function HotelRoomsPage() {
  // Fetch les chambres (avec délai simulé de 2 secondes)
  const rooms = await fetchRooms();

  // Passer les données au Client Component pour l'interactivité
  return <RoomsPageClient rooms={rooms} />;
}
