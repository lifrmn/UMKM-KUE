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
      <div className="mb-6">
        <h1 className="text-3xl font-display font-bold text-neutral-900 mb-1">
          Selamat Datang, {session?.user.name}!
        </h1>
        <p className="text-neutral-600">Berikut ringkasan bisnis Anda hari ini</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Menu</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{totalCakes}</h3>
            </div>
            <div className="bg-blue-50 p-2 rounded-natural">
              <span className="text-2xl">🍰</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Menu kue aktif</p>
        </div>

        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Pesanan</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{totalOrders}</h3>
            </div>
            <div className="bg-green-50 p-2 rounded-natural">
              <span className="text-2xl">📦</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Semua waktu</p>
        </div>

        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Menunggu</p>
              <h3 className="text-2xl font-bold mt-1 text-neutral-900">{pendingOrders}</h3>
            </div>
            <div className="bg-yellow-50 p-2 rounded-natural">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Pesanan pending</p>
        </div>

        <div className="card-natural p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Pendapatan</p>
              <h3 className="text-xl font-bold mt-1 text-neutral-900">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
            </div>
            <div className="bg-purple-50 p-2 rounded-natural">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <p className="text-neutral-600 text-xs">Pesanan selesai</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Link href="/dashboard/cakes">
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="flex items-center mb-3">
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">🍰</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">Menu Kue</h2>
                <p className="text-xs text-neutral-500">Kelola produk</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              Tambah, edit, dan hapus menu kue Anda
            </p>
          </div>
        </Link>

        <Link href="/dashboard/payment">
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="flex items-center mb-3">
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">💳</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">Rekening</h2>
                <p className="text-xs text-neutral-500">Info pembayaran</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              Kelola informasi rekening pembayaran
            </p>
          </div>
        </Link>

        <Link href="/dashboard/orders">
          <div className="card-natural p-5 hover:shadow-md transition cursor-pointer border-2 border-transparent hover:border-primary-500">
            <div className="flex items-center mb-3">
              <div className="bg-primary-50 p-3 rounded-natural mr-3">
                <span className="text-3xl">📦</span>
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-neutral-800">Pesanan</h2>
                <p className="text-xs text-neutral-500">Kelola order</p>
              </div>
            </div>
            <p className="text-neutral-600 text-sm">
              Lihat dan kelola pesanan pelanggan
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="card-natural p-5">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-display font-bold text-neutral-800">Pesanan Terbaru</h2>
          <Link href="/dashboard/orders" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
            Lihat Semua →
          </Link>
        </div>
        
        {recentOrders.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <span className="text-4xl mb-2 block">📭</span>
            <p className="text-sm">Belum ada pesanan masuk</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-natural hover:bg-neutral-100 transition border border-neutral-200">
                <div className="flex-1">
                  <h3 className="font-semibold text-neutral-800 text-sm">{order.customerName}</h3>
                  <p className="text-xs text-neutral-600">
                    {order.orderItems.length} item • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="font-bold text-neutral-800 text-sm">
                    Rp {order.orderItems.reduce((sum: number, item: any) => sum + (item.cakePrice * item.quantity), 0).toLocaleString('id-ID')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-natural text-xs font-medium ${
                  order.status === 'menunggu' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                  order.status === 'diproses' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                  'bg-green-100 text-green-800 border border-green-200'
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
