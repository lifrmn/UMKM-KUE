import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { bankName, accountNumber, accountName } = await request.json();

    const existingAccount = await prisma.paymentAccount.findUnique({
      where: { id: params.id }
    });

    if (!existingAccount) {
      return NextResponse.json(
        { error: "Rekening tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingAccount.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const updatedAccount = await prisma.paymentAccount.update({
      where: { id: params.id },
      data: {
        bankName,
        accountNumber,
        accountName
      }
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error("Update payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const account = await prisma.paymentAccount.findUnique({
      where: { id: params.id }
    });

    if (!account) {
      return NextResponse.json(
        { error: "Rekening tidak ditemukan" },
        { status: 404 }
      );
    }

    if (account.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await prisma.paymentAccount.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Rekening berhasil dihapus" });
  } catch (error) {
    console.error("Delete payment account error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
