import { NextResponse } from "next/server";
import { HotelService } from "@/services/hotel";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hotel = await HotelService.getHotelById(id);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }
    return NextResponse.json(hotel);
  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/hotels/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
    }

    const hotel = await HotelService.updateStatus(id, isActive);
    return NextResponse.json(hotel);
  } catch (error) {
    const { id } = await params;
    console.error(`PATCH /api/hotels/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update hotel status" }, { status: 500 });
  }
}
