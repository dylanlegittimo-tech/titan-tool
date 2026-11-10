'use client'

import { useState } from 'react'
import CalendarView from '@/components/CalendarView'

export default function Home() {
  const [activeTab, setActiveTab] = useState('konto')

  // Zustände für die Kontodaten
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const navButtonStyle = (tabName: string) => ({
    padding: '0.6rem 1rem',
    borderRadius: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left' as const,
    fontWeight: activeTab === tabName ? 'bold' : 'normal',
    backgroundColor: activeTab === tabName ? '#fee2e2' : 'transparent',
    color: activeTab === tabName ? '#dc2626' : '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Sidebar Navigation */}
      <aside style={{ width: '240px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', padding: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#dc2626', marginBottom: '1.5rem' }}>TITAN</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button style={navButtonStyle('konto')} onClick={() => setActiveTab('konto')}>
            👤 Mein Konto
          </button>
          <button style={navButtonStyle('kalender')} onClick={() => setActiveTab('kalender')}>
            📅 Kalender
          </button>
          <button style={navButtonStyle('einsatzplan')} onClick={() => setActiveTab('einsatzplan')}>
            📋 Einsatzplan
          </button>
          <button style={navButtonStyle('mitglieder')} onClick={() => setActiveTab('mitglieder')}>
            👥 Mitglieder & Freigaben
          </button>
          <button style={navButtonStyle('abwesenheiten')} onClick={() => setActiveTab('abwesenheiten')}>
            🏖️ Abwesenheiten
          </button>
          <button style={navButtonStyle('arbeitsgruppen')} onClick={() => setActiveTab('arbeitsgruppen')}>
            ⚙️ Arbeitsgruppen
          </button>
          <button style={navButtonStyle('berichte')} onClick={() => setActiveTab('berichte')}>
            📊 Berichte
          </button>
          <button style={navButtonStyle('zeitauswertung')} onClick={() => setActiveTab('zeitauswertung')}>
            ⏱️ Zeitauswertung
          </button>
        </nav>
      </aside>

      {/* Hauptbereich */}
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* TAB: KONTO */}
        {activeTab === 'konto' && (
          <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>Mein Konto</h1>
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Hier kannst du deine persönlichen Profilangaben verwalten.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Feld 1: Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>
                  Vollständiger Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="z. B. Max Mustermann"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                />
              </div>

              {/* Feld 2: E-Mail */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@beispiel.ch"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                />
              </div>

              {/* Feld 3: Telefon */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.35rem' }}>
                  Telefonnummer
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  style={{ width: '100%', padding: '0.5rem 0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', outline: 'none' }}
                />
              </div>

              {/* Button */}
              <div style={{ marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => alert('Speichern-Funktion wird als Nächstes mit Supabase verbunden!')}
                  style={{ backgroundColor: '#dc2626', color: '#ffffff', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '0.375rem', fontWeight: '500', cursor: 'pointer' }}
                >
                  Änderungen speichern
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Andere Tabs (Platzhalter) */}
        {activeTab === 'kalender' && <CalendarView />}
        {activeTab === 'einsatzplan' && <div>Bereich: Einsatzplan</div>}
        {activeTab === 'mitglieder' && <div>Bereich: Mitglieder & Freigaben</div>}
        {activeTab === 'abwesenheiten' && <div>Bereich: Abwesenheiten</div>}
        {activeTab === 'arbeitsgruppen' && <div>Bereich: Arbeitsgruppen</div>}
        {activeTab === 'berichte' && <div>Bereich: Berichte</div>}
        {activeTab === 'zeitauswertung' && <div>Bereich: Zeitauswertung</div>}
      </main>
    </div>
  )
}