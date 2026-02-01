'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Cake {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function HomePage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCakes();
  }, []);

  const fetchCakes = async () => {
    try {
      const res = await fetch("/api/cakes/available");
      const data = await res.json();
      setCakes(data);
    } catch (error) {
      console.error("Error fetching cakes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-bakery-cream via-bakery-peach to-bakery-pink py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="text-7xl mb-6 animate-bounce">🧁</div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-primary-700 mb-6">
            Toko Kue UMKM
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Kue homemade segar & lezat dibuat dengan cinta untuk kebahagiaan Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#menu"
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full transition shadow-lg hover:shadow-xl text-lg"
            >
              Lihat Menu Kue
            </a>
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-4 px-8 rounded-full transition shadow-lg hover:shadow-xl text-lg border-2 border-primary-500"
            >
              Login Penjual
            </Link>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-gray-800 mb-4">
              Menu Kue Kami
            </h2>
            <p className="text-gray-600 text-lg">
              Pilih kue favorit Anda dan pesan sekarang!
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : cakes.length === 0 ? (
            <div className="text-center py-12 bg-bakery-cream rounded-xl">
              <div className="text-6xl mb-4">🍰</div>
              <p className="text-gray-600 text-lg">Belum ada menu kue tersedia saat ini</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cakes.map((cake) => (
                <div
                  key={cake.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-56">
                    <Image
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-bold text-xl mb-2 text-gray-800">
                      {cake.name}
                    </h3>
                    <p className="text-primary-600 font-bold text-2xl mb-4">
                      Rp {cake.price.toLocaleString("id-ID")}
                    </p>
                    <Link
                      href={`/order?cakeId=${cake.id}`}
                      className="block w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition text-center shadow-md hover:shadow-lg"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-bakery-mint via-bakery-cream to-bakery-lavender">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🎂</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Kue Fresh</h3>
              <p className="text-gray-600">
                Dibuat fresh setiap hari dengan bahan berkualitas
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">💝</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Dibuat dengan Cinta</h3>
              <p className="text-gray-600">
                Setiap kue dibuat dengan penuh perhatian dan kasih sayang
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Pesan Mudah</h3>
              <p className="text-gray-600">
                Proses pemesanan yang cepat dan mudah
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-800 text-white py-8 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-lg mb-2">🧁 Toko Kue UMKM</p>
          <p className="text-primary-200">
            Kue lezat untuk setiap momen spesial Anda
          </p>
          <div className="mt-6">
            <Link href="/login" className="text-primary-200 hover:text-white transition">
              Login Penjual
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
