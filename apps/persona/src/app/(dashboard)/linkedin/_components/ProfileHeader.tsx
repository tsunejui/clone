'use client'

import { useState } from 'react'
import { MapPin, Users, Star, Mail, Phone, Link2, ExternalLink, Pencil } from 'lucide-react'
import { Card, Input, FormActions } from './ui'
import type { LinkedInProfile } from './types'

type ProfileData = Pick<
  LinkedInProfile,
  'id' | 'firstName' | 'lastName' | 'headline' | 'location' | 'country' |
  'email' | 'phone' | 'website' | 'connections' | 'followers' | 'profileUrl'
>

export function ProfileHeader({ initialData }: { initialData: ProfileData }) {
  const [data, setData] = useState(initialData)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(initialData)
  const [saving, setSaving] = useState(false)

  const startEdit = () => { setForm(data); setEditing(true) }
  const cancel = () => setEditing(false)

  const save = async () => {
    setSaving(true)
    try {
      const { id, profileUrl, ...rest } = form
      const res = await fetch('/api/linkedin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rest),
      })
      if (res.ok) {
        const updated = await res.json()
        setData({ ...data, ...updated })
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  const set = (k: keyof typeof form, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }))

  if (editing) {
    return (
      <Card>
        <div className="grid grid-cols-2 gap-3">
          <Input label="First Name" value={form.firstName} onChange={(v) => set('firstName', v)} />
          <Input label="Last Name" value={form.lastName} onChange={(v) => set('lastName', v)} />
          <div className="col-span-2">
            <Input label="Headline" value={form.headline} onChange={(v) => set('headline', v)} />
          </div>
          <Input label="Location" value={form.location} onChange={(v) => set('location', v)} />
          <Input label="Country" value={form.country} onChange={(v) => set('country', v)} />
          <Input label="Email" value={form.email ?? ''} onChange={(v) => set('email', v)} />
          <Input label="Phone" value={form.phone ?? ''} onChange={(v) => set('phone', v)} />
          <Input label="Website" value={form.website ?? ''} onChange={(v) => set('website', v)} />
          <Input label="Profile URL" value={form.profileUrl} onChange={(v) => set('profileUrl', v)} />
          <Input label="Connections" value={form.connections} type="number" onChange={(v) => set('connections', parseInt(v) || 0)} />
          <Input label="Followers" value={form.followers} type="number" onChange={(v) => set('followers', parseInt(v) || 0)} />
        </div>
        <FormActions saving={saving} onSave={save} onCancel={cancel} />
      </Card>
    )
  }

  return (
    <Card>
      <div className="h-20 -mx-6 -mt-6 mb-4 rounded-t-lg bg-gradient-to-r from-linkedin to-blue-400 relative">
        <button onClick={startEdit} className="absolute top-2 right-2 p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-white">
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      <div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{data.firstName} {data.lastName}</h2>
          <p className="text-gray-600 text-sm mt-0.5">{data.headline}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{data.location}, {data.country}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{data.connections.toLocaleString()} connections</span>
            {data.followers > 0 && (
              <span className="flex items-center gap-1"><Star className="w-3 h-3" />{data.followers.toLocaleString()} followers</span>
            )}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            {data.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{data.email}</span>}
            {data.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{data.phone}</span>}
            {data.website && (
              <a href={data.website} className="flex items-center gap-1 text-linkedin hover:underline">
                <Link2 className="w-3 h-3" />{data.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            <a href={data.profileUrl} className="flex items-center gap-1 text-linkedin hover:underline">
              <ExternalLink className="w-3 h-3" />LinkedIn Profile
            </a>
          </div>
        </div>
      </div>
    </Card>
  )
}
