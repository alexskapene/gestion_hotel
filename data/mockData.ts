import { Hotel, Reservation, User } from "@/types/types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;

export const Users: User[] = [
  { id: "u1", name: "Alice Dubois", email: "alice@maison.com", role: "client" },
  {
    id: "u2",
    name: "Marc Laurent",
    email: "marc@hotelroyal.com",
    role: "manager",
    hotelId: "h1",
  },
  { id: "u3", name: "Sophie Admin", email: "admin@maison.com", role: "admin" },
];

export const Hotels: Hotel[] = [
  {
    id: 1,
    name: "Bunia Grand Palace",
    city: "Bunia",
    description:
      "Hôtel moderne au cœur de Bunia avec chambres confortables et restaurant international.",
    rating: 4.6,
    reviews: 820,
    price: 95,
    image: [
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1501117716987-c8e1ecb2106e"),
    ],
    amenities: ["wifi", "tv", "restaurant"],
    rooms: [
      {
        id: 1,
        type: "Chambre Standard",
        price: 40,
        capacity: 2,
        description: "Chambre simple et confortable.",
        amenities: ["wifi"],
        image: img("photo-1520250497591-112f2f40a3f4"),
        available: true,
      },
      {
        id: 2,
        type: "Chambre Standard",
        price: 40,
        capacity: 2,
        description: "Chambre simple et confortable.",
        amenities: ["wifi"],
        image: img("photo-1520250497591-112f2f40a3f4"),
        available: true,
      },
      {
        id: 3,
        type: "Chambre Standard",
        price: 40,
        capacity: 2,
        description: "Chambre simple et confortable.",
        amenities: ["wifi"],
        image: img("photo-1520250497591-112f2f40a3f4"),
        available: true,
      },
      {
        id: 4,
        type: "Chambre Standard",
        price: 40,
        capacity: 2,
        description: "Chambre simple et confortable.",
        amenities: ["wifi"],
        image: img("photo-1520250497591-112f2f40a3f4"),
        available: true,
      },
    ],
    revenue: 210000,
    occupancy: 72,
    featured: true,
  },

  {
    id: 2,
    name: "Lake View Hotel",
    city: "Mahagi",
    description: "Hôtel calme avec vue sur la nature et ambiance relaxante.",
    rating: 4.3,
    reviews: 310,
    price: 70,
    image: [
      img("photo-1470770903676-69b98201ea1c"),
      img("photo-1470770903676-69b98201ea1c"),
    ],
    amenities: ["wifi", "parking"],
    rooms: [
      {
        id: 1,
        type: "Chambre Double",
        price: 55,
        capacity: 2,
        description: "Chambre spacieuse et lumineuse.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
        available: true,
      },
    ],
    revenue: 150000,
    occupancy: 68,
    featured: false,
  },

  {
    id: 3,
    name: "Aru Serenity Hotel",
    city: "Aru",
    description:
      "Hôtel paisible avec services modernes et personnel accueillant.",
    rating: 4.5,
    reviews: 540,
    price: 110,
    image: [
      img("photo-1566073771259-6a8506099945"),
      img("photo-1551887373-6c7b3a1f2f4d"),
    ],
    amenities: ["wifi", "ac", "restaurant"],
    rooms: [
      {
        id: 1,
        type: "Suite Deluxe",
        price: 90,
        capacity: 2,
        description: "Suite moderne avec climatisation.",
        amenities: ["wifi", "ac"],
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
        available: true,
      },
    ],
    revenue: 320000,
    occupancy: 78,
    featured: true,
  },

  {
    id: 4,
    name: "Djugu Comfort Lodge",
    city: "Djugu",
    description: "Lodge familial avec ambiance chaleureuse et service local.",
    rating: 4.1,
    reviews: 190,
    price: 85,
    image: [
      img("photo-1542314831-068cd1dbfeeb"),
      img("photo-1554995207-c18c203602cb"),
    ],
    amenities: ["wifi", "tv"],
    rooms: [
      {
        id: 1,
        type: "Chambre Familiale",
        price: 100,
        capacity: 4,
        description: "Idéal pour les familles.",
        amenities: ["wifi", "tv"],
        image:
          "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=400",
        available: false,
      },
    ],
    revenue: 240000,
    occupancy: 60,
    featured: false,
  },

  {
    id: 5,
    name: "Irumu River Lodge",
    city: "Irumu",
    description: "Lodge naturel au bord de la rivière avec vue exceptionnelle.",
    rating: 4.7,
    reviews: 260,
    price: 75,
    image: [
      img("photo-1501785888041-af3ef285b470"),
      img("photo-1441974231531-c6227db76b6e"),
    ],
    amenities: ["wifi"],
    rooms: [
      {
        id: 1,
        type: "Cabane Nature",
        price: 45,
        capacity: 1,
        description: "Expérience immersive en nature.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
        available: true,
      },
    ],
    revenue: 170000,
    occupancy: 66,
    featured: true,
  },

  {
    id: 6,
    name: "Mambasa Forest Retreat",
    city: "Mambasa",
    description: "Retraite en pleine forêt tropicale pour déconnexion totale.",
    rating: 4.8,
    reviews: 140,
    price: 60,
    image: [
      img("photo-1470770841072-f978cf4d019e"),
      img("photo-1500530855697-b586d89ba3ee"),
    ],
    amenities: ["wifi"],
    rooms: [
      {
        id: 1,
        type: "Eco Lodge",
        price: 35,
        capacity: 1,
        description: "Petit lodge écologique.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400",
        available: true,
      },
    ],
    revenue: 130000,
    occupancy: 55,
    featured: false,
  },

  {
    id: 7,
    name: "Bunia Elite Hotel",
    city: "Bunia",
    description:
      "Hôtel haut standing avec services premium et suites luxueuses.",
    rating: 4.9,
    reviews: 980,
    price: 150,
    image: [
      img("photo-1522708323590-d24dbb6b0267"),
      img("photo-1505692794403-34d4982d8c70"),
    ],
    amenities: ["wifi", "parking", "restaurant"],
    rooms: [
      {
        id: 1,
        type: "Suite Premium",
        price: 140,
        capacity: 2,
        description: "Suite luxueuse avec confort moderne.",
        amenities: ["wifi", "tv"],
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
        available: true,
      },
    ],
    revenue: 500000,
    occupancy: 85,
    featured: true,
  },

  {
    id: 8,
    name: "Mahagi Horizon Hotel",
    city: "Mahagi",
    description: "Hôtel moderne avec vue dégagée et ambiance calme.",
    rating: 4.2,
    reviews: 220,
    price: 80,
    image: [
      img("photo-1520250497591-112f2f40a3f4"),
      img("photo-1551887373-6c7b3a1f2f4d"),
    ],
    amenities: ["wifi", "tv"],
    rooms: [
      {
        id: 1,
        type: "Chambre Standard",
        price: 50,
        capacity: 1,
        description: "Chambre confortable.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400",
        available: true,
      },
    ],
    revenue: 180000,
    occupancy: 70,
    featured: false,
  },

  {
    id: 9,
    name: "Aru Central Hotel",
    city: "Aru",
    description: "Hôtel central avec accès rapide aux commerces et marchés.",
    rating: 4.4,
    reviews: 410,
    price: 95,
    image: [
      img("photo-1566073771259-6a8506099945"),
      img("photo-1542314831-068cd1dbfeeb"),
    ],
    amenities: ["wifi", "restaurant"],
    rooms: [
      {
        id: 1,
        type: "Chambre Double",
        price: 70,
        capacity: 2,
        description: "Chambre moderne.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400",
        available: true,
      },
    ],
    revenue: 260000,
    occupancy: 74,
    featured: true,
  },

  {
    id: 10,
    name: "Djugu Royal Stay",
    city: "Djugu",
    description: "Hôtel simple mais confortable avec bon service client.",
    rating: 4.0,
    reviews: 150,
    price: 70,
    image: [
      img("photo-1554995207-c18c203602cb"),
      img("photo-1501785888041-af3ef285b470"),
    ],
    amenities: ["wifi"],
    rooms: [
      {
        id: 1,
        type: "Chambre Standard",
        price: 45,
        capacity: 1,
        description: "Chambre propre et calme.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
        available: true,
      },
    ],
    revenue: 140000,
    occupancy: 58,
    featured: false,
  },

  {
    id: 11,
    name: "Irumu Forest Hotel",
    city: "Irumu",
    description: "Hôtel écologique entouré de verdure et de nature.",
    rating: 4.6,
    reviews: 230,
    price: 85,
    image: [
      img("photo-1441974231531-c6227db76b6e"),
      img("photo-1500530855697-b586d89ba3ee"),
    ],
    amenities: ["wifi", "ac"],
    rooms: [
      {
        id: 1,
        type: "Cabane Simple",
        price: 50,
        capacity: 1,
        description: "Séjour nature simple.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=400",
        available: true,
      },
    ],
    revenue: 200000,
    occupancy: 63,
    featured: true,
  },

  {
    id: 12,
    name: "Mambasa Eco Resort",
    city: "Mambasa",
    description: "Eco resort moderne en pleine nature tropicale.",
    rating: 4.7,
    reviews: 180,
    price: 90,
    image: [
      img("photo-1470770841072-f978cf4d019e"),
      img("photo-1505693416388-ac5ce068fe85"),
    ],
    amenities: ["wifi", "restaurant"],
    rooms: [
      {
        id: 1,
        type: "Bungalow",
        price: 60,
        capacity: 2,
        description: "Bungalow confortable en nature.",
        amenities: ["wifi"],
        image:
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
        available: true,
      },
    ],
    revenue: 300000,
    occupancy: 80,
    featured: true,
  },
];

