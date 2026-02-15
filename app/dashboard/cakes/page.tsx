'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import CakeForm from "@/components/dashboard/CakeForm";

interface Cake {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export default function CakesPage() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCake, setEditingCake] = useState<Cake | null>(null);

  const fetchCakes = async () => {
    try {
      const res = await fetch("/api/cakes");
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setCakes(data);
    } catch (error) {
      toast.error("Gagal memuat menu kue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCakes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kue ini?")) return;

    try {
      const res = await fetch(`/api/cakes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Delete error:", errorData);
        throw new Error(errorData.error || "Gagal menghapus");
      }

      toast.success("Kue berhasil dihapus");
      fetchCakes();
    } catch (error: any) {
      console.error("Delete cake error:", error);
      toast.error(error.message || "Gagal menghapus kue");
    }
  };

  const handleEdit = (cake: Cake) => {
    setEditingCake(cake);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCake(null);
    fetchCakes();
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800">Menu Kue</h1>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white font-semibold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition shadow-lg text-sm sm:text-base"
        >
          + Tambah Kue
        </button>
      </div>

      {showForm && (
        <CakeForm
          cake={editingCake}
          onClose={handleFormClose}
        />
      )}

      {cakes.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🍰</div>
          <p className="text-gray-600 text-base sm:text-lg">Belum ada menu kue. Tambahkan menu pertama Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {cakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="relative h-40 sm:h-48">
                <Image
                  src={cake.imageUrl}
                  alt={cake.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    cake.isAvailable 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {cake.isAvailable ? "Ready" : "Tidak Ready"}
                  </span>
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="font-display font-bold text-base sm:text-lg mb-1.5 sm:mb-2 truncate">{cake.name}</h3>
                <p className="text-primary-600 font-bold text-lg sm:text-xl mb-3 sm:mb-4">
                  Rp {cake.price.toLocaleString("id-ID")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cake)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 rounded-lg transition text-sm sm:text-base"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cake.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-semibold py-2 rounded-lg transition text-sm sm:text-base"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
