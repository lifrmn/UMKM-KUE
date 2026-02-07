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
    <div className="min-h-screen bg-neutral-50 py-6 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-6">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center">
            ← Kembali ke Beranda
          </Link>
          <h1 className="text-3xl font-display font-bold text-neutral-900 mt-3">
            Pesan Kue
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column - Available Cakes */}
          <div className="lg:col-span-1">
            <div className="card-natural p-5 lg:sticky lg:top-4">
              <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                Pilih Kue
              </h2>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {cakes.map((cake) => (
                  <div
                    key={cake.id}
                    className="flex items-center gap-3 p-3 border border-neutral-200 rounded-natural hover:border-primary-500 transition cursor-pointer"
                    onClick={() => addToCart(cake)}
                  >
                    <div className="relative w-16 h-16 rounded-natural overflow-hidden flex-shrink-0">
                      <Image
                        src={cake.imageUrl}
                        alt={cake.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-neutral-800 text-sm truncate">{cake.name}</h3>
                      <p className="text-primary-600 font-bold text-sm">
                        Rp {cake.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <button className="text-primary-500 hover:text-primary-600 text-2xl flex-shrink-0 w-8">
                      +
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card-natural p-5 space-y-5">
              {/* Cart */}
              <div>
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Keranjang Pesanan
                </h2>
                {cart.length === 0 ? (
                  <div className="bg-neutral-100 rounded-natural p-8 text-center">
                    <p className="text-neutral-600 text-sm">Belum ada kue dipilih</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.cake.id} className="flex items-center gap-3 p-3 border border-neutral-200 rounded-natural">
                        <div className="relative w-16 h-16 rounded-natural overflow-hidden flex-shrink-0">
                          <Image
                            src={item.cake.imageUrl}
                            alt={item.cake.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-800 text-sm truncate">{item.cake.name}</h3>
                          <p className="text-primary-600 font-bold text-sm">
                            Rp {item.cake.price.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity - 1)}
                            className="w-8 h-8 bg-neutral-200 hover:bg-neutral-300 rounded-natural font-bold"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.cake.id, item.quantity + 1)}
                            className="w-8 h-8 bg-primary-500 hover:bg-primary-600 text-white rounded-natural font-bold"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cake.id)}
                          className="text-red-500 hover:text-red-600 text-xl flex-shrink-0"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-4 border-t border-neutral-200 text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-primary-600">
                        Rp {calculateTotal().toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="border-t border-neutral-200 pt-5">
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Data Pembeli
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nomor WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Tanggal Ambil *
                      </label>
                      <input
                        type="date"
                        required
                        min={minDate}
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Jam Ambil *
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.pickupTime}
                        onChange={(e) => setFormData({ ...formData, pickupTime: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="border-t border-neutral-200 pt-5">
                <h2 className="text-xl font-display font-bold text-neutral-800 mb-4">
                  Pembayaran
                </h2>
                
                {paymentAccount ? (
                  <div className="bg-accent-cream rounded-natural p-5 mb-4">
                    <p className="text-sm text-neutral-600 mb-3">Transfer ke rekening berikut:</p>
                    <div className="space-y-2">
                      <p className="font-bold text-lg">{paymentAccount.bankName}</p>
                      <p className="font-mono text-xl text-primary-600 break-all">{paymentAccount.accountNumber}</p>
                      <p className="text-sm text-neutral-700">a.n. <span className="font-semibold">{paymentAccount.accountName}</span></p>
                    </div>
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-natural">
                      <p className="text-sm text-yellow-800">
                        Total yang harus dibayar: <span className="font-bold">Rp {calculateTotal().toLocaleString("id-ID")}</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-natural p-4 mb-4">
                    <p className="text-red-600 text-sm">Informasi rekening belum tersedia</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Upload Bukti Pembayaran *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={handlePaymentProofChange}
                    className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500"
                  />
                  {paymentProofPreview && (
                    <div className="mt-3">
                      <img
                        src={paymentProofPreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-natural"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || cart.length === 0 || !paymentAccount}
                className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed text-base"
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
