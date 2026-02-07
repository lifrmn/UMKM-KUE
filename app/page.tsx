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
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b border-neutral-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-2xl">🧁</span>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  Toko Kue UMKM
                </h1>
                <p className="text-xs text-neutral-500">Kue Tradisional</p>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#tentang" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Tentang
              </a>
              <a href="#menu" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Menu
              </a>
              <a href="#kontak" className="text-neutral-700 hover:text-neutral-900 transition text-sm">
                Kontak
              </a>
              <Link
                href="/login"
                className="btn-primary text-sm"
              >
                Login Penjual
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
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
            <div className="md:hidden mt-4 pt-4 border-t border-neutral-200">
              <div className="flex flex-col gap-3">
                <a href="#tentang" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Tentang
                </a>
                <a href="#menu" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Menu
                </a>
                <a href="#kontak" className="text-neutral-700 hover:text-neutral-900 py-2 text-sm">
                  Kontak
                </a>
                <Link
                  href="/login"
                  className="btn-primary text-sm text-center"
                >
                  Login Penjual
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-accent-cream">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-neutral-200 rounded-natural mb-4">
                <span className="text-sm">✨</span>
                <span className="text-sm text-neutral-700">Kue Homemade Terbaik</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-5 leading-tight">
                Kue Lezat untuk Momen Spesial
              </h1>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Nikmati kelezatan kue tradisional yang dibuat dengan resep turun temurun dan bahan pilihan berkualitas tinggi
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#menu"
                  className="btn-primary"
                >
                  Pesan Sekarang
                </a>
                <a
                  href="#menu"
                  className="btn-outline"
                >
                  Lihat Menu
                </a>
              </div>
              <div className="mt-12 flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary-600">100+</div>
                  <div className="text-sm text-neutral-600 mt-1">Pelanggan</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-sm text-neutral-600 mt-1">Varian Kue</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-600">5★</div>
                  <div className="text-sm text-neutral-600 mt-1">Rating</div>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="grid grid-cols-2 gap-4">
                <div className="card-natural p-5">
                  <div className="text-5xl mb-2">🍰</div>
                  <div className="font-semibold text-neutral-800">Kue Manis</div>
                </div>
                <div className="card-natural p-5 mt-6">
                  <div className="text-5xl mb-2">🥖</div>
                  <div className="font-semibold text-neutral-800">Kue Gurih</div>
                </div>
                <div className="card-natural p-5 col-span-2">
                  <div className="text-5xl mb-2">🧁</div>
                  <div className="font-semibold text-neutral-800">Kue Tradisional</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="tentang" className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-500 font-semibold text-sm uppercase">Tentang Kami</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-3 mb-5">
                Kelezatan di Setiap Gigitan
              </h2>
              <p className="text-neutral-600 text-base leading-relaxed mb-4">
                Kami adalah UMKM lokal yang berdedikasi untuk menghadirkan kue-kue berkualitas dengan cita rasa otentik. Setiap produk dibuat dengan penuh kasih sayang menggunakan resep tradisional yang telah teruji.
              </p>
              <p className="text-neutral-600 text-base leading-relaxed mb-6">
                Dengan bahan pilihan terbaik dan proses pembuatan yang higienis, kami memastikan setiap kue yang sampai ke tangan Anda adalah yang terbaik.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Bahan Alami</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Tanpa Pengawet</span>
                </div>
                <div className="flex items-center gap-2 text-primary-600">
                  <span className="text-xl">✓</span>
                  <span className="font-medium text-sm">Halal & Higienis</span>
                </div>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="card-natural p-6 text-center">
                  <div className="text-4xl mb-2">🏆</div>
                  <div className="font-semibold text-neutral-800 text-sm">Kualitas Terjamin</div>
                </div>
                <div className="card-natural p-6 text-center mt-6">
                  <div className="text-4xl mb-2">👨‍🍳</div>
                  <div className="font-semibold text-neutral-800 text-sm">Chef Berpengalaman</div>
                </div>
                <div className="card-natural p-6 text-center">
                  <div className="text-4xl mb-2">🥇</div>
                  <div className="font-semibold text-neutral-800 text-sm">Bahan Premium</div>
                </div>
                <div className="card-natural p-6 text-center mt-6">
                  <div className="text-4xl mb-2">💯</div>
                  <div className="font-semibold text-neutral-800 text-sm">Halal & Higienis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 md:py-20 px-4 bg-neutral-50">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-10">
            <span className="text-primary-500 font-semibold text-sm uppercase">Menu Spesial Kami</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mt-3 mb-4">
              Pilihan Kue Terlezat
            </h2>
            <p className="text-neutral-600 text-base max-w-2xl">
              Jelajahi koleksi kue homemade kami yang dibuat fresh setiap hari dengan resep rahasia warisan keluarga
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-natural font-medium transition text-sm ${
                  selectedCategory === category.id
                    ? "bg-primary-500 text-white"
                    : "bg-white text-neutral-700 border border-neutral-200 hover:border-primary-500"
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
              <p className="mt-4 text-neutral-600">Memuat menu...</p>
            </div>
          ) : cakes.length === 0 ? (
            <div className="text-center py-20 card-natural">
              <div className="text-6xl mb-4">🍰</div>
              <h3 className="text-xl font-bold text-neutral-800 mb-2">Menu Segera Hadir!</h3>
              <p className="text-neutral-600">Kami sedang menyiapkan kue-kue spesial untuk Anda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {cakes.map((cake) => (
                <div
                  key={cake.id}
                  className="group card-natural overflow-hidden hover:shadow-md transition"
                >
                  <div className="relative h-48 overflow-hidden bg-neutral-100">
                    <Image
                      src={cake.imageUrl}
                      alt={cake.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="bg-green-500 text-white px-2 py-0.5 rounded-natural text-xs font-medium">
                        Ready
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-semibold text-base mb-2 text-neutral-800 truncate">
                      {cake.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="text-xs text-neutral-500 mb-0.5">Harga</div>
                        <p className="text-primary-600 font-bold text-lg">
                          Rp {cake.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="flex text-yellow-500 text-xs">
                        {"★".repeat(5)}
                      </div>
                    </div>
                    <Link
                      href={`/order?cakeId=${cake.id}`}
                      className="block w-full text-center btn-primary text-sm"
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

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-3">
              Kenapa Memilih Kami?
            </h2>
            <p className="text-neutral-600">Kami berkomitmen memberikan yang terbaik untuk Anda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 card-natural">
              <div className="w-16 h-16 bg-accent-cream rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎂</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Selalu Fresh</h3>
              <p className="text-neutral-600 text-sm">
                Setiap kue dibuat fresh setiap hari dengan bahan pilihan berkualitas premium untuk kesegaran maksimal
              </p>
            </div>
            <div className="text-center p-6 card-natural">
              <div className="w-16 h-16 bg-accent-rose rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">💝</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Dibuat dengan Cinta</h3>
              <p className="text-neutral-600 text-sm">
                Setiap produk dibuat dengan penuh perhatian dan kasih sayang, seperti kue buatan rumah sendiri
              </p>
            </div>
            <div className="text-center p-6 card-natural">
              <div className="w-16 h-16 bg-accent-tan rounded-natural flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="font-display font-bold text-lg mb-2 text-neutral-800">Proses Cepat</h3>
              <p className="text-neutral-600 text-sm">
                Sistem pemesanan online yang mudah dan cepat, langsung dari smartphone Anda kapan saja
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 bg-primary-500">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Siap Memesan Kue Lezat?
          </h2>
          <p className="text-base md:text-lg text-white/90 mb-6">
            Jangan tunggu lagi! Pesan sekarang dan nikmati kelezatan kue homemade kami
          </p>
          <a
            href="#menu"
            className="inline-block bg-white text-primary-600 font-semibold py-3 px-8 rounded-natural transition hover:bg-neutral-50"
          >
            Mulai Pesan Sekarang
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer id="kontak" className="bg-neutral-900 text-white py-10 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-3xl">🧁</span>
                <h3 className="text-xl font-display font-bold">Toko Kue UMKM</h3>
              </div>
              <p className="text-neutral-400 text-sm">
                Menghadirkan kue tradisional berkualitas untuk setiap momen spesial Anda
              </p>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Menu</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><a href="#tentang" className="hover:text-white transition">Tentang Kami</a></li>
                <li><a href="#menu" className="hover:text-white transition">Menu Kue</a></li>
                <li><Link href="/order" className="hover:text-white transition">Cara Pesan</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Kontak</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li>WhatsApp: 0812-3456-7890</li>
                <li>Email: info@tokokueumkm.com</li>
                <li>Alamat: Samata, Gowa</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-6 text-center">
            <p className="text-neutral-400 text-sm">
              © 2026 Toko Kue UMKM. Semua hak dilindungi.
            </p>
            <div className="mt-3">
              <Link href="/login" className="text-primary-400 hover:text-primary-300 transition text-xs">
                Portal Penjual
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
