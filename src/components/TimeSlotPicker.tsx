interface TimeSlotPickerProps {
  slots: string[]
  selectedSlot: string | null
  onSelectSlot: (slot: string) => void
  isLoading: boolean
  error?: string | null
  selectedDateLabel: string
  formatSlotLabel: (slot: string) => string
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  isLoading,
  error,
  selectedDateLabel,
  formatSlotLabel
}: TimeSlotPickerProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading availability...</p>
  }

  if (error) {
    return <p className="text-sm text-red-500">{error}</p>
  }

  if (!slots.length) {
    return (
      <p className="text-sm text-slate-500">
        No slots available for {selectedDateLabel}.
      </p>
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {slots.map(slot => {
        const isActive = selectedSlot === slot
        return (
          <button
            type="button"
            key={slot}
            onClick={() => onSelectSlot(slot)}
            className={`rounded-2xl border px-4 py-3 text-left font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isActive
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
            }`}
          >
            {formatSlotLabel(slot)}
          </button>
        )
      })}
    </div>
  )
}
