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
