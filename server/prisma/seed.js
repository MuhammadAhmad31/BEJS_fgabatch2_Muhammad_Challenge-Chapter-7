import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  const adminRole = await prisma.role.create({
    data: {
      name: 'ADMIN',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'USER',
    },
  });

  await prisma.user.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: 'Admin User',
      email: 'ahmadsilva7@gmail.com',
      roleId: adminRole.id,
    },
  });

  await prisma.user.create({
    data: {
      username: 'user',
      password: hashedPassword,
      name: 'Normal User',
      email: 'masruhanmasruhan19@gmail.com',
      roleId: userRole.id,
    },
  });

  console.log('Seeding completed.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
