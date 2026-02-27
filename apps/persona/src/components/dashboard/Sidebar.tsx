'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Linkedin, BookOpen, User } from 'lucide-react'

const nav = [
  { href: '/linkedin', label: 'LinkedIn', icon: Linkedin },
  { href: '/docs', label: 'API Docs', icon: BookOpen },
]

export function Sidebar() {
  const path = usePathname()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-linkedin" />
          <span className="font-semibold text-gray-800">Persona</span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">Identity Simulator</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? 'bg-blue-50 text-linkedin font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
