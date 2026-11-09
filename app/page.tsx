'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CalendarView from './components/CalendarView'

interface Shift {
  id: string
  title: string
  start_time: string
  end_time: string
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('kalender')
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f5', color: '#18181b', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* SIDEBAR NAVIGATION (Webseiten-Stil) */}
      <aside style={{
        width: sidebarOpen ? '270px' : '75px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e4e4e7',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        boxShadow: '2px 0 10px rgba(0,0,0,0.03)'
      }}>
        {/* Branding Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            backgroundColor: '#FFC800',
            color: '#000000',
            fontWeight: '900',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            flexShrink: 0
          }}>
            T
          </div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#000000', letterSpacing: '0.05em' }}>TITAN</div>
              <div style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 'bold' }}>SPEZIALBEWACHUNGEN</div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          
          <button onClick={() => setActiveTab('konto')} style={navButtonStyle(activeTab === 'konto', sidebarOpen)}>
            👤 {sidebarOpen && <span>Mein Konto</span>}
          </button>

          <button onClick={() => setActiveTab('kalender')} style={navButtonStyle(activeTab === 'kalender', sidebarOpen)}>
            📅 {sidebarOpen && <span>Kalender</span>}
          </button>

          <button onClick={() => setActiveTab('einsatzplan')} style={navButtonStyle(activeTab === 'einsatzplan', sidebarOpen)}>
            📋 {sidebarOpen && <span>Einsatzplan</span>}
          </button>

          <button onClick={() => setActiveTab('abwesenheiten')} style={navButtonStyle(activeTab === 'abwesenheiten', sidebarOpen)}>
            🏖️ {sidebarOpen && <span>Abwesenheiten</span>}
          </button>

          <button onClick={() => setActiveTab('mitglieder')} style={navButtonStyle(activeTab === 'mitglieder', sidebarOpen)}>
            👥 {sidebarOpen && <span>Mitglieder</span>}
          </button>

          <button onClick={() => setActiveTab('arbeitsgruppen')} style={navButtonStyle(activeTab === 'arbeitsgruppen', sidebarOpen)}>
            🏢 {sidebarOpen && <span>Arbeitsgruppen</span>}
          </button>

          <button onClick={() => setActiveTab('berichte')} style={navButtonStyle(activeTab === 'berichte', sidebarOpen)}>
            📝 {sidebarOpen && <span>Berichte (Raporte)</span>}
          </button>

          <button onClick={() => setActiveTab('zeitauswertung')} style={navButtonStyle(activeTab === 'zeitauswertung', sidebarOpen)}>
            ⏱️ {sidebarOpen && <span>Zeitauswertung</span>}
          </button>

        </nav>

        {/* Footer Toggle */}
        <div style={{ padding: '1rem', borderTop: '1px solid #e4e4e7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {sidebarOpen && (
            <div style={{ fontSize: '0.75rem', color: '#71717a', fontWeight: '500' }}>
              titan-sicherheit.ch
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ backgroundColor: '#f4f4f5', color: '#000000', border: '1px solid #e4e4e7', borderRadius: '4px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
          >
            {sidebarOpen ? '◀️' : '▶️'}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Header Bar (Clean Web Design) */}
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e4e4e7', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0, color: '#000000', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {activeTab === 'konto' && 'Mein Konto & Profil'}
              {activeTab === 'kalender' && 'Kalenderansicht'}
              {activeTab === 'einsatzplan' && 'Einsatzplan & Schichtverwaltung'}
              {activeTab === 'abwesenheiten' && 'Abwesenheiten & Urlaube'}
              {activeTab === 'mitglieder' && 'Mitgliederverwaltung'}
              {activeTab === 'arbeitsgruppen' && 'Arbeitsgruppen & Zuweisung'}
              {activeTab === 'berichte' && 'Dienstrapporte & Kundenbereich'}
              {activeTab === 'zeitauswertung' && 'Zeitauswertung & Nachtstunden'}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', borderRadius: '4px', backgroundColor: '#FFC800', color: '#000000', fontWeight: '800', letterSpacing: '0.05em' }}>
              TITAN TOOL LIVE
            </span>
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          
          {/* TAB: KALENDER */}
          {activeTab === 'kalender' && (
            <CalendarView shifts={shifts} />
          )}

          {/* TAB: EINSATZPLAN */}
          {activeTab === 'einsatzplan' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px' }}>
              
              <section style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.25rem', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.03em' }}>+ Neuen Einsatz anlegen</h2>
                
                <form onSubmit={handleAddShift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#3f3f46', fontWeight: '600' }}>Titel / Objekt / Ort:</label>
                    <input
                      type="text"
                      placeholder="z. B. Objektschutz Bank, Veranstaltungssicherheit"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', color: '#000', outline: 'none', fontSize: '0.95rem' }}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#3f3f46', fontWeight: '600' }}>Startzeit:</label>
                      <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', color: '#000', outline: 'none' }}
                        required
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', color: '#3f3f46', fontWeight: '600' }}>Endzeit:</label>
                      <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8', backgroundColor: '#ffffff', color: '#000', outline: 'none' }}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.85rem',
                      backgroundColor: submitting ? '#eab308' : '#FFC800',
                      color: '#000000',
                      border: 'none',
                      borderRadius: '4px',
                      fontWeight: '900',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontSize: '0.95rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {submitting ? 'Speichert...' : 'Einsatz Speichern'}
                  </button>
                </form>
              </section>

              {/* Geplante Einsätze */}
              <section>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1rem', color: '#000000', textTransform: 'uppercase' }}>Aktuelle Einsätze</h2>
                
                {loading ? (
                  <p style={{ color: '#71717a' }}>Lade Einsätze aus Datenbank...</p>
                ) : shifts.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px dashed #d4d4d8', color: '#71717a' }}>
                    Keine Einsätze eingetragen.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {shifts.map((shift) => (
                      <div
                        key={shift.id}
                        style={{
                          padding: '1.1rem 1.25rem',
                          backgroundColor: '#ffffff',
                          borderLeft: '5px solid #FFC800',
                          borderRadius: '6px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid #e4e4e7',
                          borderRight: '1px solid #e4e4e7',
                          borderBottom: '1px solid #e4e4e7',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '1.05rem', color: '#000000', fontWeight: '800' }}>{shift.title}</strong>
                          <div style={{ color: '#52525b', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                            📅 {new Date(shift.start_time).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} 
                            {'  –  '} 
                            {new Date(shift.end_time).toLocaleString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteShift(shift.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            padding: '0.45rem 0.8rem',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: '700',
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

          {/* PLATZHALTER */}
          {activeTab !== 'einsatzplan' && activeTab !== 'kalender' && (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
              <h3 style={{ fontSize: '1.2rem', color: '#000000', fontWeight: '900', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Bereich: {activeTab.toUpperCase()}</h3>
              <p style={{ color: '#71717a' }}>Bereit für die Modul-Entwicklung im Titan Web-Design.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}

function navButtonStyle(isActive: boolean, isOpen: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
    padding: '0.7rem 0.8rem',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: isActive ? '#FFC800' : 'transparent',
    color: isActive ? '#000000' : '#52525b',
    fontWeight: isActive ? '800' : '600',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '0.9rem',
    transition: 'all 0.15s ease',
    justifyContent: isOpen ? 'flex-start' : 'center',
  }
}