import { PrismaClient } from '@prisma/client'
import { seedTechEngineer } from './seeds/tech-engineer'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding: tech-engineer')
  await prisma.profile.deleteMany()
  const result = await seedTechEngineer(prisma)
  console.log('Done:', result)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
