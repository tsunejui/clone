import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin/skills:
 *   get:
 *     tags: [Skills]
 *     summary: List all skills
 *     responses:
 *       200:
 *         description: List of skills ordered by position
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const skills = await prisma.skill.findMany({
    where: { linkedInId: profile.linkedin.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(skills)
}

/**
 * @swagger
 * /api/linkedin/skills:
 *   post:
 *     tags: [Skills]
 *     summary: Add a skill
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *               endorsements: { type: integer }
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
  const count = await prisma.skill.count({ where: { linkedInId: profile.linkedin.id } })
  const created = await prisma.skill.create({
    data: { ...body, linkedInId: profile.linkedin.id, order: count },
  })

  return NextResponse.json(created, { status: 201 })
}
