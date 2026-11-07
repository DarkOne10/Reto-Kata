import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import process from 'node:process';

process.loadEnvFile();

const demoUsers = [
  {
    name: 'Administrador Demo',
    email: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
    role: UserRole.ADMIN,
  },
  {
    name: 'Postulante Demo',
    email: process.env.DEMO_APPLICANT_EMAIL,
    password: process.env.DEMO_APPLICANT_PASSWORD,
    role: UserRole.APPLICANT,
  },
];

for (const user of demoUsers) {
  if (
    !user.email ||
    !user.password ||
    user.password.length < 10 ||
    Buffer.byteLength(user.password, 'utf8') > 72
  ) {
    throw new Error('Demo user credentials are missing or invalid in .env.');
  }
}

const prisma = new PrismaClient();

try {
  for (const user of demoUsers) {
    const passwordHash = await hash(user.password, 12);
    await prisma.user.upsert({
      where: { email: user.email },
      update: { name: user.name, passwordHash, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        passwordHash,
        role: user.role,
      },
    });
    console.log(`Seeded ${user.role}: ${user.email}`);
  }
} finally {
  await prisma.$disconnect();
}