import { NextResponse } from "next/server";
import { HotelService } from "@/services/hotel";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city") || undefined;
    const stars = searchParams.get("stars") ? parseInt(searchParams.get("stars")!) : undefined;
    const isActive = searchParams.get("isActive") === "false" ? false : true;

    const hotels = await HotelService.getHotels({ city, stars, isActive });
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("GET /api/hotels error:", error);
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ...data } = body;
    
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const hotel = await HotelService.upsertHotel(userId, data);
    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("POST /api/hotels error:", error);
    return NextResponse.json({ error: "Failed to upsert hotel" }, { status: 500 });
  }
}
