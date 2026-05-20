import { NextResponse } from "next/server";
import { UserService } from "@/services/user.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await UserService.getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/users/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.isActive === "boolean") {
      const user = await UserService.updateStatus(id, body.isActive);
      return NextResponse.json(user);
    }

    const updateData: any = {};
    if (typeof body.username === "string") updateData.username = body.username;
    if (typeof body.phone === "string") updateData.phone = body.phone;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "Aucun champ valide à mettre à jour" }, { status: 400 });
    }

    const user = await UserService.updateUserProfile(id, updateData);
    return NextResponse.json(user);
  } catch (error) {
    const { id } = await params;
    console.error(`PATCH /api/users/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await UserService.deleteUser(id);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    const { id } = await params;
    console.error(`DELETE /api/users/${id} error:`, error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
