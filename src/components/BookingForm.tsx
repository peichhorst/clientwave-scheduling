import React from 'react'
import type { ChangeEvent } from 'react'
import { Label, TextArea, TextField } from 'react-aria-components'

interface BookingFormProps {
  clientName: string
  clientEmail: string
  notes: string
  onChangeName: (value: string) => void
  onChangeEmail: (value: string) => void
  onChangeNotes: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  canSubmit: boolean
}

export function BookingForm({
  clientName,
  clientEmail,
  notes,
  onChangeName,
  onChangeEmail,
  onChangeNotes,
  onSubmit,
  isSubmitting,
  canSubmit
}: BookingFormProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (canSubmit) {
      onSubmit()
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1">
        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Full name
        </Label>
        <TextField
          value={clientName}
          onChange={(value: string) => onChangeName(value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          placeholder="Jane Doe"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Email
        </Label>
        <TextField
          value={clientEmail}
          onChange={(value: string) => onChangeEmail(value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          placeholder="jane@clientwave.app"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Notes (optional)
        </Label>
        <TextArea
          value={notes}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChangeNotes(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
          placeholder="Anything we should know?"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-slate-300 disabled:text-slate-500"
        disabled={!canSubmit}
      >
        {isSubmitting ? 'Confirming...' : 'Confirm booking'}
      </button>
    </form>
  )
}
