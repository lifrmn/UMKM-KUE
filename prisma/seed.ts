import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('umkmkue123', 10);
  
  const seller = await prisma.user.upsert({
    where: { email: 'kuetradisional@penjual' },
    update: {},
    create: {
      email: 'kuetradisional@penjual',
      password: hashedPassword,
      name: 'Admin Toko Kue',
      role: 'seller',
    },
  });

  console.log('✅ Akun penjual berhasil dibuat:', seller.email);
  console.log('📧 Email: kuetradisional@penjual');
  console.log('🔑 Password: umkmkue123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
