import { PrismaClient } from '@prisma/client'

export async function seedTechEngineer(prisma: PrismaClient) {
  const profile = await prisma.profile.create({
    data: {
      name: 'Tech Engineer Persona',
      linkedin: {
        create: {
          firstName: 'Alex',
          lastName: 'Chen',
          headline: 'Senior Software Engineer | TypeScript · React · Node.js',
          location: 'San Francisco Bay Area',
          country: 'United States',
          summary:
            'Passionate software engineer with 8+ years of experience building scalable web applications. ' +
            'I specialize in full-stack TypeScript development and love turning complex problems into elegant solutions. ' +
            'Open source contributor and tech blog writer. Always exploring new technologies and best practices.',
          profileUrl: 'https://linkedin.com/in/alex-chen-dev',
          connections: 723,
          followers: 1240,
          email: 'alex.chen@example.com',
          website: 'https://alexchen.dev',
          experiences: {
            create: [
              {
                company: 'Stripe',
                title: 'Senior Software Engineer',
                location: 'San Francisco, CA',
                startDate: new Date('2022-03-01'),
                current: true,
                description:
                  'Leading development of payment infrastructure APIs serving 1M+ merchants. ' +
                  'Architected event-driven microservices reducing latency by 40%. ' +
                  'Mentoring junior engineers and conducting technical interviews.',
                order: 0,
              },
              {
                company: 'Airbnb',
                title: 'Software Engineer',
                location: 'San Francisco, CA',
                startDate: new Date('2019-06-01'),
                endDate: new Date('2022-02-28'),
                current: false,
                description:
                  'Built and maintained core search ranking algorithms. ' +
                  'Improved page load performance by 35% through SSR optimizations. ' +
                  'Collaborated with design and product on the redesigned listing experience.',
                order: 1,
              },
              {
                company: 'Shopify',
                title: 'Software Engineer',
                location: 'Toronto, ON (Remote)',
                startDate: new Date('2017-01-01'),
                endDate: new Date('2019-05-31'),
                current: false,
                description:
                  'Developed merchant-facing analytics dashboard used by 100K+ stores. ' +
                  'Contributed to GraphQL API schema design and implementation.',
                order: 2,
              },
            ],
          },
          educations: {
            create: [
              {
                school: 'University of California, Berkeley',
                degree: "Bachelor's Degree",
                field: 'Computer Science',
                startYear: 2013,
                endYear: 2017,
                grade: '3.8 / 4.0',
              },
            ],
          },
          skills: {
            create: [
              { name: 'TypeScript', category: 'Programming', endorsements: 87, order: 0 },
              { name: 'React', category: 'Frontend', endorsements: 74, order: 1 },
              { name: 'Node.js', category: 'Backend', endorsements: 68, order: 2 },
              { name: 'PostgreSQL', category: 'Database', endorsements: 52, order: 3 },
              { name: 'GraphQL', category: 'API', endorsements: 45, order: 4 },
              { name: 'Docker', category: 'DevOps', endorsements: 41, order: 5 },
              { name: 'AWS', category: 'Cloud', endorsements: 38, order: 6 },
              { name: 'System Design', category: 'Architecture', endorsements: 33, order: 7 },
            ],
          },
          certifications: {
            create: [
              {
                name: 'AWS Certified Solutions Architect – Associate',
                issuer: 'Amazon Web Services',
                issueDate: new Date('2023-04-01'),
                expiryDate: new Date('2026-04-01'),
                credentialId: 'AWS-SAA-C03-123456',
              },
              {
                name: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                issueDate: new Date('2022-08-01'),
                expiryDate: new Date('2024-08-01'),
              },
            ],
          },
          languages: {
            create: [
              { name: 'English', proficiency: 'NATIVE', order: 0 },
              { name: 'Mandarin Chinese', proficiency: 'FULL_PROFESSIONAL', order: 1 },
              { name: 'Japanese', proficiency: 'LIMITED_WORKING', order: 2 },
            ],
          },
        },
      },
    },
  })
  return profile
}
