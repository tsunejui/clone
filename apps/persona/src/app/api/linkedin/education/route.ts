import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin/education:
 *   get:
 *     tags: [Education]
 *     summary: List all education entries
 *     responses:
 *       200:
 *         description: List of education
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const educations = await prisma.education.findMany({
    where: { linkedInId: profile.linkedin.id },
    orderBy: { startYear: 'desc' },
  })

  return NextResponse.json(educations)
}

/**
 * @swagger
 * /api/linkedin/education:
 *   post:
 *     tags: [Education]
 *     summary: Add an education entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [school, degree, field, startYear]
 *             properties:
 *               school: { type: string }
 *               degree: { type: string }
 *               field: { type: string }
 *               startYear: { type: integer }
 *               endYear: { type: integer }
 *               current: { type: boolean }
 *               description: { type: string }
 *               grade: { type: string }
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
  const created = await prisma.education.create({
    data: { ...body, linkedInId: profile.linkedin.id },
  })

  return NextResponse.json(created, { status: 201 })
}
