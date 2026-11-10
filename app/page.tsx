'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import CalendarView from '@/app/components/CalendarView'

interface Shift {
  id: string
  title: string
  start_time: string
  end_time: string
}

interface Profile {
  id: string
  email: string
  is_approved: boolean
}

export default function Home() {
  const [session, setSession] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [isApproved, setIsApproved] = useState<boolean | null>(null)

  const [activeTab, setActiveTab] = useState('kalender')
  const [shifts, setShifts] = useState<Shift[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) {
        await checkApproval(session.user.id, session.user.email)
      }
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) {
        await checkApproval(session.user.id, session.user.email)
      } else {
        setIsApproved(null)
      }
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkApproval = async (userId: string, userEmail?: string) => {
    let { data, error } = await supabase
      .from('profiles')
      .select('is_approved')
      .eq('id', userId)
      .single()

    // Falls noch kein Profil existiert, legen wir es direkt hier an
    if (!data) {
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: userId, email: userEmail, is_approved: false }])
        .select('is_approved')
        .single()
      
      if (newProfile) {
        setIsApproved(newProfile.is_approved)
      } else {
        setIsApproved(false)
      }
    } else {
      setIsApproved(data.is_approved)
    }
  }

  const fetchShifts = async () => {
    setLoading(true)
    const { data } = await supabase.from('shifts').select('*').order('start_time', { ascending: true })
    setShifts(data || [])
    setLoading(false)
  }

  const fetchProfiles = async () => {
    const { data } = await supabase.from('profiles').select('*')
    setProfiles(data || [])
  }

  useEffect(() => {
    if (session && isApproved) {
      fetchShifts()
      fetchProfiles()
    }
  }, [session, isApproved])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')

    if (isRegistering) {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setAuthError(error.message)
      } else {
        // Direktes Anlegen in profiles erzwingen falls User direkt eingeloggt wird
        if (data.user) {
          await supabase.from('profiles').upsert([
            { id: data.user.id, email: data.user.email, is_approved: false }
          ])
        }
        alert('Registrierung erfolgreich! Dein Konto muss nun von einem Administrator freigegeben werden.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setAuthError('Login fehlgeschlagen: ' + error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsApproved(null)
  }

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_approved: !currentStatus })
      .eq('id', userId)

    if (error) alert('Fehler: ' + error.message)
    else fetchProfiles()
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Möchtest du diesen Account wirklich ablehnen/löschen?')) return
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) alert('Fehler: ' + error.message)
    else fetchProfiles()
  }

  const handleAddShift = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startTime || !endTime) return
    setSubmitting(true)
    const { error } = await supabase.from('shifts').insert([{ title, start_time: startTime, end_time: endTime }])
    if (!error) {
      setTitle(''); setStartTime(''); setEndTime(''); fetchShifts()
    }
    setSubmitting(false)
  }

  const handleDeleteShift = async (id: string) => {
    if (!confirm('Einsatz wirklich löschen?')) return
    const { error } = await supabase.from('shifts').delete().eq('id', id)
    if (!error) fetchShifts()
  }

  if (authLoading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5' }}>
        <div style={{ fontWeight: '800', color: '#000' }}>TITAN TOOL LÄDT...</div>
      </div>
    )
  }

  if (!session) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e4e4e7', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
            <div style={{ width: '42px', height: '42px', backgroundColor: '#FFC800', color: '#000', fontWeight: '900', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>T</div>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#000' }}>TITAN</div>
              <div style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold' }}>SPEZIALBEWACHUNGEN</div>
            </div>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' }}>
            {isRegistering ? 'Mitarbeiter Registrierung' : 'Mitarbeiter Login'}
          </h2>
          {authError && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1rem' }}>{authError}</div>}
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>E-Mail-Adresse</label>
              <input type="email" placeholder="name@titan-sicherheit.ch" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.3rem' }}>Passwort</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8', outline: 'none' }} />
            </div>
            <button type="submit" style={{ backgroundColor: '#FFC800', color: '#000', border: 'none', padding: '0.85rem', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase', marginTop: '0.5rem' }}>
              {isRegistering ? 'Registrieren anfragen' : 'Anmelden'}
            </button>
          </form>
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button onClick={() => setIsRegistering(!isRegistering)} style={{ background: 'none', border: 'none', color: '#71717a', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}>
              {isRegistering ? 'Bereits freigegeben? Hier anmelden' : 'Noch kein Konto? Registrieren'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isApproved === false) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', border: '1px solid #e4e4e7', width: '100%', maxWidth: '450px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}>Freigabe ausstehend</h2>
          <p style={{ color: '#52525b', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
            Dein Konto wurde erfolgreich erstellt, muss jedoch erst von einem Administrator von <strong>Titan Spezialbewachungen</strong> freigegeben werden.
          </p>
          <button onClick={handleLogout} style={{ backgroundColor: '#f4f4f5', color: '#000', border: '1px solid #d4d4d8', padding: '0.75rem 1.5rem', borderRadius: '4px', fontWeight: '700', cursor: 'pointer' }}>
            Abmelden
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f4f5', color: '#18181b', fontFamily: 'system-ui, sans-serif' }}>
      <aside style={{ width: sidebarOpen ? '270px' : '75px', backgroundColor: '#ffffff', borderRight: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', transition: 'width 0.2s ease' }}>
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', backgroundColor: '#FFC800', color: '#000', fontWeight: '900', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>T</div>
          {sidebarOpen && (
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#000' }}>TITAN</div>
              <div style={{ fontSize: '0.65rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 'bold' }}>SPEZIALBEWACHUNGEN</div>
            </div>
          )}
        </div>

        <nav style={{ flex: 1, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', overflowY: 'auto' }}>
          <button onClick={() => setActiveTab('konto')} style={navButtonStyle(activeTab === 'konto', sidebarOpen)}>👤 {sidebarOpen && <span>Mein Konto</span>}</button>
          <button onClick={() => setActiveTab('kalender')} style={navButtonStyle(activeTab === 'kalender', sidebarOpen)}>📅 {sidebarOpen && <span>Kalender</span>}</button>
          <button onClick={() => setActiveTab('einsatzplan')} style={navButtonStyle(activeTab === 'einsatzplan', sidebarOpen)}>📋 {sidebarOpen && <span>Einsatzplan</span>}</button>
          <button onClick={() => setActiveTab('mitglieder')} style={navButtonStyle(activeTab === 'mitglieder', sidebarOpen)}>👥 {sidebarOpen && <span>Mitglieder & Freigaben</span>}</button>
          <button onClick={() => setActiveTab('abwesenheiten')} style={navButtonStyle(activeTab === 'abwesenheiten', sidebarOpen)}>🏖️ {sidebarOpen && <span>Abwesenheiten</span>}</button>
          <button onClick={() => setActiveTab('arbeitsgruppen')} style={navButtonStyle(activeTab === 'arbeitsgruppen', sidebarOpen)}>🏢 {sidebarOpen && <span>Arbeitsgruppen</span>}</button>
          <button onClick={() => setActiveTab('berichte')} style={navButtonStyle(activeTab === 'berichte', sidebarOpen)}>📝 {sidebarOpen && <span>Berichte</span>}</button>
          <button onClick={() => setActiveTab('zeitauswertung')} style={navButtonStyle(activeTab === 'zeitauswertung', sidebarOpen)}>⏱️ {sidebarOpen && <span>Zeitauswertung</span>}</button>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid #e4e4e7', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sidebarOpen && <div style={{ fontSize: '0.75rem', color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis' }}>Angemeldet:<br/><strong>{session.user.email}</strong></div>}
          <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '4px', padding: '0.5rem', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}>
            {sidebarOpen ? '🚪 Abmelden' : '🚪'}
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e4e4e7', padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0, color: '#000000', textTransform: 'uppercase' }}>{activeTab.toUpperCase()}</h1>
          <span style={{ fontSize: '0.8rem', padding: '0.4rem 0.9rem', borderRadius: '4px', backgroundColor: '#FFC800', color: '#000', fontWeight: '800' }}>TITAN TOOL LIVE</span>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {activeTab === 'kalender' && <CalendarView shifts={shifts} />}

          {activeTab === 'mitglieder' && (
            <div style={{ maxWidth: '900px', backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}>Mitarbeiter-Freigaben</h2>
              <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Hier kannst du neu registrierte Mitarbeiter für das Titan Tool freigeben oder den Zugriff sperren.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {profiles.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #e4e4e7', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                    <div>
                      <strong style={{ fontSize: '0.95rem' }}>{p.email}</strong>
                      <div style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        Status: {p.is_approved ? <span style={{ color: '#16a34a', fontWeight: 'bold' }}>● Freigegeben</span> : <span style={{ color: '#ca8a04', fontWeight: 'bold' }}>● Wartet auf Freigabe</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleToggleApproval(p.id, p.is_approved)}
                        style={{
                          backgroundColor: p.is_approved ? '#fef08a' : '#22c55e',
                          color: p.is_approved ? '#854d0e' : '#fff',
                          border: 'none', padding: '0.45rem 0.9rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem'
                        }}
                      >
                        {p.is_approved ? 'Sperren' : 'Freigeben'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(p.id)}
                        style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.45rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '0.8rem' }}
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'einsatzplan' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem', maxWidth: '1000px' }}>
              <section style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1.25rem', textTransform: 'uppercase' }}>+ Neuen Einsatz anlegen</h2>
                <form onSubmit={handleAddShift} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Titel / Objekt / Ort:</label>
                    <input type="text" placeholder="z. B. Objektschutz Bank" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8' }} required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Startzeit:</label>
                      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8' }} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Endzeit:</label>
                      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d4d4d8' }} required />
                    </div>
                  </div>
                  <button type="submit" disabled={submitting} style={{ padding: '0.85rem', backgroundColor: '#FFC800', color: '#000', border: 'none', borderRadius: '4px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase' }}>
                    {submitting ? 'Speichert...' : 'Einsatz Speichern'}
                  </button>
                </form>
              </section>

              <section>
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '1rem', textTransform: 'uppercase' }}>Aktuelle Einsätze</h2>
                {loading ? <p>Lade Einsätze...</p> : shifts.map((shift) => (
                  <div key={shift.id} style={{ padding: '1.1rem', backgroundColor: '#ffffff', borderLeft: '5px solid #FFC800', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', border: '1px solid #e4e4e7' }}>
                    <div>
                      <strong>{shift.title}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#52525b' }}>📅 {new Date(shift.start_time).toLocaleString()} – {new Date(shift.end_time).toLocaleString()}</div>
                    </div>
                    <button onClick={() => handleDeleteShift(shift.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.45rem 0.8rem', borderRadius: '4px', cursor: 'pointer' }}>Löschen</button>
                  </div>
                ))}
              </section>
            </div>
          )}

          {activeTab !== 'einsatzplan' && activeTab !== 'kalender' && activeTab !== 'mitglieder' && (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e4e4e7' }}>
              <h3>Bereich: {activeTab.toUpperCase()}</h3>
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
    display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.7rem 0.8rem',
    borderRadius: '4px', border: 'none', backgroundColor: isActive ? '#FFC800' : 'transparent',
    color: isActive ? '#000000' : '#52525b', fontWeight: isActive ? '800' : '600',
    cursor: 'pointer', textAlign: 'left', fontSize: '0.9rem', justifyContent: isOpen ? 'flex-start' : 'center',
  }
}