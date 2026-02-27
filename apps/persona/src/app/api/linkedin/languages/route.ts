import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin/languages:
 *   get:
 *     tags: [Languages]
 *     summary: List all languages
 *     responses:
 *       200:
 *         description: List of languages
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const langs = await prisma.language.findMany({
    where: { linkedInId: profile.linkedin.id },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json(langs)
}

/**
 * @swagger
 * /api/linkedin/languages:
 *   post:
 *     tags: [Languages]
 *     summary: Add a language
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, proficiency]
 *             properties:
 *               name: { type: string }
 *               proficiency:
 *                 type: string
 *                 enum: [NATIVE, FULL_PROFESSIONAL, PROFESSIONAL, LIMITED_WORKING, ELEMENTARY]
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
  const count = await prisma.language.count({ where: { linkedInId: profile.linkedin.id } })
  const created = await prisma.language.create({
    data: { ...body, linkedInId: profile.linkedin.id, order: count },
  })

  return NextResponse.json(created, { status: 201 })
}
