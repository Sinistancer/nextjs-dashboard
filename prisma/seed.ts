import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { users, customers, invoices, revenue } from '../app/lib/placeholder-data';

export const prisma = new PrismaClient();
export default prisma;

async function main() {
  console.log('Seeding started...');

  // Seed Users
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
      },
    });
  }

  // Seed Customers
  for (const customer of customers) {
    await prisma.customer.upsert({
      where: { id: customer.id },
      update: {},
      create: customer,
    });
  }

  // Seed Invoices
  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: invoice,
    });
  }

  // Seed Revenue
  for (const entry of revenue) {
    await prisma.revenue.upsert({
      where: { month: entry.month },
      update: {},
      create: entry,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
