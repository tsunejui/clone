'use client'

import { useState } from 'react'
import { Globe, Pencil, X } from 'lucide-react'
import { Card, SectionTitle, Input, Select, FormActions, ConfirmDialog } from './ui'
import type { Language } from './types'
import { PROFICIENCY_OPTIONS, PROFICIENCY_LABEL } from './types'

export function LanguagesSection({ initialData }: { initialData: Language[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', proficiency: 'PROFESSIONAL' as string })
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const proficiencyOpts = PROFICIENCY_OPTIONS.map((v) => ({ value: v, label: PROFICIENCY_LABEL[v] }))

  const startNew = () => {
    setForm({ name: '', proficiency: 'PROFESSIONAL' })
    setEditingId('new')
  }

  const startEdit = (lang: Language) => {
    setForm({ name: lang.name, proficiency: lang.proficiency })
    setEditingId(lang.id)
  }

  const cancel = () => setEditingId(null)

  const save = async () => {
    setSaving(true)
    try {
      const body = { name: form.name, proficiency: form.proficiency }

      if (editingId === 'new') {
        const res = await fetch('/api/linkedin/languages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const created = await res.json()
          setData((d) => [...d, created])
          setEditingId(null)
        }
      } else {
        const res = await fetch(`/api/linkedin/languages/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setData((d) => d.map((l) => (l.id === editingId ? updated : l)))
          setEditingId(null)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    setSaving(true)
    try {
      const res = await fetch(`/api/linkedin/languages/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setData((d) => d.filter((l) => l.id !== id))
        if (editingId === id) setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <SectionTitle icon={Globe} label="Languages" onAdd={startNew} />

      {editingId && (
        <div className="mb-4 space-y-3 border border-blue-100 rounded-lg p-4 bg-blue-50/30">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Language" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Select label="Proficiency" value={form.proficiency} onChange={(v) => setForm((f) => ({ ...f, proficiency: v }))} options={proficiencyOpts} />
          </div>
          <FormActions
            saving={saving}
            onSave={save}
            onCancel={cancel}
            onDelete={editingId !== 'new' ? () => setPendingDeleteId(editingId) : undefined}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data.map((lang) => (
          <div key={lang.id} className="group flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
            <button onClick={() => startEdit(lang)} className="flex items-center gap-2 flex-1 text-left">
              <span className="text-sm font-medium text-gray-800">{lang.name}</span>
              <span className="text-xs text-gray-500">{PROFICIENCY_LABEL[lang.proficiency] ?? lang.proficiency}</span>
            </button>
            <button onClick={() => setPendingDeleteId(lang.id)} className="hidden group-hover:block p-1 text-gray-300 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {data.length === 0 && !editingId && (
        <p className="text-sm text-gray-400 italic">No languages yet.</p>
      )}
      <ConfirmDialog
        open={!!pendingDeleteId}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => { remove(pendingDeleteId!); setPendingDeleteId(null) }}
      />
    </Card>
  )
}
