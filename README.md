# Toko Kue UMKM 🧁

Website fullstack untuk toko kue UMKM dengan Next.js 14 (App Router), PostgreSQL (Neon), dan Prisma ORM.

## Fitur Utama

### Untuk Penjual (Admin)
- 🔐 Sistem autentikasi (login/register)
- 🍰 CRUD menu kue (tambah, edit, hapus)
- 💳 Manajemen rekening pembayaran
- 📦 Kelola pesanan pelanggan
- 📊 Dashboard admin yang lengkap

### Untuk Pelanggan
- 🏠 Halaman utama dengan daftar menu kue
- 🛒 Sistem pemesanan kue
- 📸 Upload bukti pembayaran
- 📅 Pilih tanggal dan jam pengambilan
- 💬 Kontak WhatsApp untuk konfirmasi

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Image Upload:** Cloudinary
- **UI:** React Hot Toast untuk notifikasi

## Setup Instalasi

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables

Salin file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Edit file `.env` dengan kredensial Anda:

```env
# Database - sudah dikonfigurasi untuk Neon
DATABASE_URL="postgresql://neondb_owner:npg_I6yWPuCk8XYA@ep-lively-lab-a1wz18z0-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Cloudinary - Daftar di https://cloudinary.com
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup Cloudinary

1. Daftar akun gratis di [Cloudinary](https://cloudinary.com)
2. Setelah login, buka Dashboard
3. Copy **Cloud Name**, **API Key**, dan **API Secret**
4. Paste ke file `.env`

### 4. Setup Database

Jalankan Prisma migration untuk membuat tabel di database:

```bash
npx prisma generate
npx prisma db push
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Struktur Folder

```
├── app/
│   ├── api/                 # API Routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── cakes/          # CRUD kue
│   │   ├── orders/         # Kelola pesanan
│   │   └── payment-accounts/ # Rekening pembayaran
│   ├── dashboard/          # Halaman dashboard penjual
│   │   ├── cakes/          # Kelola menu kue
│   │   ├── orders/         # Kelola pesanan
│   │   └── payment/        # Kelola rekening
│   ├── login/              # Halaman login
│   ├── register/           # Halaman register
│   ├── order/              # Halaman pemesanan
│   └── page.tsx            # Homepage (landing page)
├── components/
│   └── dashboard/          # Komponen untuk dashboard
├── lib/
│   ├── auth.ts            # Konfigurasi NextAuth
│   ├── cloudinary.ts      # Fungsi upload gambar
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
└── types/
    └── next-auth.d.ts     # TypeScript types
```

## Cara Menggunakan

### Untuk Penjual

1. **Registrasi Akun**
   - Buka `/register`
   - Isi form registrasi
   - Login dengan akun yang dibuat

2. **Tambah Menu Kue**
   - Login ke dashboard
   - Buka menu "Menu Kue"
   - Klik "Tambah Kue"
   - Isi detail kue dan upload foto

3. **Setup Rekening Pembayaran**
   - Buka menu "Rekening"
   - Tambah rekening bank Anda
   - Rekening ini akan ditampilkan ke pelanggan

4. **Kelola Pesanan**
   - Buka menu "Pesanan"
   - Lihat pesanan masuk
   - Update status pesanan (menunggu → diproses → selesai)
   - Lihat bukti pembayaran

### Untuk Pelanggan

1. **Lihat Menu**
   - Buka homepage
   - Browse menu kue yang tersedia

2. **Pesan Kue**
   - Klik "Pesan Sekarang" pada kue yang diinginkan
   - Atau pilih beberapa kue sekaligus di halaman order
   - Atur jumlah pesanan

3. **Isi Data Pesanan**
   - Nama lengkap
   - Nomor WhatsApp
   - Tanggal dan jam pengambilan

4. **Upload Bukti Pembayaran**
   - Transfer ke rekening yang ditampilkan
   - Upload bukti transfer
   - Kirim pesanan

## Deploy ke Production

### Vercel (Recommended)

1. Push kode ke GitHub
2. Import project di [Vercel](https://vercel.com)
3. Set environment variables di Vercel dashboard
4. Deploy!

### Environment Variables untuk Production

Jangan lupa set semua environment variables di platform hosting:
- `DATABASE_URL`
- `NEXTAUTH_URL` (ganti dengan domain production)
- `NEXTAUTH_SECRET` (gunakan secret yang kuat)
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Database Production

Database PostgreSQL dari Neon sudah siap untuk production. Pastikan:
- Connection pooling sudah aktif (sudah ada di connection string)
- SSL mode sudah enabled

## Troubleshooting

### Error: Prisma Client tidak ditemukan
```bash
npx prisma generate
```

### Error: Database connection failed
- Pastikan DATABASE_URL sudah benar
- Cek koneksi internet
- Pastikan Neon database masih aktif

### Error: Upload gambar gagal
- Pastikan kredensial Cloudinary sudah benar
- Cek ukuran file (max recommended: 5MB)

## Keamanan

- Password di-hash dengan bcrypt
- Session menggunakan JWT
- Database menggunakan SSL
- CORS sudah dikonfigurasi
- Environment variables tidak ter-commit ke git

## License

MIT