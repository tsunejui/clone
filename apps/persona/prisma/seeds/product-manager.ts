import { PrismaClient } from '@prisma/client'

export async function seedProductManager(prisma: PrismaClient) {
  const profile = await prisma.profile.create({
    data: {
      name: 'Product Manager Persona',
      linkedin: {
        create: {
          firstName: 'Sarah',
          lastName: 'Park',
          headline: 'Product Manager | Growth · B2B SaaS · AI Products',
          location: 'New York City Metropolitan Area',
          country: 'United States',
          summary:
            'Strategic product manager with 7 years of experience launching and scaling B2B SaaS products. ' +
            'Passionate about AI-powered products that solve real business problems. ' +
            'Former engineer turned PM — I bridge the gap between technical feasibility and user needs. ' +
            'Speaker at ProductCon 2024 and Women in Tech NY.',
          profileUrl: 'https://linkedin.com/in/sarah-park-pm',
          connections: 1842,
          followers: 3100,
          email: 'sarah.park@example.com',
          website: 'https://sarahpark.io',
          experiences: {
            create: [
              {
                company: 'Notion',
                title: 'Senior Product Manager — AI',
                location: 'New York, NY',
                startDate: new Date('2023-01-01'),
                current: true,
                description:
                  'Owning AI product strategy and roadmap for Notion AI suite (2M+ daily active users). ' +
                  'Led launch of AI-powered writing assistant — 45% MoM growth in feature adoption. ' +
                  'Partnering with OpenAI and Anthropic on model integrations.',
                order: 0,
              },
              {
                company: 'HubSpot',
                title: 'Product Manager',
                location: 'Boston, MA',
                startDate: new Date('2020-07-01'),
                endDate: new Date('2022-12-31'),
                current: false,
                description:
                  'Led CRM pipeline automation product — grew ARR contribution by $12M in 18 months. ' +
                  'Defined and shipped 3 major feature releases with cross-functional teams of 20+.',
                order: 1,
              },
              {
                company: 'Salesforce',
                title: 'Associate Product Manager',
                location: 'San Francisco, CA',
                startDate: new Date('2018-06-01'),
                endDate: new Date('2020-06-30'),
                current: false,
                description:
                  'Rotational APM program. Shipped features for Sales Cloud and Service Cloud. ' +
                  'Conducted 200+ customer interviews to inform product direction.',
                order: 2,
              },
            ],
          },
          educations: {
            create: [
              {
                school: 'Columbia University',
                degree: 'MBA',
                field: 'Business Administration',
                startYear: 2016,
                endYear: 2018,
                description: 'Concentration in Technology Management',
              },
              {
                school: 'Carnegie Mellon University',
                degree: "Bachelor's Degree",
                field: 'Information Systems',
                startYear: 2012,
                endYear: 2016,
              },
            ],
          },
          skills: {
            create: [
              { name: 'Product Strategy', category: 'Product', endorsements: 112, order: 0 },
              { name: 'Roadmap Planning', category: 'Product', endorsements: 98, order: 1 },
              { name: 'User Research', category: 'Research', endorsements: 85, order: 2 },
              { name: 'Data Analysis', category: 'Analytics', endorsements: 76, order: 3 },
              { name: 'A/B Testing', category: 'Analytics', endorsements: 64, order: 4 },
              { name: 'SQL', category: 'Technical', endorsements: 58, order: 5 },
              { name: 'Agile / Scrum', category: 'Process', endorsements: 91, order: 6 },
              { name: 'Stakeholder Management', category: 'Leadership', endorsements: 77, order: 7 },
            ],
          },
          certifications: {
            create: [
              {
                name: 'Pragmatic Marketing Certified (PMC-VI)',
                issuer: 'Pragmatic Institute',
                issueDate: new Date('2021-03-01'),
              },
              {
                name: 'Professional Scrum Product Owner (PSPO I)',
                issuer: 'Scrum.org',
                issueDate: new Date('2020-09-01'),
                credentialUrl: 'https://www.scrum.org/certificates/123456',
              },
            ],
          },
          languages: {
            create: [
              { name: 'English', proficiency: 'NATIVE', order: 0 },
              { name: 'Korean', proficiency: 'FULL_PROFESSIONAL', order: 1 },
              { name: 'Spanish', proficiency: 'ELEMENTARY', order: 2 },
            ],
          },
        },
      },
    },
  })
  return profile
}
