import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import {
  MapPin, Link2, Mail, Phone, Users, Briefcase,
  GraduationCap, Award, Globe, Star, ExternalLink,
} from 'lucide-react'

const PROFICIENCY_LABEL: Record<string, string> = {
  NATIVE: 'Native or Bilingual',
  FULL_PROFESSIONAL: 'Full Professional',
  PROFESSIONAL: 'Professional Working',
  LIMITED_WORKING: 'Limited Working',
  ELEMENTARY: 'Elementary',
}

function formatDate(date: Date | null | undefined, fallback = 'Present') {
  if (!date) return fallback
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>{children}</div>
  )
}

function SectionTitle({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-linkedin" />
      <h2 className="text-base font-semibold text-gray-900">{label}</h2>
    </div>
  )
}

export default async function LinkedInPage() {
  const profile = await prisma.profile.findFirst({
    include: {
      linkedin: {
        include: {
          experiences: { orderBy: { order: 'asc' } },
          educations: { orderBy: { startYear: 'desc' } },
          skills: { orderBy: { order: 'asc' } },
          certifications: { orderBy: { issueDate: 'desc' } },
          languages: { orderBy: { order: 'asc' } },
        },
      },
    },
  })

  if (!profile?.linkedin) {
    return (
      <>
        <Header title="LinkedIn Profile" />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-gray-500">No profile found.</p>
            <code className="text-sm bg-gray-100 px-3 py-1 rounded">just persona-db-seed</code>
          </div>
        </div>
      </>
    )
  }

  const li = profile.linkedin

  return (
    <>
      <Header title="LinkedIn Profile" description={`Persona: ${profile.name}`} />

      <div className="flex-1 p-8 space-y-4 max-w-3xl">
        {/* ── Profile Header ── */}
        <Card>
          {/* Banner */}
          <div className="h-20 -mx-6 -mt-6 mb-4 rounded-t-lg bg-gradient-to-r from-linkedin to-blue-400" />

          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 -mt-12 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center shrink-0 text-2xl font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#0A66C2,#0284c7)' }}>
              {li.firstName[0]}{li.lastName[0]}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-gray-900">
                {li.firstName} {li.lastName}
              </h2>
              <p className="text-gray-600 text-sm mt-0.5">{li.headline}</p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{li.location}, {li.country}</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{li.connections.toLocaleString()} connections</span>
                {li.followers > 0 && (
                  <span className="flex items-center gap-1"><Star className="w-3 h-3" />{li.followers.toLocaleString()} followers</span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                {li.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{li.email}</span>}
                {li.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{li.phone}</span>}
                {li.website && (
                  <a href={li.website} className="flex items-center gap-1 text-linkedin hover:underline">
                    <Link2 className="w-3 h-3" />{li.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
                <a href={li.profileUrl} className="flex items-center gap-1 text-linkedin hover:underline">
                  <ExternalLink className="w-3 h-3" />LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* ── About ── */}
        {li.summary && (
          <Card>
            <SectionTitle icon={Globe} label="About" />
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{li.summary}</p>
          </Card>
        )}

        {/* ── Experience ── */}
        {li.experiences.length > 0 && (
          <Card>
            <SectionTitle icon={Briefcase} label="Experience" />
            <div className="space-y-5">
              {li.experiences.map((exp, i) => (
                <div key={exp.id} className={i > 0 ? 'border-t border-gray-100 pt-5' : ''}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      {exp.location && <p className="text-xs text-gray-400">{exp.location}</p>}
                    </div>
                    <div className="text-xs text-gray-400 shrink-0 text-right">
                      <p>{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                    </div>
                  </div>
                  {exp.description && (
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Education ── */}
        {li.educations.length > 0 && (
          <Card>
            <SectionTitle icon={GraduationCap} label="Education" />
            <div className="space-y-5">
              {li.educations.map((edu, i) => (
                <div key={edu.id} className={i > 0 ? 'border-t border-gray-100 pt-5' : ''}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{edu.school}</p>
                      <p className="text-sm text-gray-600">{edu.degree}, {edu.field}</p>
                      {edu.grade && <p className="text-xs text-gray-400">Grade: {edu.grade}</p>}
                    </div>
                    <div className="text-xs text-gray-400 shrink-0">
                      {edu.startYear} – {edu.current ? 'Present' : (edu.endYear ?? '–')}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Skills ── */}
        {li.skills.length > 0 && (
          <Card>
            <SectionTitle icon={Star} label="Skills" />
            <div className="flex flex-wrap gap-2">
              {li.skills.map((skill) => (
                <div key={skill.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                  <span className="text-sm font-medium text-linkedin">{skill.name}</span>
                  {skill.endorsements > 0 && (
                    <span className="text-xs text-blue-400">{skill.endorsements}</span>
                  )}
                </div>
              ))}
            </div>
            {/* Category breakdown */}
            {(() => {
              const cats = [...new Set(li.skills.map(s => s.category).filter(Boolean))]
              return cats.length > 0 ? (
                <div className="mt-4 space-y-1">
                  {cats.map(cat => (
                    <div key={cat} className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="w-24 shrink-0 font-medium text-gray-600">{cat}</span>
                      <span>{li.skills.filter(s => s.category === cat).map(s => s.name).join(', ')}</span>
                    </div>
                  ))}
                </div>
              ) : null
            })()}
          </Card>
        )}

        {/* ── Certifications ── */}
        {li.certifications.length > 0 && (
          <Card>
            <SectionTitle icon={Award} label="Certifications" />
            <div className="space-y-4">
              {li.certifications.map((cert, i) => (
                <div key={cert.id} className={i > 0 ? 'border-t border-gray-100 pt-4' : ''}>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{cert.name}</p>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      {cert.credentialId && (
                        <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 text-right shrink-0">
                      <p>Issued {formatDate(cert.issueDate)}</p>
                      {cert.expiryDate && <p>Expires {formatDate(cert.expiryDate)}</p>}
                    </div>
                  </div>
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl}
                      className="mt-1 inline-flex items-center gap-1 text-xs text-linkedin hover:underline">
                      <ExternalLink className="w-3 h-3" />Show credential
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ── Languages ── */}
        {li.languages.length > 0 && (
          <Card>
            <SectionTitle icon={Globe} label="Languages" />
            <div className="grid grid-cols-2 gap-3">
              {li.languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-gray-800">{lang.name}</span>
                  <span className="text-xs text-gray-500">
                    {PROFICIENCY_LABEL[lang.proficiency] ?? lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </>
  )
}
