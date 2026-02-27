import { PrismaClient } from '@prisma/client'
import { readFileSync } from 'fs'
import { parse } from 'yaml'

const prisma = new PrismaClient()

function toDate(value: string | undefined): Date | undefined {
  return value ? new Date(value) : undefined
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: tsx prisma/import.ts <yaml-file>')
    process.exit(1)
  }

  const raw = readFileSync(filePath, 'utf-8')
  const data = parse(raw)
  const li = data.linkedin

  console.log(`Importing profile: ${data.name}`)

  // Delete existing profile with same name
  const existing = await prisma.profile.findFirst({ where: { name: data.name } })
  if (existing) {
    console.log(`  Deleting existing profile: ${existing.id}`)
    await prisma.profile.delete({ where: { id: existing.id } })
  }

  const profile = await prisma.profile.create({
    data: {
      name: data.name,
      linkedin: {
        create: {
          firstName: li.firstName,
          lastName: li.lastName,
          headline: li.headline,
          location: li.location,
          country: li.country,
          summary: li.summary,
          profileUrl: li.profileUrl,
          avatarUrl: li.avatarUrl,
          connections: li.connections ?? 0,
          followers: li.followers ?? 0,
          email: li.email,
          phone: li.phone,
          website: li.website,

          experiences: {
            create: (li.experiences ?? []).map((e: any, i: number) => ({
              company: e.company,
              title: e.title,
              location: e.location,
              startDate: new Date(e.startDate),
              endDate: toDate(e.endDate),
              current: e.current ?? false,
              description: e.description,
              order: i,
            })),
          },

          educations: {
            create: (li.educations ?? []).map((e: any) => ({
              school: e.school,
              degree: e.degree,
              field: e.field,
              startYear: e.startYear,
              endYear: e.endYear,
              current: e.current ?? false,
              description: e.description,
              grade: e.grade,
            })),
          },

          skills: {
            create: (li.skills ?? []).map((s: any, i: number) => ({
              name: s.name,
              category: s.category,
              endorsements: s.endorsements ?? 0,
              order: i,
            })),
          },

          certifications: {
            create: (li.certifications ?? []).map((c: any) => ({
              name: c.name,
              issuer: c.issuer,
              issueDate: new Date(c.issueDate),
              expiryDate: toDate(c.expiryDate),
              credentialId: c.credentialId,
              credentialUrl: c.credentialUrl,
            })),
          },

          languages: {
            create: (li.languages ?? []).map((l: any, i: number) => ({
              name: l.name,
              proficiency: l.proficiency,
              order: i,
            })),
          },
        },
      },
    },
  })

  console.log(`Done: profile ${profile.id} created`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
