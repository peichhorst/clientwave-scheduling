import { DateFormatter } from '@internationalized/date'
import { useEffect, useMemo, useState } from 'react'
import { BookingForm } from './components/BookingForm'
import { CalendarPicker } from './components/CalendarPicker'
import { TimeSlotPicker } from './components/TimeSlotPicker'

type Availability = {
  dayOfWeek: number
  startTime: string
  endTime: string
  duration: number
  buffer: number
}

const DAYS_TO_SHOW = 14

const defaultLocale =
  typeof navigator === 'undefined' ? 'en-US' : navigator.language || 'en-US'

const dayFormatter = new DateFormatter(defaultLocale, {
  weekday: 'long',
  month: 'short',
  day: 'numeric'
})

const slotFormatter = new DateFormatter(defaultLocale, {
  hour: 'numeric',
  minute: '2-digit'
})

function buildCalendarDays(): Date[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Array.from({ length: DAYS_TO_SHOW }, (_, index) => {
    const nextDay = new Date(today)
    nextDay.setDate(today.getDate() + index)
    return nextDay
  })
}

function buildSlots(availability: Availability[], date: Date) {
  const dayOfWeek = date.getDay()
  const relevant = availability.filter(slot => slot.dayOfWeek === dayOfWeek)
  const slots: string[] = []

  relevant.forEach(slot => {
    const [startHours, startMinutes] = slot.startTime.split(':').map(Number)
    const [endHours, endMinutes] = slot.endTime.split(':').map(Number)
    const start = new Date(date)
    start.setHours(startHours, startMinutes, 0, 0)
    const end = new Date(date)
    end.setHours(endHours, endMinutes, 0, 0)
    const stride = (slot.duration + slot.buffer) * 60 * 1000
    let pointer = new Date(start)

    while (pointer.getTime() + slot.duration * 60 * 1000 <= end.getTime()) {
      slots.push(pointer.toISOString())
      pointer = new Date(pointer.getTime() + stride)
    }
  })

  return slots
}

const API_BASE_URL = 'https://clientwave.app/api'

export default function Scheduler() {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(() => buildCalendarDays()[0])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const container = document.getElementById('clientwave-scheduler') as HTMLElement | null
  const userId = container?.dataset.userId
  const token = container?.dataset.token
  const credential = userId ?? token
  const calendarDays = useMemo(() => buildCalendarDays(), [])
  const slots = useMemo(() => buildSlots(availability, selectedDate), [availability, selectedDate])

  useEffect(() => {
    if (!credential) {
      setErrorMessage('Missing user ID or token so availability cannot be loaded.')
      return
    }
    setIsLoading(true)
    setErrorMessage(null)
    const queryParam = userId
      ? `userId=${encodeURIComponent(userId)}`
      : `token=${encodeURIComponent(token ?? '')}`

    fetch(`${API_BASE_URL}/availability?${queryParam}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Unable to fetch availability.')
        }
        return res.json()
      })
      .then(data => setAvailability(data ?? []))
      .catch(() => setErrorMessage('Unable to load availability right now.'))
      .finally(() => setIsLoading(false))
  }, [credential, userId, token])

  useEffect(() => {
    setSelectedSlot(null)
  }, [selectedDate])

  const handleBook = async () => {
    if (!userId || !selectedSlot) return
    setStatusMessage(null)
    setIsSubmitting(true)
    try {
      const payload: Record<string, string> = {
        startTime: selectedSlot,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        notes: notes.trim()
      }
      if (userId) {
        payload.userId = userId
      }
      if (token) {
        payload.token = token
      }

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) {
        throw new Error('Booking request failed.')
      }
      setStatusMessage('Booking confirmed! Check your inbox for the confirmation.')
    } catch {
      setStatusMessage('Something went wrong while creating the booking.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const canBook =
    Boolean(selectedSlot && clientName.trim() && clientEmail.trim() && credential) && !isSubmitting

  const selectedDateLabel = dayFormatter.format(selectedDate)
  const formatSlotLabel = (slot: string) => slotFormatter.format(new Date(slot))

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-6 rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/80 sm:p-10">
        <header className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            ClientWave
          </p>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Schedule a consultation
          </h1>
          <p className="text-sm text-slate-500">
            Pick a day and time that works for you, then share a few details so we can
            kick off the conversation.
          </p>
        </header>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Choose a day
          </p>
          <CalendarPicker
            days={calendarDays}
            selectedDate={selectedDate}
            onChange={setSelectedDate}
          />
        </section>

        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Available slots
          </p>
          <TimeSlotPicker
            slots={slots}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            isLoading={isLoading}
            error={errorMessage}
            selectedDateLabel={selectedDateLabel}
            formatSlotLabel={formatSlotLabel}
          />
        </section>

        <section className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Your information
          </p>
          <BookingForm
            clientName={clientName}
            clientEmail={clientEmail}
            notes={notes}
            onChangeName={setClientName}
            onChangeEmail={setClientEmail}
            onChangeNotes={setNotes}
            onSubmit={handleBook}
            isSubmitting={isSubmitting}
            canSubmit={canBook}
          />
        </section>

        {statusMessage && (
          <p className="text-sm font-semibold text-green-600">{statusMessage}</p>
        )}
      </div>
    </div>
  )
}
