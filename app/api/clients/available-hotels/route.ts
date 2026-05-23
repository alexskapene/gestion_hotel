import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ClientAvailableHotelsService } from "@/services/client";

export const GET = auth(async (req) => {
  if (req.auth?.user?.role !== "CLIENT") {
    return NextResponse.json(
      { error: "Non autorisé" },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const search = searchParams.get("search");

    let hotels;

    if (city && city !== "Tous") {
      hotels = await ClientAvailableHotelsService.getHotelsByCity(city);
    } else {
      hotels = await ClientAvailableHotelsService.getAvailableHotels(search || undefined);
    }

    // Transformer les données pour le format attendu par le frontend
    const formattedHotels = hotels.map((hotel) => ({
      id: hotel.id,
      name: hotel.name,
      city: hotel.city,
      rating: hotel.averageRating || 0,
      price: hotel.rooms?.[0]?.price || 0,
      image: [hotel.coverImage || hotel.logo || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop"],
      amenities: hotel.amenities.map((a) => a.name.toLowerCase()),
      description: hotel.description,
      address: hotel.address,
      phone: hotel.phone,
      email: hotel.email,
      reviewCount: hotel._count.reviews,
    }));

    return NextResponse.json(formattedHotels);
  } catch (error) {
    console.error("Erreur récupération hôtels:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}) as any;
