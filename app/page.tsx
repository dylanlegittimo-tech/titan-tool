'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Shift {
  id: string
  title: string
  start_time: string
  end_time: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('listenansicht')
  const [shifts, setShifts] = useState<Shift[]>([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Schichten aus Supabase laden
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

  // Neue Schicht anlegen
  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startTime || !endTime) return

    setSubmitting(true)
    const { error } = await supabase.from('shifts').insert([
      { title, start_time: startTime, end_time: endTime },
    ])

    if (error) {
      alert('Fehler beim Erstellen der Schicht: ' + error.message)
    } else {
      setTitle('')
      setStartTime('')
      setEndTime('')
      fetchShifts()
    }
    setSubmitting(false)
  }

  // Schicht löschen
  const handleDeleteShift = async (id: string) => {
    if (!confirm('Möchtest du diese Schicht wirklich löschen?')) return

    const { error } = await supabase.from('shifts').delete().eq('id', id)
    if (error) {
      alert('Fehler beim Löschen: ' + error.message)
    } else {
      fetchShifts()
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{
        width: sidebarOpen ? '260px' : '70px',
        backgroundColor: '#111827',
        borderRight: '1px solid #1f2937',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        position: 'relative'
      }}>
        {/* Organisation Branding Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #1f2937', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#eab308',
            color: '#000',
            fontWeight: '900',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            flexShrink: 0
          }}>
            T
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deine Organisation</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#ffffff' }}>Titan Spezialbewachungen</div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          
          <button onClick={() => setActiveTab('dashboard')} style={navButtonStyle(activeTab === 'dashboard', sidebarOpen)}>
            📊 {sidebarOpen && <span>Dashboard</span>}
          </button>

          {/* Kalender Unterkategorien */}
          <div style={{ marginTop: '0.5rem', marginBottom: '0.25rem', paddingLeft: sidebarOpen ? '0.75rem' : '0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>
            {sidebarOpen ? 'KALENDER' : '—'}
          </div>

          <button onClick={() => setActiveTab('listenansicht')} style={navButtonStyle(activeTab === 'listenansicht', sidebarOpen)}>
            📋 {sidebarOpen && <span>Listenansicht</span>}
          </button>
          
          <button onClick={() => setActiveTab('zellenansicht')} style={navButtonStyle(activeTab === 'zellenansicht', sidebarOpen)}>
            📅 {sidebarOpen && <span>Zellenansicht</span>}
          </button>
          
          <button onClick={() => setActiveTab('eventansicht')} style={navButtonStyle(activeTab === 'eventansicht', sidebarOpen)}>
            🎟️ {sidebarOpen && <span>Eventansicht</span>}
          </button>

          <button onClick={() => setActiveTab('freigabeansicht')} style={navButtonStyle(activeTab === 'freigabeansicht', sidebarOpen)}>
            ✅ {sidebarOpen && <span>Freigabeansicht</span>}
          </button>

          {/* Weitere Module */}
          <div style={{ marginTop: '0.75rem', marginBottom: '0.25rem', paddingLeft: sidebarOpen ? '0.75rem' : '0', fontSize: '0.75rem', color: '#6b7280', fontWeight: 'bold' }}>
            {sidebarOpen ? 'VERWALTUNG' : '—'}
          </div>

          <button onClick={() => setActiveTab('abwesenheiten')} style={navButtonStyle(activeTab === 'abwesenheiten', sidebarOpen)}>
            🏖️ {sidebarOpen && <span>Abwesenheiten</span>}
          </button>

          <button onClick={() => setActiveTab('mitglieder')} style={navButtonStyle(activeTab === 'mitglieder', sidebarOpen)}>
            👥 {sidebarOpen && <span>Mitglieder</span>}
          </button>

          <button onClick={() => setActiveTab('events')} style={navButtonStyle(activeTab === 'events', sidebarOpen)}>
            🎓 {sidebarOpen && <span>Events & Kurse</span>}
          </button>

          <button onClick={() => setActiveTab('arbeitsgruppen')} style={navButtonStyle(activeTab === 'arbeitsgruppen', sidebarOpen)}>
            🏢 {sidebarOpen && <span>Arbeitsgruppen</span>}
          </button>

          <button onClick={() => setActiveTab('berichte')} style={navButtonStyle(activeTab === 'berichte', sidebarOpen)}>
            📝 {sidebarOpen && <span>Berichte</span>}
          </button>

          <button onClick={() => setActiveTab('zeitauswertung')} style={navButtonStyle(activeTab === 'zeitauswertung', sidebarOpen)}>
            ⏱️ {sidebarOpen && <span>Zeitauswertung</span>}
          </button>
        </nav>

        {/* Footer / Toggle Button */}
        <div style={{ padding: '1rem', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {sidebarOpen && (
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              📞 078 835 36 32
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ backgroundColor: '#1f2937', color: '#9ca3af', border: 'none', borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>
        </div>
      </aside>

      {/* HAUPTINHALT (MAIN CONTENT AREA) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header Bar */}
        <header style={{ backgroundColor: '#111827', borderBottom: '1px solid #1f2937', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>
              {activeTab === 'listenansicht' && 'Schichtplaner – Listenansicht'}
              {activeTab === 'dashboard' && 'Zentrales Dashboard'}
              {activeTab === 'zellenansicht' && 'Kalender – Zellenansicht'}
              {activeTab === 'abwesenheiten' && 'Abwesenheiten & Urlaub'}
              {activeTab === 'mitglieder' && 'Mitarbeiter & Mitglieder'}
              {activeTab !== 'listenansicht' && activeTab !== 'dashboard' && activeTab !== 'zellenansicht' && activeTab !== 'abwesenheiten' && activeTab !== 'mitglieder' && 'Titan Tool'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderRadius: '20px', backgroundColor: '#1e293b', color: '#eab308', border: '1px solid #eab30833' }}>
              ● Live System
            </span>
          </div>
        </header>

        {/* Inhaltsbereich */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {/* ANSICHT: LISTENANSICHT (Schichtplaner) */}
          {activeTab === 'listenansicht' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px' }}>
              
              {/* Neue Schicht Formular */}
              <section style={{ backgroundColor: '#111827', padding: '1.5rem', borderRadius: '12px', border: '1px solid #1f2937' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#eab308' }}>+ Neue Schicht anlegen</h2>
                
                <form onSubmit={handleAddShift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>Titel / Einsatzort:</label>
                    <input
                      type="text"
                      placeholder="z. B. Stadtdienst, Sternenmarkt"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#090d16', color: '#fff', outline: 'none' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>Startzeit:</label>
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#090d16', color: '#fff', outline: 'none' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#9ca3af' }}>Endzeit:</label>
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #374151', backgroundColor: '#090d16', color: '#fff', outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: submitting ? '#ca8a04' : '#eab308',
                      color: '#000',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem'
                    }}
                  >
                    {submitting ? 'Speichert...' : 'Schicht eintragen'}
                  </button>
                </form>
              </section>

              {/* Geplante Schichten Liste */}
              <section>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#ffffff' }}>Geplante Schichten</h2>
                
                {loading ? (
                  <p style={{ color: '#9ca3af' }}>Lade Daten aus Supabase...</p>
                ) : shifts.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#111827', borderRadius: '12px', border: '1px dashed #374151', color: '#9ca3af' }}>
                    Keine Schichten vorhanden.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {shifts.map((shift) => (
                      <div
                        key={shift.id}
                        style={{
                          padding: '1rem 1.25rem',
                          backgroundColor: '#111827',
                          borderLeft: '4px solid #eab308',
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #1f2937',
                          borderRight: '1px solid #1f2937',
                          borderBottom: '1px solid #1f2937',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>{shift.title}</strong>
                          <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            📅 {new Date(shift.start_time).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                            {'  –  '} 
                            {new Date(shift.end_time).toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteShift(shift.id)}
                          style={{
                            backgroundColor: '#ef444415',
                            color: '#ef4444',
                            border: '1px solid #ef444433',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '500',
                          }}
                        >
                          Löschen
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

            </div>
          )}

          {/* PLATZHALTER FÜR ANDERE SEITEN */}
          {activeTab !== 'listenansicht' && (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <h3 style={{ fontSize: '1.25rem', color: '#eab308', marginBottom: '0.5rem' }}>Bereich: {activeTab.toUpperCase()}</h3>
              <p style={{ color: '#9ca3af' }}>Dieser Bereich wird als nächstes mit deinen Supabase-Daten verknüpft.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

// Hilfsfunktion für Navigations-Buttons
function navButtonStyle(isActive: boolean, isOpen: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.65rem 0.75rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: isActive ? '#eab30815' : 'transparent',
    color: isActive ? '#eab308' : '#9ca3af',
    fontWeight: isActive ? '600' : 'normal',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
    justifyContent: isOpen ? 'flex-start' : 'center',
  }
}