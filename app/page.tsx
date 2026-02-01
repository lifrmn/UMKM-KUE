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
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const categories = [
    { id: "semua", name: "Semua Kue", icon: "🧁" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bakery-cream">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-4xl">🧁</span>
              <div>
                <h1 className="text-2xl font-display font-bold text-primary-600">
                  Toko Kue UMKM
                </h1>
                <p className="text-xs text-gray-500">Kue Tradisional Berkualitas</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#tentang" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Tentang
              </a>
              <a href="#menu" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Menu
              </a>
              <a href="#kontak" className="text-gray-700 hover:text-primary-600 font-medium transition">
                Kontak
              </a>
              <Link
                href="/login"
                className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-full transition shadow-lg"
              >
                Login Penjual
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-3">
                <a href="#tentang" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                  Tentang
                </a>
                <a href="#menu" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                  Menu
                </a>
                <a href="#kontak" className="text-gray-700 hover:text-primary-600 font-medium py-2">
                  Kontak
                </a>
                <Link
                  href="/login"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-2 rounded-full transition text-center"
                >
                  Login Penjual
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bakery-cream via-bakery-peach to-bakery-pink opacity-90"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRIMHY0aDMyYzIuMjEgMCA0IDEuNzkgNCA0djI4YzAgMi4yMS0xLjc5IDQtNCA0SDRjLTIuMjEgMC00LTEuNzktNC00VjM0YzAtMi4yMSAxLjc5LTQgNC00aDI4di00SDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <div className="inline-block mb-4">
                <span className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ✨ Kue Homemade Terbaik
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-display font-bold text-gray-800 mb-6 leading-tight">
                Kue Lezat untuk<br/>
                <span className="text-primary-600">Momen Spesial</span>
              </h1>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                Nikmati kelezatan kue tradisional yang dibuat dengan resep turun temurun dan bahan pilihan berkualitas tinggi
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a
                  href="#menu"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-8 rounded-full transition shadow-xl hover:shadow-2xl text-lg transform hover:scale-105"
                >
                  🛒 Pesan Sekarang
                </a>
                <a
                  href="#menu"
                  className="bg-white hover:bg-gray-50 text-primary-600 font-bold py-4 px-8 rounded-full transition shadow-xl hover:shadow-2xl text-lg border-2 border-primary-500 transform hover:scale-105"
                >
                  📋 Lihat Menu
                </a>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">100+</div>
                  <div className="text-sm text-gray-600">Pelanggan Puas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-sm text-gray-600">Varian Kue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">5★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="relative z-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-3 hover:rotate-0 transition">
                    <div className="text-7xl mb-3">🍰</div>
                    <div className="font-bold text-gray-800 text-lg">Kue Manis</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-2xl transform -rotate-3 hover:rotate-0 transition mt-8">
                    <div className="text-7xl mb-3">🥖</div>
                    <div className="font-bold text-gray-800 text-lg">Kue Gurih</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-2xl transform rotate-2 hover:rotate-0 transition col-span-2">
                    <div className="text-7xl mb-3">🧁</div>
                    <div className="font-bold text-gray-800 text-lg">Kue Tradisional</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-bakery-peach to-bakery-pink rounded-2xl p-8 text-center shadow-lg">
                  <div className="text-5xl mb-3">🏆</div>
                  <div className="font-bold text-gray-800 text-lg">Kualitas Terjamin</div>
                </div>
                <div className="bg-gradient-to-br from-bakery-mint to-bakery-lavender rounded-2xl p-8 text-center shadow-lg mt-8">
                  <div className="text-5xl mb-3">👨‍🍳</div>
                  <div className="font-bold text-gray-800 text-lg">Chef Berpengalaman</div>
                </div>
                <div className="bg-gradient-to-br from-bakery-lavender to-bakery-cream rounded-2xl p-8 text-center shadow-lg">
                  <div className="text-5xl mb-3">🥇</div>
                  <div className="font-bold text-gray-800 text-lg">Bahan Premium</div>
                </div>
                <div className="bg-gradient-to-br from-bakery-cream to-bakery-peach rounded-2xl p-8 text-center shadow-lg mt-8">
                  <div className="text-5xl mb-3">💯</div>
                  <div className="font-bold text-gray-800 text-lg">Halal & Higienis</div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wide">Tentang Kami</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-3 mb-6">
                Menghadirkan Kelezatan di Setiap Gigitan
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Kami adalah UMKM lokal yang berdedikasi untuk menghadirkan kue-kue berkualitas dengan cita rasa otentik. Setiap produk dibuat dengan penuh kasih sayang menggunakan resep tradisional yang telah teruji.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Dengan bahan pilihan terbaik dan proses pembuatan yang higienis, kami memastikan setiap kue yang sampai ke tangan Anda adalah yang terbaik.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-primary-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Bahan Alami</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Tanpa Pengawet</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-gradient-to-b from-white to-bakery-cream">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wide">Menu Spesial Kami</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mt-3 mb-4">
              Pilihan Kue Terlezat
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Jelajahi koleksi kue homemade kami yang dibuat fresh setiap hari dengan resep rahasia warisan keluarga
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-semibold transition transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-primary-50 shadow-md"
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Memuat menu lezat...</p>
            </div>
          ) : cakes.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
              <div className="text-8xl mb-6">🍰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Menu Segera Hadir!</h3>
              <p className="text-gray-600 text-lg">Kami sedang menyiapkan kue-kue spesial untuk Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {cakes.map((cake) => (
                <div
                  key={cake.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ✓ Ready
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl mb-2 text-gray-800 group-hover:text-primary-600 transition">
                      {cake.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Harga</div>
                        <p className="text-primary-600 font-bold text-2xl">
                          Rp {cake.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex text-yellow-400 text-sm">
                        {"★".repeat(5)}
                      </div>
                    </div>
                    <Link
                      href={`/order?cakeId=${cake.id}`}
                      className="block w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-3 px-4 rounded-xl transition text-center shadow-md hover:shadow-xl transform group-hover:scale-105"
                    >
                      🛒 Pesan Sekarang
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-gray-600 text-lg">Kami berkomitmen memberikan yang terbaik untuk Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gradient-to-br from-bakery-cream to-bakery-peach rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-5xl">🎂</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Selalu Fresh</h3>
              <p className="text-gray-700">
                Setiap kue dibuat fresh setiap hari dengan bahan pilihan berkualitas premium untuk kesegaran maksimal
              </p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-bakery-mint to-bakery-lavender rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-5xl">💝</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Dibuat dengan Cinta</h3>
              <p className="text-gray-700">
                Setiap produk dibuat dengan penuh perhatian dan kasih sayang, seperti kue buatan rumah sendiri
              </p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-bakery-lavender to-bakery-pink rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-5xl">🚀</span>
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-gray-800">Proses Cepat</h3>
              <p className="text-gray-700">
                Sistem pemesanan online yang mudah dan cepat, langsung dari smartphone Anda kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Siap Memesan Kue Lezat?
          </h2>
          <p className="text-xl text-primary-50 mb-8">
            Jangan tunggu lagi! Pesan sekarang dan nikmati kelezatan kue homemade kami
          </p>
          <a
            href="#menu"
            className="inline-block bg-white text-primary-600 font-bold py-4 px-10 rounded-full transition shadow-2xl hover:shadow-xl text-lg transform hover:scale-105"
          >
            🛒 Mulai Pesan Sekarang
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-4xl">🧁</span>
                <h3 className="text-2xl font-display font-bold">Toko Kue UMKM</h3>
              </div>
              <p className="text-gray-400">
                Menghadirkan kue tradisional berkualitas untuk setiap momen spesial Anda
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Menu</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#tentang" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#menu" className="hover:text-white transition">Menu Kue</a></li>
                <li><Link href="/order" className="hover:text-white transition">Cara Pesan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📱 WhatsApp: 0812-3456-7890</li>
                <li>📧 Email: info@tokokueumkm.com</li>
                <li>📍 Alamat: Samata, Gowa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              © 2026 Toko Kue UMKM. Semua hak dilindungi.
            </p>
            <div className="mt-4">
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition text-sm">
                🔐 Portal Penjual
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
