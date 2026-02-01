import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  // Get statistics
  const [totalCakes, totalOrders, pendingOrders, totalRevenue] = await Promise.all([
    prisma.cake.count({ where: { userId: session?.user.id } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "menunggu" } }),
    prisma.order.findMany({
      where: { status: "selesai" },
      include: { orderItems: true }
    }).then((orders: any) => 
      orders.reduce((total: number, order: any) => 
        total + order.orderItems.reduce((sum: number, item: any) => 
          sum + (item.cakePrice * item.quantity), 0
        ), 0
      )
    ),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { orderItems: true }
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-800 mb-2">
          Selamat Datang, {session?.user.name}! 👋
        </h1>
        <p className="text-gray-600">Berikut ringkasan bisnis Anda hari ini</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Menu</p>
              <h3 className="text-3xl font-bold mt-1">{totalCakes}</h3>
            </div>
            <div className="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
              <span className="text-3xl">🍰</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm">Menu kue aktif</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Pesanan</p>
              <h3 className="text-3xl font-bold mt-1">{totalOrders}</h3>
            </div>
            <div className="bg-green-400 bg-opacity-30 p-3 rounded-lg">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <p className="text-green-100 text-sm">Semua waktu</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-yellow-100 text-sm font-medium">Menunggu</p>
              <h3 className="text-3xl font-bold mt-1">{pendingOrders}</h3>
            </div>
            <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-lg">
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <p className="text-yellow-100 text-sm">Pesanan pending</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Pendapatan</p>
              <h3 className="text-2xl font-bold mt-1">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
            </div>
            <div className="bg-purple-400 bg-opacity-30 p-3 rounded-lg">
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <p className="text-purple-100 text-sm">Pesanan selesai</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link href="/dashboard/cakes">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-primary-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-4 rounded-lg mr-4">
                <span className="text-4xl">🍰</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-800">Menu Kue</h2>
                <p className="text-sm text-gray-500">Kelola produk</p>
              </div>
            </div>
            <p className="text-gray-600">
              Tambah, edit, dan hapus menu kue Anda
            </p>
          </div>
        </Link>

        <Link href="/dashboard/payment">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-primary-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-4 rounded-lg mr-4">
                <span className="text-4xl">💳</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-800">Rekening</h2>
                <p className="text-sm text-gray-500">Info pembayaran</p>
              </div>
            </div>
            <p className="text-gray-600">
              Kelola informasi rekening pembayaran
            </p>
          </div>
        </Link>

        <Link href="/dashboard/orders">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-primary-500 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className="bg-primary-100 p-4 rounded-lg mr-4">
                <span className="text-4xl">📦</span>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-gray-800">Pesanan</h2>
                <p className="text-sm text-gray-500">Kelola order</p>
              </div>
            </div>
            <p className="text-gray-600">
              Lihat dan kelola pesanan pelanggan
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-display font-bold text-gray-800">Pesanan Terbaru</h2>
          <Link href="/dashboard/orders" className="text-primary-600 hover:text-primary-700 font-semibold">
            Lihat Semua →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-5xl mb-3 block">📭</span>
            <p>Belum ada pesanan masuk</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{order.customerName}</h3>
                  <p className="text-sm text-gray-600">
                    {order.orderItems.length} item • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-gray-800">
                    Rp {order.orderItems.reduce((sum: number, item: any) => sum + (item.cakePrice * item.quantity), 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'diproses' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
