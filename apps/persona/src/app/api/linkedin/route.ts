import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/linkedin:
 *   get:
 *     tags: [LinkedIn]
 *     summary: Get the full LinkedIn profile
 *     description: Returns the complete LinkedIn profile including all related data (experience, education, skills, certifications, languages).
 *     responses:
 *       200:
 *         description: LinkedIn profile found
 *       404:
 *         description: No profile found — run db seed first
 */
export async function GET() {
  const profile = await prisma.profile.findFirst({
    include: {
      linkedin: {
        include: {
          experiences: { orderBy: { order: 'asc' } },
          educations: { orderBy: { createdAt: 'asc' } },
          skills: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { issueDate: 'desc' } },
          languages: { orderBy: { order: 'asc' } },
        },
      },
    },
  })

  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found. Run: just db-seed' }, { status: 404 })
  }

  return NextResponse.json(profile.linkedin)
}

/**
 * @swagger
 * /api/linkedin:
 *   patch:
 *     tags: [LinkedIn]
 *     summary: Update LinkedIn basic info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName: { type: string }
 *               lastName: { type: string }
 *               headline: { type: string }
 *               location: { type: string }
 *               country: { type: string }
 *               summary: { type: string }
 *               connections: { type: integer }
 *               followers: { type: integer }
 *               email: { type: string }
 *               phone: { type: string }
 *               website: { type: string }
 *     responses:
 *       200:
 *         description: Updated successfully
 *       404:
 *         description: No profile found
 */
export async function PATCH(req: NextRequest) {
  const profile = await prisma.profile.findFirst({ include: { linkedin: true } })
  if (!profile?.linkedin) {
    return NextResponse.json({ error: 'No profile found' }, { status: 404 })
  }

  const body = await req.json()
  const updated = await prisma.linkedIn.update({
    where: { id: profile.linkedin.id },
    data: body,
  })

  return NextResponse.json(updated)
}
