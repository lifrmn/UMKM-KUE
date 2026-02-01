import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            cake: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const customerName = formData.get("customerName") as string;
    const whatsappNumber = formData.get("whatsappNumber") as string;
    const pickupDate = formData.get("pickupDate") as string;
    const pickupTime = formData.get("pickupTime") as string;
    const paymentProofFile = formData.get("paymentProof") as File;
    const orderItemsJson = formData.get("orderItems") as string;

    if (!customerName || !whatsappNumber || !pickupDate || !pickupTime || !paymentProofFile || !orderItemsJson) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const orderItems = JSON.parse(orderItemsJson);

    // Upload payment proof to Cloudinary
    const { uploadImage } = await import("@/lib/cloudinary");
    const paymentProofUrl = await uploadImage(paymentProofFile);

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        customerName,
        whatsappNumber,
        pickupDate: new Date(pickupDate),
        pickupTime,
        paymentProofUrl,
        status: "menunggu",
        orderItems: {
          create: orderItems.map((item: any) => ({
            cakeId: item.cakeId,
            quantity: item.quantity,
            cakeName: item.cakeName,
            cakePrice: item.cakePrice
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
