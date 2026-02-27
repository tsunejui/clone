import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin/certifications:
 *   get:
 *     tags: [Certifications]
 *     summary: List all certifications
 *     responses:
 *       200:
 *         description: List of certifications
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const certs = await prisma.certification.findMany({
    where: { linkedInId: profile.linkedin.id },
    orderBy: { issueDate: 'desc' },
  })

  return NextResponse.json(certs)
}

/**
 * @swagger
 * /api/linkedin/certifications:
 *   post:
 *     tags: [Certifications]
 *     summary: Add a certification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, issuer, issueDate]
 *             properties:
 *               name: { type: string }
 *               issuer: { type: string }
 *               issueDate: { type: string, format: date }
 *               expiryDate: { type: string, format: date }
 *               credentialId: { type: string }
 *               credentialUrl: { type: string }
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
  const created = await prisma.certification.create({
    data: { ...body, linkedInId: profile.linkedin.id },
  })

  return NextResponse.json(created, { status: 201 })
}
