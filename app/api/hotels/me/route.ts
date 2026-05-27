import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { HotelService } from "@/services/hotel";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const hotel = await HotelService.getHotelByOwner(userId);
    
    if (!hotel) {
      return NextResponse.json({ name: "Mon Hôtel" }, { status: 200 });
    }
    
    return NextResponse.json(hotel);
  } catch (error) {
    console.error("GET /api/hotels/me error:", error);
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 });
  }
}

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const userId = (session.user as any).id;

    const errors: Record<string, string> = {};
    if (!body.name || String(body.name).trim() === "") errors.name = "Le nom de l'hôtel est requis.";
    if (!body.country || String(body.country).trim() === "") errors.country = "Le pays est requis.";
    if (!body.city || String(body.city).trim() === "") errors.city = "La ville est requise.";
    if (!body.address || String(body.address).trim() === "") errors.address = "L'adresse est requise.";
    if (body.email && !validateEmail(String(body.email).trim())) errors.email = "L'email n'est pas valide.";
    if (body.website && String(body.website).trim() !== "" && !validateUrl(String(body.website).trim())) errors.website = "L'URL du site n'est pas valide.";
    if (body.logo && String(body.logo).trim() !== "" && !validateUrl(String(body.logo).trim())) errors.logo = "L'URL du logo n'est pas valide.";
    if (body.coverImage && String(body.coverImage).trim() !== "" && !validateUrl(String(body.coverImage).trim())) errors.coverImage = "L'URL de l'image de couverture n'est pas valide.";
    if (body.stars !== undefined && body.stars !== null) {
      const stars = Number(body.stars);
      if (Number.isNaN(stars) || stars < 0 || stars > 5) errors.stars = "Le nombre d'étoiles doit être entre 0 et 5.";
    }
    if (body.latitude !== undefined && body.latitude !== null) {
      const latitude = Number(body.latitude);
      if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) errors.latitude = "La latitude doit être comprise entre -90 et 90.";
    }
    if (body.longitude !== undefined && body.longitude !== null) {
      const longitude = Number(body.longitude);
      if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) errors.longitude = "La longitude doit être comprise entre -180 et 180.";
    }

    if (Object.keys(errors).length) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const hotel = await HotelService.upsertHotel(userId, body);
    return NextResponse.json(hotel, { status: 200 });
  } catch (error) {
    console.error("POST /api/hotels/me error:", error);
    return NextResponse.json({ error: "Failed to upsert hotel" }, { status: 500 });
  }
}
