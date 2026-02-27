'use client'

import { Pencil, Plus, Loader2 } from 'lucide-react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>{children}</div>
  )
}

export function SectionTitle({
  icon: Icon,
  label,
  onEdit,
  onAdd,
}: {
  icon: React.ElementType
  label: string
  onEdit?: () => void
  onAdd?: () => void
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-5 h-5 text-linkedin" />
      <h2 className="text-base font-semibold text-gray-900">{label}</h2>
      <div className="ml-auto flex gap-1">
        {onEdit && (
          <button onClick={onEdit} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <Pencil className="w-4 h-4" />
          </button>
        )}
        {onAdd && (
          <button onClick={onAdd} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export function FormActions({
  saving,
  onSave,
  onCancel,
  onDelete,
}: {
  saving: boolean
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}) {
  return (
    <div className="flex items-center gap-2 mt-4">
      <button
        onClick={onSave}
        disabled={saving}
        className="px-3 py-1.5 text-sm font-medium text-white bg-linkedin rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1.5"
      >
        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        Save
      </button>
      <button
        onClick={onCancel}
        disabled={saving}
        className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
      >
        Cancel
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={saving}
          className="ml-auto px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
        >
          Delete
        </button>
      )}
    </div>
  )
}

export function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string
  value: string | number
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <Field label={label}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin/30 focus:border-linkedin"
      />
    </Field>
  )
}

export function Textarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <Field label={label}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin/30 focus:border-linkedin resize-none"
      />
    </Field>
  )
}

export function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedin/30 focus:border-linkedin bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </Field>
  )
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-gray-500 mb-1 block">{label}</span>
      {children}
    </label>
  )
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="rounded border-gray-300 text-linkedin focus:ring-linkedin/30"
      />
      {label}
    </label>
  )
}

export function ConfirmDialog({
  open,
  title = 'Confirm delete',
  message = 'Are you sure you want to delete this item? This action cannot be undone.',
  onConfirm,
  onCancel,
}: {
  open: boolean
  title?: string
  message?: string
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-xl border border-gray-200 p-6 max-w-sm w-full mx-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export function formatDate(date: string | null | undefined, fallback = 'Present') {
  if (!date) return fallback
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}
