import { NextResponse } from "next/server";
import { PaymentService } from "@/services/admin/payment.service";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const payment = await PaymentService.getPaymentById(id);

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    const { id } = await params;
    console.error(`GET /api/payments/${id} error:`, error);
    return NextResponse.json({ error: "Failed to fetch payment" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "refund") {
      const payment = await PaymentService.refundPayment(id);
      return NextResponse.json(payment);
    }

    if (body.status) {
      const payment = await PaymentService.updatePayment(id, { status: body.status });
      return NextResponse.json(payment);
    }

    return NextResponse.json({ error: "Missing action or status" }, { status: 400 });
  } catch (error) {
    const { id } = await params;
    console.error(`PATCH /api/payments/${id} error:`, error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
