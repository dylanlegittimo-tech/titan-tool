'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Shift {
  id: string
  title: string
  start_time: string
  end_time: string
}

export default function Home() {
  const [shifts, setShifts] = useState<Shift[]>([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(true)

  // 1. Schichten aus Supabase laden
  const fetchShifts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('shifts')
      .select('*')
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Fehler beim Laden der Schichten:', error)
    } else {
      setShifts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchShifts()
  }, [])

  // 2. Neue Schicht in Supabase eintragen
  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startTime || !endTime) return

    const { error } = await supabase.from('shifts').insert([
      {
        title,
        start_time: startTime,
        end_time: endTime,
      },
    ])

    if (error) {
      alert('Fehler beim Erstellen der Schicht: ' + error.message)
    } else {
      setTitle('')
      setStartTime('')
      setEndTime('')
      fetchShifts() // Liste aktualisieren
    }
  }

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Titan Tool – Schichtplaner</h1>

      {/* Formular: Neue Schicht anlegen */}
      <section style={{ backgroundColor: '#f4f4f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Neue Schicht erstellen</h2>
        <form onSubmit={handleAddShift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.25rem' }}>Titel / Rolle:</label>
            <input
              type="text"
              placeholder="z. B. Frühschicht Logistik"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Startzeit:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Endzeit:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            style={{
              padding: '0.75rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Schicht anlegen
          </button>
        </form>
      </section>

      {/* Liste: Vorhandene Schichten */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Geplante Schichten</h2>
        {loading ? (
          <p>Lade Schichten...</p>
        ) : shifts.length === 0 ? (
          <p style={{ color: '#666' }}>Noch keine Schichten eingetragen.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {shifts.map((shift) => (
              <li
                key={shift.id}
                style={{
                  padding: '1rem',
                  border: '1px solid #e4e4e7',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.1rem' }}>{shift.title}</strong>
                  <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    {new Date(shift.start_time).toLocaleString('de-DE')} – {new Date(shift.end_time).toLocaleString('de-DE')}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}