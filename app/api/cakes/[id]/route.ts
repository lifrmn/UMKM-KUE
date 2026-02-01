import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage } from "@/lib/cloudinary";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    if (!cake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(cake);
  } catch (error) {
    console.error("Get cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

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

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const price = parseInt(formData.get("price") as string);
    const isAvailable = formData.get("isAvailable") === "true";
    const imageFile = formData.get("image") as File | null;

    // Check if cake exists and belongs to user
    const existingCake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    if (!existingCake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingCake.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    let imageUrl = existingCake.imageUrl;

    // If new image provided, upload and delete old one
    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadImage(imageFile);
      await deleteImage(existingCake.imageUrl);
    }

    // Update cake
    const updatedCake = await prisma.cake.update({
      where: { id: params.id },
      data: {
        name,
        price,
        imageUrl,
        isAvailable
      }
    });

    return NextResponse.json(updatedCake);
  } catch (error) {
    console.error("Update cake error:", error);
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

    const cake = await prisma.cake.findUnique({
      where: { id: params.id }
    });

    if (!cake) {
      return NextResponse.json(
        { error: "Kue tidak ditemukan" },
        { status: 404 }
      );
    }

    if (cake.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete image from Cloudinary
    await deleteImage(cake.imageUrl);

    // Delete cake from database
    await prisma.cake.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Kue berhasil dihapus" });
  } catch (error) {
    console.error("Delete cake error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
