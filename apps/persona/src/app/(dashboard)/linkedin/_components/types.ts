export interface Experience {
  id: string
  company: string
  title: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string | null
  order: number
}

export interface Education {
  id: string
  school: string
  degree: string
  field: string
  startYear: number
  endYear: number | null
  current: boolean
  description: string | null
  grade: string | null
}

export interface Skill {
  id: string
  name: string
  category: string | null
  endorsements: number
  order: number
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issueDate: string
  expiryDate: string | null
  credentialId: string | null
  credentialUrl: string | null
}

export interface Language {
  id: string
  name: string
  proficiency: string
  order: number
}

export interface LinkedInProfile {
  id: string
  firstName: string
  lastName: string
  headline: string
  location: string
  country: string
  summary: string
  profileUrl: string
  avatarUrl: string | null
  connections: number
  followers: number
  email: string | null
  phone: string | null
  website: string | null
  experiences: Experience[]
  educations: Education[]
  skills: Skill[]
  certifications: Certification[]
  languages: Language[]
}

export const PROFICIENCY_OPTIONS = [
  'NATIVE',
  'FULL_PROFESSIONAL',
  'PROFESSIONAL',
  'LIMITED_WORKING',
  'ELEMENTARY',
] as const

export const PROFICIENCY_LABEL: Record<string, string> = {
  NATIVE: 'Native or Bilingual',
  FULL_PROFESSIONAL: 'Full Professional',
  PROFESSIONAL: 'Professional Working',
  LIMITED_WORKING: 'Limited Working',
  ELEMENTARY: 'Elementary',
}
