import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Persona API',
      version: '1.0.0',
      description: 'REST API for personal identity simulation system. Provides structured persona data for AI consumption.',
    },
    servers: [{ url: 'http://localhost:3000', description: 'Local development' }],
    tags: [
      { name: 'LinkedIn', description: 'LinkedIn profile data' },
      { name: 'Experience', description: 'Work experience entries' },
      { name: 'Education', description: 'Education entries' },
      { name: 'Skills', description: 'Skills and endorsements' },
      { name: 'Certifications', description: 'Professional certifications' },
      { name: 'Languages', description: 'Language proficiencies' },
    ],
  },
  apis: [path.join(process.cwd(), 'src/app/api/**/*.ts')],
}

export const getApiDocs = () => swaggerJsdoc(options)
