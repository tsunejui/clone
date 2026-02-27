'use client'

import { useState } from 'react'
import { Star, Pencil, X } from 'lucide-react'
import { Card, SectionTitle, Input, FormActions, ConfirmDialog } from './ui'
import type { Skill } from './types'

export function SkillsSection({ initialData }: { initialData: Skill[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', category: '', endorsements: 0 })
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const startNew = () => {
    setForm({ name: '', category: '', endorsements: 0 })
    setEditingId('new')
  }

  const startEdit = (skill: Skill) => {
    setForm({ name: skill.name, category: skill.category ?? '', endorsements: skill.endorsements })
    setEditingId(skill.id)
  }

  const cancel = () => setEditingId(null)

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        name: form.name,
        category: form.category || null,
        endorsements: typeof form.endorsements === 'string' ? parseInt(form.endorsements) || 0 : form.endorsements,
      }

      if (editingId === 'new') {
        const res = await fetch('/api/linkedin/skills', {
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
        const res = await fetch(`/api/linkedin/skills/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setData((d) => d.map((s) => (s.id === editingId ? updated : s)))
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
      const res = await fetch(`/api/linkedin/skills/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setData((d) => d.filter((s) => s.id !== id))
        if (editingId === id) setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <SectionTitle icon={Star} label="Skills" onAdd={startNew} />

      {editingId && (
        <div className="mb-4 space-y-3 border border-blue-100 rounded-lg p-4 bg-blue-50/30">
          <div className="grid grid-cols-3 gap-3">
            <Input label="Name" value={form.name} onChange={(v) => setForm((f) => ({ ...f, name: v }))} />
            <Input label="Category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} />
            <Input label="Endorsements" value={form.endorsements} type="number" onChange={(v) => setForm((f) => ({ ...f, endorsements: parseInt(v) || 0 }))} />
          </div>
          <FormActions
            saving={saving}
            onSave={save}
            onCancel={cancel}
            onDelete={editingId !== 'new' ? () => setPendingDeleteId(editingId) : undefined}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <div key={skill.id}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <button onClick={() => startEdit(skill)} className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-linkedin">{skill.name}</span>
              {skill.endorsements > 0 && (
                <span className="text-xs text-blue-400">{skill.endorsements}</span>
              )}
            </button>
            <button onClick={() => setPendingDeleteId(skill.id)} className="hidden group-hover:block text-blue-300 hover:text-red-500">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {(() => {
        const cats = [...new Set(data.map((s) => s.category).filter(Boolean))]
        return cats.length > 0 ? (
          <div className="mt-4 space-y-1">
            {cats.map((cat) => (
              <div key={cat} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="w-24 shrink-0 font-medium text-gray-600">{cat}</span>
                <span>{data.filter((s) => s.category === cat).map((s) => s.name).join(', ')}</span>
              </div>
            ))}
          </div>
        ) : null
      })()}

      {data.length === 0 && !editingId && (
        <p className="text-sm text-gray-400 italic">No skills yet.</p>
      )}
      <ConfirmDialog
        open={!!pendingDeleteId}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => { remove(pendingDeleteId!); setPendingDeleteId(null) }}
      />
    </Card>
  )
}
