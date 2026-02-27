import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

/**
 * @swagger
 * /api/profile:
 *   post:
 *     tags: [Profile]
 *     summary: Create a new profile with empty LinkedIn data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, firstName, lastName]
 *             properties:
 *               name: { type: string }
 *               firstName: { type: string }
 *               lastName: { type: string }
 *     responses:
 *       201:
 *         description: Created
 */
export async function POST(req: NextRequest) {
  const { name, firstName, lastName } = await req.json()

  const profile = await prisma.profile.create({
    data: {
      name,
      linkedin: {
        create: {
          firstName,
          lastName,
          headline: '',
          location: '',
          country: '',
          summary: '',
          profileUrl: '',
        },
      },
    },
    include: { linkedin: true },
  })

  return NextResponse.json(profile, { status: 201 })
}
