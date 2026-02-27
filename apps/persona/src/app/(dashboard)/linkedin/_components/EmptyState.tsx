'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Loader2 } from 'lucide-react'
import { Input } from './ui'

export function EmptyState() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ name: '', firstName: '', lastName: '' })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!form.name || !form.firstName || !form.lastName) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  if (!creating) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-500">No profile found.</p>
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-linkedin rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-white rounded-lg border border-gray-200 p-6 w-full max-w-md space-y-4">
        <h2 className="text-base font-semibold text-gray-900">New Profile</h2>
        <div className="space-y-3">
          <Input label="Persona Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} placeholder="e.g. Tech Engineer Persona" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="First Name" value={form.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
            <Input label="Last Name" value={form.lastName} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !form.name || !form.firstName || !form.lastName}
            className="px-3 py-1.5 text-sm font-medium text-white bg-linkedin rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Create
          </button>
          <button
            onClick={() => setCreating(false)}
            disabled={saving}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
