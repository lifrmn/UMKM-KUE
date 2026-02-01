'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface Cake {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface CartItem {
  cake: Cake;
  quantity: number;
}

function OrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cakeId = searchParams.get("cakeId");

  const [cakes, setCakes] = useState<Cake[]>([]);
  const [paymentAccount, setPaymentAccount] = useState<PaymentAccount | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    customerName: "",
    whatsappNumber: "",
    pickupDate: "",
    pickupTime: "",
  });
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (cakeId && cakes.length > 0) {
      const cake = cakes.find(c => c.id === cakeId);
      if (cake && !cart.some(item => item.cake.id === cakeId)) {
        setCart([{ cake, quantity: 1 }]);
      }
    }
  }, [cakeId, cakes]);

  const fetchData = async () => {
    try {
      const [cakesRes, paymentRes] = await Promise.all([
        fetch("/api/cakes/available"),
        fetch("/api/payment-accounts/public")
      ]);

      const cakesData = await cakesRes.json();
      const paymentData = await paymentRes.json();

      setCakes(cakesData);
      
      // Pastikan paymentData adalah objek, bukan array
      if (paymentData && !paymentData.error) {
        setPaymentAccount(paymentData);
      } else {
        setPaymentAccount(null);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data");
    }
  };

  const addToCart = (cake: Cake) => {
    const existing = cart.find(item => item.cake.id === cake.id);
    if (existing) {
      setCart(cart.map(item =>
        item.cake.id === cake.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { cake, quantity: 1 }]);
    }
    toast.success(`${cake.name} ditambahkan ke pesanan`);
  };

  const updateQuantity = (cakeId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cakeId);
      return;
    }
    setCart(cart.map(item =>
      item.cake.id === cakeId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (cakeId: string) => {
    setCart(cart.filter(item => item.cake.id !== cakeId));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.cake.price * item.quantity), 0);
  };

  const handlePaymentProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProof(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Keranjang pesanan masih kosong");
      return;
    }

    if (!paymentProof) {
      toast.error("Bukti pembayaran wajib diunggah");
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("customerName", formData.customerName);
      formDataToSend.append("whatsappNumber", formData.whatsappNumber);
      formDataToSend.append("pickupDate", formData.pickupDate);
      formDataToSend.append("pickupTime", formData.pickupTime);
      formDataToSend.append("paymentProof", paymentProof);

      const orderItems = cart.map(item => ({
        cakeId: item.cake.id,
        quantity: item.quantity,
        cakeName: item.cake.name,
        cakePrice: item.cake.price,
      }));

      formDataToSend.append("orderItems", JSON.stringify(orderItems));

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal membuat pesanan");
      }

      toast.success("Pesanan berhasil dibuat! Terima kasih 🎉");
      
      // Reset form
      setCart([]);
      setFormData({
        customerName: "",
        whatsappNumber: "",
        pickupDate: "",
        pickupTime: "",
      });
      setPaymentProof(null);
      setPaymentProofPreview("");

      // Redirect to home
      setTimeout(() => {
        router.push("/");
      }, 2000);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Get tomorrow's date as minimum pickup date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bakery-cream via-white to-bakery-peach py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-4xl font-display font-bold text-gray-800 mt-4">
            Pesan Kue 🎂
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Available Cakes */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                Pilih Kue
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {cakes.map((cake) => (
                  <div
                    key={cake.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary-500 transition cursor-pointer"
                    onClick={() => addToCart(cake)}
                  >
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={cake.imageUrl}
                        alt={cake.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{cake.name}</h3>
                      <p className="text-primary-600 font-bold">
                        Rp {cake.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button className="text-primary-500 hover:text-primary-600 text-2xl">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 space-y-6">
              {/* Cart */}
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                  Keranjang Pesanan
                </h2>
                {cart.length === 0 ? (
                  <div className="bg-bakery-cream rounded-lg p-8 text-center">
                    <p className="text-gray-600">Belum ada kue dipilih</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.cake.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.cake.imageUrl}
                            alt={item.cake.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{item.cake.name}</h3>
                          <p className="text-primary-600 font-bold">
                            Rp {item.cake.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity - 1)}
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full font-bold"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity + 1)}
                            className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-full font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cake.id)}
                          className="text-red-500 hover:text-red-600 text-xl"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t-2 text-xl font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                  Data Pembeli
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Ambil *
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Jam Ambil *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t pt-6">
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                  Pembayaran
                </h2>
                
                {paymentAccount ? (
                  <div className="bg-bakery-cream rounded-lg p-6 mb-4">
                    <p className="text-sm text-gray-600 mb-3">Transfer ke rekening berikut:</p>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">{paymentAccount.bankName}</p>
                      <p className="font-mono text-2xl text-primary-600">{paymentAccount.accountNumber}</p>
                      <p className="text-gray-700">a.n. <span className="font-semibold">{paymentAccount.accountName}</span></p>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        💡 Total yang harus dibayar: <span className="font-bold">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-600">Informasi rekening belum tersedia</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Bukti Pembayaran *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handlePaymentProofChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500"
                  />
                  {paymentProofPreview && (
                    <div className="mt-3">
                      <img
                        src={paymentProofPreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || cart.length === 0 || !paymentAccount}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-4 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
              >
                {isLoading ? "Mengirim Pesanan..." : "Kirim Pesanan"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}
