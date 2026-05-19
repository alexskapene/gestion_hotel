import { HotelsPageClient } from "@/components/HotelsPageClient";
import { fetchHotels } from "@/lib/fetchHotels";

// Server Component - fetch les données de manière asynchrone
export default async function HotelsPage() {
  // Fetch les hôtels (avec délai simulé de 2 secondes)
  const hotels = await fetchHotels();

  // Passer les données au Client Component pour l'interactivité
  return <HotelsPageClient hotels={hotels} />;
}
