import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const genId = () => crypto.randomUUID();

async function main() {
  const defaultConfig = {
    devRoles: [
      { id: genId(), role: 'Frontend Developer', qty: 1, days: 22, dailyRate: 150000, dailyAllowance: 40000 },
      { id: genId(), role: 'Backend Developer', qty: 1, days: 22, dailyRate: 200000, dailyAllowance: 40000 }
    ],
    infraItems: [
      { id: genId(), name: 'VPS (8GB RAM, 100GB Disk)', type: 'monthly', price: 185000, ppnPercent: 11 },
      { id: genId(), name: 'Domain (.com)', type: 'yearly', price: 260000, ppnPercent: 11 }
    ],
    additionalFees: [
      { id: genId(), name: 'UI/UX Design', price: 0 },
      { id: genId(), name: 'Quality Assurance', price: 0 },
      { id: genId(), name: 'Maintenance Fee (Free 3 Bulan)', price: 0 }
    ],
    aiServices: [
      { id: genId(), name: 'AI OCR Service (e.g. Google Doc AI)', pricingModel: 'per_1000_requests', price: 25000 },
      { id: genId(), name: 'LLM API (e.g. OpenAI GPT-4o)', pricingModel: 'monthly_estimation', price: 150000 }
    ],
    licensePercent: 10
  };

  await prisma.cmsMasterData.upsert({
    where: { key: 'default_pricing' },
    update: {
      config: defaultConfig,
    },
    create: {
      key: 'default_pricing',
      config: defaultConfig,
    },
  });

  console.log('Master data seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
