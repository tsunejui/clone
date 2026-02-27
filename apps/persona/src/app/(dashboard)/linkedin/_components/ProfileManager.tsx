'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { ConfirmDialog } from './ui'

interface Props {
  profileId: string
  profileName: string
}

export function ProfileManager({ profileId, profileName }: Props) {
  const router = useRouter()
  const [name, setName] = useState(profileName)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(profileName)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const startEdit = () => { setForm(name); setEditing(true) }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/profile/${profileId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form }),
      })
      if (res.ok) {
        setName(form)
        setEditing(false)
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  const remove = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/profile/${profileId}`, { method: 'DELETE' })
      if (res.ok) {
        router.refresh()
      }
    } finally {
      setSaving(false)
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <input
          value={form}
          onChange={(e) => setForm(e.target.value)}
          className="px-2 py-0.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin/30 focus:border-linkedin"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') save()
            if (e.key === 'Escape') setEditing(false)
          }}
        />
        <button
          onClick={save}
          disabled={saving}
          className="px-2 py-0.5 text-xs font-medium text-white bg-linkedin rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
        >
          {saving && <Loader2 className="w-3 h-3 animate-spin" />}
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          disabled={saving}
          className="px-2 py-0.5 text-xs font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-gray-500">Persona: {name}</span>
        <button onClick={startEdit} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={() => setConfirmDelete(true)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete profile"
        message="This will permanently delete the entire profile and all LinkedIn data. This action cannot be undone."
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => { setConfirmDelete(false); remove() }}
      />
    </>
  )
}
