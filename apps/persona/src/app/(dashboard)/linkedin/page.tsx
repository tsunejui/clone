import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import { ProfileManager } from './_components/ProfileManager'
import { EmptyState } from './_components/EmptyState'
import { ProfileHeader } from './_components/ProfileHeader'
import { AboutSection } from './_components/AboutSection'
import { ExperienceSection } from './_components/ExperienceSection'
import { EducationSection } from './_components/EducationSection'
import { SkillsSection } from './_components/SkillsSection'
import { CertificationsSection } from './_components/CertificationsSection'
import { LanguagesSection } from './_components/LanguagesSection'

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
        <EmptyState />
      </>
    )
  }

  const li = profile.linkedin
  const json = JSON.parse(JSON.stringify(li))

  return (
    <>
      <Header title="LinkedIn Profile" />
      <div className="px-8 pt-2">
        <ProfileManager profileId={profile.id} profileName={profile.name} />
      </div>
      <div className="flex-1 p-8 pt-4 space-y-4 max-w-3xl">
        <ProfileHeader initialData={json} />
        <AboutSection initialSummary={json.summary} />
        <ExperienceSection initialData={json.experiences} />
        <EducationSection initialData={json.educations} />
        <SkillsSection initialData={json.skills} />
        <CertificationsSection initialData={json.certifications} />
        <LanguagesSection initialData={json.languages} />
      </div>
    </>
  )
}
