import { Button } from 'react-aria-components'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarPickerProps {
  days: Date[]
  selectedDate: Date
  onChange: (date: Date) => void
}

export function CalendarPicker({ days, selectedDate, onChange }: CalendarPickerProps) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map(date => {
        const isSelected = date.toDateString() === selectedDate.toDateString()
        return (
          <Button
            key={date.toISOString()}
            onPress={() => onChange(new Date(date))}
            className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-3 text-center transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
              isSelected
                ? 'border-brand-500 bg-brand-50 text-brand-700'
                : 'border-transparent bg-white text-slate-600 hover:border-slate-200'
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              {WEEKDAY_LABELS[date.getDay()]}
            </span>
            <span className="text-base font-semibold">{date.getDate()}</span>
          </Button>
        )
      })}
    </div>
  )
}
