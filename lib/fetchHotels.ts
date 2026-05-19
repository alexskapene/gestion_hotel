import { Hotels } from "@/data/mockData";

// Fonction simulée pour fetch les hôtels avec un délai
// Remplacez ceci par un vrai appel API quand vous serez prêt
export async function fetchHotels() {
  // Simuler un délai réseau (2 secondes)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Retourner les données mockées
  return Hotels;
}
