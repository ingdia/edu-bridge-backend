import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@edubridge.rw';
  const password = 'Admin@2025!';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Admin already exists:', email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
      adminProfile: {
        create: {
          permissions: ['ALL'],
        },
      },
    },
  });

  console.log('✅ Admin created:');
  console.log('   Email   :', email);
  console.log('   Password:', password);
  console.log('   ID      :', user.id);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
