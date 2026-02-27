'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { Card, SectionTitle, Textarea, FormActions } from './ui'

export function AboutSection({ initialSummary }: { initialSummary: string }) {
  const [summary, setSummary] = useState(initialSummary)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(initialSummary)
  const [saving, setSaving] = useState(false)

  const startEdit = () => { setForm(summary); setEditing(true) }
  const cancel = () => setEditing(false)

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/linkedin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summary: form }),
      })
      if (res.ok) {
        setSummary(form)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <SectionTitle icon={Globe} label="About" onEdit={startEdit} />
      {editing ? (
        <>
          <Textarea label="Summary" value={form} onChange={setForm} rows={5} />
          <FormActions saving={saving} onSave={save} onCancel={cancel} />
        </>
      ) : (
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {summary || <span className="text-gray-400 italic">No summary yet.</span>}
        </p>
      )}
    </Card>
  )
}
