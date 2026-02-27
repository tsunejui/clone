import { readFileSync } from 'fs'
import { parse } from 'yaml'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

async function api(path: string, method: string, body?: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    if (res.status === 404) return null
    const text = await res.text()
    throw new Error(`${method} ${path} → ${res.status}: ${text}`)
  }
  if (res.status === 204) return null
  return res.json()
}

function toISOString(value: any): string | undefined {
  if (!value) return undefined
  return new Date(value).toISOString()
}

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error('Usage: tsx scripts/load-profile.ts <yaml-file>')
    process.exit(1)
  }

  const raw = readFileSync(filePath, 'utf-8')
  const data = parse(raw)
  const li = data.linkedin

  console.log(`Importing profile: ${data.name}`)

  // Delete existing profile if one exists
  const existing = await api('/api/linkedin', 'GET')
  if (existing) {
    console.log(`  Replacing existing profile: ${existing.profileId}`)
    await api(`/api/profile/${existing.profileId}`, 'DELETE')
  }

  // Create profile
  const profile = await api('/api/profile', 'POST', {
    name: data.name,
    firstName: li.firstName,
    lastName: li.lastName,
  })
  if (!profile) {
    throw new Error('POST /api/profile returned 404 — is the server running? (just start)')
  }
  console.log(`  Created profile: ${profile.id}`)

  // Update LinkedIn basic info
  await api('/api/linkedin', 'PATCH', {
    headline: li.headline,
    location: li.location,
    country: li.country,
    summary: li.summary,
    profileUrl: li.profileUrl,
    connections: li.connections ?? 0,
    followers: li.followers ?? 0,
    email: li.email ?? undefined,
    phone: li.phone ?? undefined,
    website: li.website ?? undefined,
  })
  console.log('  Updated LinkedIn info')

  // Experiences
  for (const e of li.experiences ?? []) {
    await api('/api/linkedin/experience', 'POST', {
      company: e.company,
      title: e.title,
      location: e.location,
      startDate: toISOString(e.startDate),
      endDate: toISOString(e.endDate),
      current: e.current ?? false,
      description: e.description,
    })
  }
  console.log(`  Added ${(li.experiences ?? []).length} experiences`)

  // Educations
  for (const e of li.educations ?? []) {
    await api('/api/linkedin/education', 'POST', {
      school: e.school,
      degree: e.degree,
      field: e.field,
      startYear: e.startYear,
      endYear: e.endYear,
      current: e.current ?? false,
      description: e.description,
      grade: e.grade,
    })
  }
  console.log(`  Added ${(li.educations ?? []).length} educations`)

  // Skills
  for (const s of li.skills ?? []) {
    await api('/api/linkedin/skills', 'POST', {
      name: s.name,
      category: s.category,
      endorsements: s.endorsements ?? 0,
    })
  }
  console.log(`  Added ${(li.skills ?? []).length} skills`)

  // Certifications
  for (const c of li.certifications ?? []) {
    await api('/api/linkedin/certifications', 'POST', {
      name: c.name,
      issuer: c.issuer,
      issueDate: toISOString(c.issueDate),
      expiryDate: toISOString(c.expiryDate),
      credentialId: c.credentialId,
      credentialUrl: c.credentialUrl,
    })
  }
  console.log(`  Added ${(li.certifications ?? []).length} certifications`)

  // Languages
  for (const l of li.languages ?? []) {
    await api('/api/linkedin/languages', 'POST', {
      name: l.name,
      proficiency: l.proficiency,
    })
  }
  console.log(`  Added ${(li.languages ?? []).length} languages`)

  console.log('Done!')
}

main().catch((e) => { console.error(e); process.exit(1) })
