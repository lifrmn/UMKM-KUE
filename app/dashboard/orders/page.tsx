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
    <div className="max-w-7xl mx-auto px-3 sm:px-4">
      <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-800 mb-6 sm:mb-8">Daftar Pesanan</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
          <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
          <p className="text-gray-600 text-base sm:text-lg">Belum ada pesanan masuk</p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4">
                  <div className="flex-1">
                    <h3 className="font-display font-bold text-lg sm:text-xl mb-2">{order.customerName}</h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      📱 WhatsApp: <a href={`https://wa.me/${order.whatsappNumber.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline break-all">{order.whatsappNumber}</a>
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      📅 Ambil: {new Date(order.pickupDate).toLocaleDateString('id-ID')} jam {order.pickupTime}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">
                      Dipesan: {new Date(order.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <div className="w-full sm:w-auto">
                    <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-white font-semibold text-sm ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-b py-3 sm:py-4 my-3 sm:my-4">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Detail Pesanan:</h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm sm:text-base">
                        <span className="flex-1">{item.cakeName} x {item.quantity}</span>
                        <span className="font-semibold whitespace-nowrap ml-2">Rp {(item.cakePrice * item.quantity).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t font-bold text-base sm:text-lg">
                      <span>Total:</span>
                      <span className="text-primary-600">Rp {calculateTotal(order.orderItems).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
                  <div className="w-full sm:w-auto">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Bukti Pembayaran:</p>
                    <button
                      onClick={() => setSelectedImage(order.paymentProofUrl)}
                      className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-primary-500 active:border-primary-600 transition"
                    >
                      <Image
                        src={order.paymentProofUrl}
                        alt="Bukti Pembayaran"
                        fill
                        className="object-cover"
                      />
                    </button>
                  </div>

                  <div className="flex-1 w-full">
                    <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Ubah Status:</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleStatusChange(order.id, "menunggu")}
                        disabled={order.status === "menunggu"}
                        className="flex-1 min-w-[90px] px-3 sm:px-4 py-2 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        Menunggu
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "diproses")}
                        disabled={order.status === "diproses"}
                        className="flex-1 min-w-[90px] px-3 sm:px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                      >
                        Diproses
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, "selesai")}
                        disabled={order.status === "selesai"}
                        className="flex-1 min-w-[90px] px-3 sm:px-4 py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-3 sm:p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-8 sm:-top-10 right-0 text-white text-2xl sm:text-3xl hover:text-gray-300"
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
