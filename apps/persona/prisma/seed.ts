import { PrismaClient } from '@prisma/client'
import { seedTechEngineer } from './seeds/tech-engineer'
import { seedProductManager } from './seeds/product-manager'

const prisma = new PrismaClient()

const SEED_MAP: Record<string, (p: PrismaClient) => Promise<unknown>> = {
  'tech-engineer': seedTechEngineer,
  'product-manager': seedProductManager,
}

async function main() {
  const scenario = process.env.SEED_SCENARIO ?? 'tech-engineer'
  const fn = SEED_MAP[scenario]

  if (!fn) {
    console.error(`Unknown scenario "${scenario}". Available: ${Object.keys(SEED_MAP).join(', ')}`)
    process.exit(1)
  }

  console.log(`Seeding scenario: ${scenario}`)
  await prisma.profile.deleteMany()
  const result = await fn(prisma)
  console.log('Done:', result)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
