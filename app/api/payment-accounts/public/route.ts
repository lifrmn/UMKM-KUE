import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const paymentAccounts = await prisma.paymentAccount.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 1
    });

    return NextResponse.json(paymentAccounts[0] || null);
  } catch (error) {
    console.error("Get public payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