export const Reservations: Reservation[] = [
  {
    id: "r1",
    createdAt: "2026-04-10T10:00:00Z",

    userId: "u1",
    userName: "Alice Dubois",

    hotelId: 1,
    hotel: "Le Royal Méditerranée",

    room: "Suite Deluxe",
    roomNumber: "301",

    checkIn: "2026-04-15",
    checkOut: "2026-04-18",

    guests: 2,
    status: "confirmed",

    price: 255,
    acompte: 100,

    image: img("photo-1566073771259-6a8506099945"),
    hotelPhone: "+243 99 123 4567",
    hotelAddress: "Nice, Promenade des Anglais",
  },
  {
    id: "r2",
    createdAt: "2026-05-01T12:30:00Z",

    userId: "u1",
    userName: "Alice Dubois",

    hotelId: 2,
    hotel: "Grand Hôtel du Lac",

    room: "Chambre Double",
    roomNumber: "205",

    checkIn: "2026-05-25",
    checkOut: "2026-05-27",

    guests: 2,
    status: "pending",

    price: 130,
    acompte: 50,

    image: img("photo-1520250497591-112f2f40a3f4"),
    hotelPhone: "+243 99 234 5678",
    hotelAddress: "Bunia centre",
  },
  {
    id: "r3",
    createdAt: "2026-02-10T09:00:00Z",

    userId: "u2",
    userName: "Marc Laurent",

    hotelId: 1,
    hotel: "Résidence Mahagi",

    room: "Chambre Simple",
    roomNumber: "102",

    checkIn: "2026-02-10",
    checkOut: "2026-02-12",

    guests: 1,
    status: "completed",

    price: 100,
    acompte: 40,

    image: img("photo-1582719508461-905c673771fd"),
    hotelPhone: "+243 99 345 6789",
    hotelAddress: "Mahagi centre",
  },
];

export const allCities = Array.from(new Set(Hotels.map((h) => h.city))).sort();
