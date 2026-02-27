'use client'

import { useState } from 'react'
import { Award, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import { Card, SectionTitle, Input, FormActions, ConfirmDialog, formatDate } from './ui'
import type { Certification } from './types'

const empty = {
  name: '', issuer: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '',
}

function toDateInput(v: string | null) {
  if (!v) return ''
  return new Date(v).toISOString().slice(0, 10)
}

export function CertificationsSection({ initialData }: { initialData: Certification[] }) {
  const [data, setData] = useState(initialData)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const startNew = () => { setForm(empty); setEditingId('new') }

  const startEdit = (cert: Certification) => {
    setForm({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: toDateInput(cert.issueDate),
      expiryDate: toDateInput(cert.expiryDate),
      credentialId: cert.credentialId ?? '',
      credentialUrl: cert.credentialUrl ?? '',
    })
    setEditingId(cert.id)
  }

  const cancel = () => setEditingId(null)
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        name: form.name,
        issuer: form.issuer,
        issueDate: form.issueDate ? new Date(form.issueDate).toISOString() : undefined,
        expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null,
        credentialId: form.credentialId || null,
        credentialUrl: form.credentialUrl || null,
      }

      if (editingId === 'new') {
        const res = await fetch('/api/linkedin/certifications', {
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
        const res = await fetch(`/api/linkedin/certifications/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        if (res.ok) {
          const updated = await res.json()
          setData((d) => d.map((c) => (c.id === editingId ? updated : c)))
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
      const res = await fetch(`/api/linkedin/certifications/${targetId}`, { method: 'DELETE' })
      if (res.ok) {
        setData((d) => d.filter((c) => c.id !== targetId))
        if (editingId === targetId) setEditingId(null)
      }
    } finally {
      setSaving(false)
    }
  }

  const renderForm = () => (
    <div className="space-y-3 border border-blue-100 rounded-lg p-4 bg-blue-50/30">
      <div className="grid grid-cols-2 gap-3">
        <Input label="Name" value={form.name} onChange={(v) => set('name', v)} />
        <Input label="Issuer" value={form.issuer} onChange={(v) => set('issuer', v)} />
        <Input label="Issue Date" value={form.issueDate} onChange={(v) => set('issueDate', v)} type="date" />
        <Input label="Expiry Date" value={form.expiryDate} onChange={(v) => set('expiryDate', v)} type="date" />
        <Input label="Credential ID" value={form.credentialId} onChange={(v) => set('credentialId', v)} />
        <Input label="Credential URL" value={form.credentialUrl} onChange={(v) => set('credentialUrl', v)} />
      </div>
      <FormActions saving={saving} onSave={save} onCancel={cancel} onDelete={editingId !== 'new' ? () => setPendingDeleteId(editingId) : undefined} />
    </div>
  )

  return (
    <Card>
      <SectionTitle icon={Award} label="Certifications" onAdd={startNew} />
      <div className="space-y-4">
        {editingId === 'new' && renderForm()}
        {data.map((cert, i) => (
          <div key={cert.id}>
            {editingId === cert.id ? (
              renderForm()
            ) : (
              <div className={i > 0 ? 'border-t border-gray-100 pt-4' : ''}>
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{cert.name}</p>
                    <p className="text-sm text-gray-600">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-gray-400">ID: {cert.credentialId}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-xs text-gray-400 text-right">
                      <p>Issued {formatDate(cert.issueDate)}</p>
                      {cert.expiryDate && <p>Expires {formatDate(cert.expiryDate)}</p>}
                    </div>
                    <button onClick={() => startEdit(cert)} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setPendingDeleteId(cert.id)} className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                {cert.credentialUrl && (
                  <a href={cert.credentialUrl}
                    className="mt-1 inline-flex items-center gap-1 text-xs text-linkedin hover:underline">
                    <ExternalLink className="w-3 h-3" />Show credential
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
        {data.length === 0 && editingId !== 'new' && (
          <p className="text-sm text-gray-400 italic">No certifications yet.</p>
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
