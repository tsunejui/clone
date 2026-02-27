'use client'

import { useState } from 'react'
import { Briefcase, Pencil, Trash2 } from 'lucide-react'
import { Card, SectionTitle, Input, Textarea, Checkbox, FormActions, ConfirmDialog, formatDate } from './ui'
import type { Experience } from './types'

const empty = {
  company: '', title: '', location: '', startDate: '', endDate: '', current: false, description: '',
}

function toDateInput(v: string | null) {
  if (!v) return ''
  return new Date(v).toISOString().slice(0, 10)
}

export function ExperienceSection({ initialData }: { initialData: Experience[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string | boolean>>(empty)
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const startNew = () => {
    setForm(empty)
    setEditingId('new')
  }

  const startEdit = (exp: Experience) => {
    setForm({
      company: exp.company,
      title: exp.title,
      location: exp.location ?? '',
      startDate: toDateInput(exp.startDate),
      endDate: toDateInput(exp.endDate),
      current: exp.current,
      description: exp.description ?? '',
    })
    setEditingId(exp.id)
  }

  const cancel = () => setEditingId(null)

  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {
        company: form.company,
        title: form.title,
        location: form.location || null,
        startDate: form.startDate ? new Date(form.startDate as string).toISOString() : undefined,
        endDate: form.current ? null : (form.endDate ? new Date(form.endDate as string).toISOString() : null),
        current: form.current,
        description: form.description || null,
      }

      if (editingId === 'new') {
        const res = await fetch('/api/linkedin/experience', {
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
        const res = await fetch(`/api/linkedin/experience/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setData((d) => d.map((e) => (e.id === editingId ? updated : e)))
          setEditingId(null)
        }
      }
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id?: string) => {
    const targetId = id ?? editingId
    if (!targetId || targetId === 'new') return
    setSaving(true)
    try {
      const res = await fetch(`/api/linkedin/experience/${targetId}`, { method: 'DELETE' })
      if (res.ok) {
        setData((d) => d.filter((e) => e.id !== targetId))
        if (editingId === targetId) setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  const renderForm = () => (
    <div className="space-y-3 border border-blue-100 rounded-lg p-4 bg-blue-50/30">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Title" value={form.title as string} onChange={(v) => set('title', v)} />
        <Input label="Company" value={form.company as string} onChange={(v) => set('company', v)} />
        <Input label="Location" value={form.location as string} onChange={(v) => set('location', v)} />
        <Input label="Start Date" value={form.startDate as string} onChange={(v) => set('startDate', v)} type="date" />
        {!form.current && (
          <Input label="End Date" value={form.endDate as string} onChange={(v) => set('endDate', v)} type="date" />
        )}
      </div>
      <Checkbox label="I currently work here" checked={form.current as boolean} onChange={(v) => set('current', v)} />
      <Textarea label="Description" value={form.description as string} onChange={(v) => set('description', v)} rows={3} />
      <FormActions saving={saving} onSave={save} onCancel={cancel} onDelete={editingId !== 'new' ? () => setPendingDeleteId(editingId) : undefined} />
    </div>
  )

  return (
    <Card>
      <SectionTitle icon={Briefcase} label="Experience" onAdd={startNew} />
      <div className="space-y-5">
        {editingId === 'new' && renderForm()}
        {data.map((exp, i) => (
          <div key={exp.id}>
            {editingId === exp.id ? (
              renderForm()
            ) : (
              <div className={i > 0 ? 'border-t border-gray-100 pt-5' : ''}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{exp.title}</p>
                    <p className="text-sm text-gray-600">{exp.company}</p>
                    {exp.location && <p className="text-xs text-gray-400">{exp.location}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">
                      {formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                    <button onClick={() => startEdit(exp)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPendingDeleteId(exp.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {exp.description && (
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{exp.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && editingId !== 'new' && (
          <p className="text-sm text-gray-400 italic">No experiences yet.</p>
        )}
      </div>
      <ConfirmDialog
        open={!!pendingDeleteId}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => { remove(pendingDeleteId!); setPendingDeleteId(null) }}
      />
    </Card>
  )
}
