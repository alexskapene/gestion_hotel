import { NextResponse } from "next/server";
import { RoomService } from "@/services/room.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const room = await RoomService.updateRoom(id, body);
    return NextResponse.json(room);
  } catch (error) {
    const { id } = await params;
    console.error(`PATCH /api/rooms/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update room" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await RoomService.deleteRoom(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const { id } = await params;
    console.error(`DELETE /api/rooms/${id} error:`, error);
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
