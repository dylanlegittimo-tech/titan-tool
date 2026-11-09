'use client'

import { useState } from 'react'

interface Shift {
  id: string
  title: string
  start_time: string
  end_time: string
}

interface CalendarViewProps {
  shifts: Shift[]
}

export default function CalendarView({ shifts }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1
  if (startingDayOfWeek === -1) startingDayOfWeek = 6

  const daysInMonth = lastDayOfMonth.getDate()

  const daysArray = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    daysArray.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d))
  }

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  return (
    <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '6px', border: '1px solid #e4e4e7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#000000', textTransform: 'uppercase' }}>
          {monthNames[month]} {year}
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={prevMonth} style={{ backgroundColor: '#f4f4f5', color: '#000', border: '1px solid #e4e4e7', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>
            ◀️ Vorheriger
          </button>
          <button onClick={() => setCurrentDate(new Date())} style={{ backgroundColor: '#FFC800', color: '#000', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '900' }}>
            Heute
          </button>
          <button onClick={nextMonth} style={{ backgroundColor: '#f4f4f5', color: '#000', border: '1px solid #e4e4e7', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '700' }}>
            Nächster ▶️
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e4e4e7', border: '1px solid #e4e4e7', marginBottom: '1px' }}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div key={day} style={{ backgroundColor: '#fafafa', padding: '0.75rem', textAlign: 'center', fontWeight: '800', color: '#000000', fontSize: '0.85rem' }}>
            {day}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e4e4e7', border: '1px solid #e4e4e7' }}>
        {daysArray.map((date, idx) => {
          if (!date) {
            return <div key={empty-${idx}} style={{ backgroundColor: '#f4f4f5', minHeight: '110px' }} />
          }

          const isToday = new Date().toDateString() === date.toDateString()
          const dayShifts = shifts.filter((shift) => {
            const shiftDate = new Date(shift.start_time)
            return (
              shiftDate.getDate() === date.getDate() &&
              shiftDate.getMonth() === date.getMonth() &&
              shiftDate.getFullYear() === date.getFullYear()
            )
          })

          return (
            <div key={date.toISOString()} style={{ backgroundColor: isToday ? '#fffbeb' : '#ffffff', minHeight: '110px', padding: '0.5rem', borderTop: isToday ? '3px solid #FFC800' : 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: isToday ? '900' : '700', color: isToday ? '#b45309' : '#71717a', textAlign: 'right' }}>
                {date.getDate()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
                {dayShifts.map((shift) => (
                  <div key={shift.id} style={{ backgroundColor: '#FFC800', borderLeft: '4px solid #000000', padding: '0.35rem 0.4rem', borderRadius: '3px', fontSize: '0.75rem', color: '#000000' }}>
                    <div style={{ fontWeight: '900', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shift.title}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}