'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Login berhasil!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi kesalahan. Silakan coba lagi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <div className="w-full max-w-md">
        <div className="card-natural p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🧁</div>
            <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">
              Toko Kue UMKM
            </h1>
            <p className="text-neutral-600 text-sm">Portal Penjual</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Email / Username
              </label>
              <input
                type="text"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan email atau username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-natural border border-neutral-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? "Memproses..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-primary-600 text-sm hover:text-primary-700">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
