'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

interface Order {
  id: string;
  customerName: string;
  whatsappNumber: string;
  pickupDate: string;
  pickupTime: string;
  paymentProofUrl: string;
  status: string;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    cakeName: string;
    cakePrice: number;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      toast.error("Gagal memuat pesanan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Gagal mengupdate status");

      toast.success("Status pesanan berhasil diupdate");
      fetchOrders();
    } catch (error) {
      toast.error("Gagal mengupdate status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "menunggu":
        return "bg-yellow-500";
      case "diproses":
        return "bg-blue-500";
      case "selesai":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateTotal = (orderItems: Order['orderItems']) => {
    return orderItems.reduce((total, item) => total + (item.cakePrice * item.quantity), 0);
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-display font-bold text-gray-800 mb-8">Daftar Pesanan</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg">Belum ada pesanan masuk</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-display font-bold text-xl mb-2">{order.customerName}</h3>
                    <p className="text-gray-600">
                      📱 WhatsApp: <a href={`https://wa.me/${order.whatsappNumber.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">{order.whatsappNumber}</a>
                    </p>
                    <p className="text-gray-600">
                      📅 Ambil: {new Date(order.pickupDate).toLocaleDateString('id-ID')} jam {order.pickupTime}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Dipesan: {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div>
                    <span className={`px-4 py-2 rounded-full text-white font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <h4 className="font-semibold mb-3">Detail Pesanan:</h4>
                  <div className="space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span>{item.cakeName} x {item.quantity}</span>
                        <span className="font-semibold">Rp {(item.cakePrice * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary-600">Rp {calculateTotal(order.orderItems).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Bukti Pembayaran:</p>
                    <button
                      onClick={() => setSelectedImage(order.paymentProofUrl)}
                      className="relative h-24 w-24 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-primary-500 transition"
                    >
                      <Image
                        src={order.paymentProofUrl}
                        alt="Bukti Pembayaran"
                        fill
                        className="object-cover"
                      />
                    </button>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Ubah Status:</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, "menunggu")}
                        disabled={order.status === "menunggu"}
                        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Menunggu
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "diproses")}
                        disabled={order.status === "diproses"}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Diproses
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "selesai")}
                        disabled={order.status === "selesai"}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Selesai
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Bukti Pembayaran"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
