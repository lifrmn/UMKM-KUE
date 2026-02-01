'use client';

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PaymentAccountForm from "@/components/dashboard/PaymentAccountForm";

interface PaymentAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function PaymentPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<PaymentAccount | null>(null);

  const fetchAccounts = async () => {
    try {
      const res = await fetch("/api/payment-accounts");
      if (!res.ok) throw new Error("Gagal memuat data");
      const data = await res.json();
      setAccounts(data);
    } catch (error) {
      toast.error("Gagal memuat data rekening");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus rekening ini?")) return;

    try {
      const res = await fetch(`/api/payment-accounts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Gagal menghapus");

      toast.success("Rekening berhasil dihapus");
      fetchAccounts();
    } catch (error) {
      toast.error("Gagal menghapus rekening");
    }
  };

  const handleEdit = (account: PaymentAccount) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAccount(null);
    fetchAccounts();
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-800">Rekening Pembayaran</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg transition shadow-lg"
        >
          + Tambah Rekening
        </button>
      </div>

      {showForm && (
        <PaymentAccountForm
          account={editingAccount}
          onClose={handleFormClose}
        />
      )}

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">💳</div>
          <p className="text-gray-600 text-lg">Belum ada rekening. Tambahkan rekening pembayaran Anda!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => (
            <div key={account.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl mb-3 text-gray-800">
                    {account.bankName}
                  </h3>
                  <div className="space-y-2 text-gray-600">
                    <p>
                      <span className="font-semibold">Nomor Rekening:</span>{" "}
                      <span className="text-lg font-mono">{account.accountNumber}</span>
                    </p>
                    <p>
                      <span className="font-semibold">Atas Nama:</span>{" "}
                      <span className="text-lg">{account.accountName}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(account)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
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
