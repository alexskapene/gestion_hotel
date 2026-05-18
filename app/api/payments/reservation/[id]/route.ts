import { NextResponse } from "next/server";
import { PaymentService } from "@/services/admin/payment.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const balance = await PaymentService.calculateBalance(id);
    const payments = await PaymentService.getReservationPayments(id);
    
    return NextResponse.json({
      ...balance,
      payments
    });
  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/payments/reservation/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch reservation balance" }, { status: 500 });
  }
}
