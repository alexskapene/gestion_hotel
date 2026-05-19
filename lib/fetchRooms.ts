import { Hotels } from "@/data/mockData";

// Fonction simulée pour fetch les chambres avec un délai
// Remplacez ceci par un vrai appel API quand vous serez prêt
export async function fetchRooms() {
  // Simuler un délai réseau (2 secondes)
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const rooms = Hotels[0].rooms;

  // Données mockées pour les chambres
  return rooms;
  // [
  //   {
  //     id: 1,
  //     number: "301",
  //     type: "Suite Deluxe",
  //     price: 85,
  //     capacity: 2,
  //     status: "available",
  //     amenities: ["wifi", "tv", "ac", "parking"],
  //     image:
  //       "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop",
  //     description:
  //       "Suite spacieuse avec vue sur la ville, lit king size et salle de bain privée.",
  //   },
  //   {
  //     id: 2,
  //     number: "302",
  //     type: "Suite Deluxe",
  //     price: 85,
  //     capacity: 2,
  //     status: "occupied",
  //     amenities: ["wifi", "tv", "ac", "parking"],
  //     image:
  //       "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
  //     description:
  //       "Suite spacieuse avec vue sur la ville, lit king size et salle de bain privée.",
  //   },
  //   {
  //     id: 3,
  //     number: "205",
  //     type: "Chambre Double",
  //     price: 65,
  //     capacity: 2,
  //     status: "available",
  //     amenities: ["wifi", "tv", "ac"],
  //     image:
  //       "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop",
  //     description:
  //       "Chambre confortable avec deux lits simples ou un lit double.",
  //   },
  //   {
  //     id: 4,
  //     number: "206",
  //     type: "Chambre Double",
  //     price: 65,
  //     capacity: 2,
  //     status: "maintenance",
  //     amenities: ["wifi", "tv", "ac"],
  //     image:
  //       "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop",
  //     description:
  //       "Chambre confortable avec deux lits simples ou un lit double.",
  //   },
  //   {
  //     id: 5,
  //     number: "102",
  //     type: "Chambre Simple",
  //     price: 40,
  //     capacity: 1,
  //     status: "occupied",
  //     amenities: ["wifi", "tv"],
  //     image:
  //       "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop",
  //     description: "Chambre économique idéale pour les voyageurs seuls.",
  //   },
  //   {
  //     id: 6,
  //     number: "401",
  //     type: "Suite Premium",
  //     price: 120,
  //     capacity: 4,
  //     status: "available",
  //     amenities: ["wifi", "tv", "ac", "parking", "restaurant"],
  //     image:
  //       "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop",
  //     description:
  //       "Notre meilleure suite avec salon séparé, jacuzzi et service VIP.",
  //   },
  // ];
}
