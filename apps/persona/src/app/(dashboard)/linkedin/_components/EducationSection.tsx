'use client'

import { useState } from 'react'
import { GraduationCap, Pencil, Trash2 } from 'lucide-react'
import { Card, SectionTitle, Input, Textarea, Checkbox, FormActions, ConfirmDialog } from './ui'
import type { Education } from './types'

const empty: Omit<Education, 'id'> = {
  school: '', degree: '', field: '', startYear: new Date().getFullYear(), endYear: null,
  current: false, description: '', grade: '',
}

export function EducationSection({ initialData }: { initialData: Education[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string | number | boolean | null>>(empty)
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const startNew = () => { setForm(empty); setEditingId('new') }

  const startEdit = (edu: Education) => {
    setForm({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startYear: edu.startYear,
      endYear: edu.endYear,
      current: edu.current,
      description: edu.description ?? '',
      grade: edu.grade ?? '',
    })
    setEditingId(edu.id)
  }

  const cancel = () => setEditingId(null)
  const set = (k: string, v: string | number | boolean | null) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        school: form.school,
        degree: form.degree,
        field: form.field,
        startYear: typeof form.startYear === 'string' ? parseInt(form.startYear) : form.startYear,
        endYear: form.current ? null : (form.endYear ? (typeof form.endYear === 'string' ? parseInt(form.endYear) : form.endYear) : null),
        current: form.current,
        description: form.description || null,
        grade: form.grade || null,
      }

      if (editingId === 'new') {
        const res = await fetch('/api/linkedin/education', {
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
        const res = await fetch(`/api/linkedin/education/${editingId}`, {
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
      const res = await fetch(`/api/linkedin/education/${targetId}`, { method: 'DELETE' })
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
        <Input label="School" value={form.school as string} onChange={(v) => set('school', v)} />
        <Input label="Degree" value={form.degree as string} onChange={(v) => set('degree', v)} />
        <Input label="Field of Study" value={form.field as string} onChange={(v) => set('field', v)} />
        <Input label="Grade" value={form.grade as string} onChange={(v) => set('grade', v)} />
        <Input label="Start Year" value={form.startYear as number} type="number" onChange={(v) => set('startYear', v)} />
        {!form.current && (
          <Input label="End Year" value={(form.endYear as number) ?? ''} type="number" onChange={(v) => set('endYear', v)} />
        )}
      </div>
      <Checkbox label="Currently studying here" checked={form.current as boolean} onChange={(v) => set('current', v)} />
      <Textarea label="Description" value={form.description as string} onChange={(v) => set('description', v)} rows={3} />
      <FormActions saving={saving} onSave={save} onCancel={cancel} onDelete={editingId !== 'new' ? () => setPendingDeleteId(editingId) : undefined} />
    </div>
  )

  return (
    <Card>
      <SectionTitle icon={GraduationCap} label="Education" onAdd={startNew} />
      <div className="space-y-5">
        {editingId === 'new' && renderForm()}
        {data.map((edu, i) => (
          <div key={edu.id}>
            {editingId === edu.id ? (
              renderForm()
            ) : (
              <div className={i > 0 ? 'border-t border-gray-100 pt-5' : ''}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{edu.school}</p>
                    <p className="text-sm text-gray-600">{edu.degree}, {edu.field}</p>
                    {edu.grade && <p className="text-xs text-gray-400">Grade: {edu.grade}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">
                      {edu.startYear} – {edu.current ? 'Present' : (edu.endYear ?? '–')}
                    </span>
                    <button onClick={() => startEdit(edu)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPendingDeleteId(edu.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {edu.description && (
                  <p className="mt-2 text-sm text-gray-600">{edu.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && editingId !== 'new' && (
          <p className="text-sm text-gray-400 italic">No education entries yet.</p>
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
