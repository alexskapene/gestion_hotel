import { NextResponse } from "next/server";
import { PaymentService } from "@/services/admin/payment.service";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || undefined;
    const status = url.searchParams.get("status") || undefined;
    const method = url.searchParams.get("method") || undefined;

    const payments = await PaymentService.getAllPayments({
      search,
      status,
      method,
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payment = await PaymentService.processPayment({
      reservationId: body.reservationId,
      amount: body.amount,
      paymentMethod: body.method || body.paymentMethod,
      transactionId: body.transactionId,
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
