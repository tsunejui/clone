import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin/experience:
 *   get:
 *     tags: [Experience]
 *     summary: List all work experiences
 *     responses:
 *       200:
 *         description: List of experiences ordered by position
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const experiences = await prisma.experience.findMany({
    where: { linkedInId: profile.linkedin.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(experiences)
}

/**
 * @swagger
 * /api/linkedin/experience:
 *   post:
 *     tags: [Experience]
 *     summary: Add a work experience
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [company, title, startDate]
 *             properties:
 *               company: { type: string }
 *               title: { type: string }
 *               location: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               current: { type: boolean }
 *               description: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(req: NextRequest) {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const body = await req.json()
  const count = await prisma.experience.count({ where: { linkedInId: profile.linkedin.id } })
  const created = await prisma.experience.create({
    data: { ...body, linkedInId: profile.linkedin.id, order: count },
  })

  return NextResponse.json(created, { status: 201 })
}
