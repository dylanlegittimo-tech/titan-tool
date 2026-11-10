'use client'

import { useState } from 'react'

export default function KontoProfil() {
  const [fullName, setFullName] = useState('')

  return (
    <div className="p-6 max-w-md bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Mein Konto</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vollständiger Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Dein Name eingeben..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  )
}