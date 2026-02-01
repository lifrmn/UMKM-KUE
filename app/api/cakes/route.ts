import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const cakes = await prisma.cake.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(cakes);
  } catch (error) {
    console.error("Get cakes error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const isAvailable = formData.get("isAvailable") === "true";
    const imageFile = formData.get("image") as File;

    if (!name || !price || !imageFile) {
      return NextResponse.json(
        { error: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadImage(imageFile);

    // Create cake in database
    const cake = await prisma.cake.create({
      data: {
        name,
        price,
        imageUrl,
        isAvailable,
        userId: session.user.id
      }
    });

    return NextResponse.json(cake, { status: 201 });
  } catch (error) {
    console.error("Create cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
