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
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Kue berhasil dihapus");
      fetchCakes();
    } catch (error) {
      toast.error("Gagal menghapus kue");
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
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-800">Menu Kue</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
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
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🍰</div>
          <p className="text-gray-600 text-lg">Belum ada menu kue. Tambahkan menu pertama Anda!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cakes.map((cake) => (
            <div key={cake.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48">
                <Image
                  src={cake.imageUrl}
                  alt={cake.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    cake.isAvailable 
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {cake.isAvailable ? "Ready" : "Tidak Ready"}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-display font-bold text-lg mb-2">{cake.name}</h3>
                <p className="text-primary-600 font-bold text-xl mb-4">
                  Rp {cake.price.toLocaleString("id-ID")}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(cake)}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cake.id)}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
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
