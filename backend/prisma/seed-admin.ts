// backend/prisma/seed-admin.ts
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// PrismaClient genauso initialisieren wie in PrismaService
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  const username = '';
  const email = '';
  const password = '';

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) {
    console.log('Admin user already exists:', existing.username);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      firstName: 'Admin',
      lastName: 'User',
      email,
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', user.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
