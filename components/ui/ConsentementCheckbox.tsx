'use client'

import { useState } from 'react'
import { LegalModal } from './LegalModal'
import { ContenuPolitiqueConfidentialite } from '@/components/legal/ContenuPolitiqueConfidentialite'
import { ContenuCGV } from '@/components/legal/ContenuCGV'

interface ConsentementCheckboxProps {
  id?: string
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  disabled?: boolean
}

export function ConsentementCheckbox({
  id = 'consentement',
  checked,
  onChange,
  error,
  disabled = false,
}: ConsentementCheckboxProps) {
  const [showPolitique, setShowPolitique] = useState(false)
  const [showCgv, setShowCgv] = useState(false)

  return (
    <>
      <div className="space-y-1">
        <label className="flex items-start gap-2.5 text-sm text-foreground cursor-pointer">
          <input
            id={id}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="mt-0.5 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary disabled:opacity-50 flex-shrink-0"
          />
          <span>
            J&apos;accepte la{' '}
            <button
              type="button"
              onClick={() => setShowPolitique(true)}
              className="text-primary underline hover:no-underline"
              disabled={disabled}
            >
              politique de confidentialité
            </button>
            {' '}et les{' '}
            <button
              type="button"
              onClick={() => setShowCgv(true)}
              className="text-primary underline hover:no-underline"
              disabled={disabled}
            >
              conditions générales de vente
            </button>
            . <span className="text-red-600">*</span>
          </span>
        </label>
        {error && (
          <p className="text-destructive text-xs ml-6">{error}</p>
        )}
      </div>

      <LegalModal
        isOpen={showPolitique}
        onClose={() => setShowPolitique(false)}
        title="Politique de confidentialité"
      >
        <ContenuPolitiqueConfidentialite />
      </LegalModal>

      <LegalModal
        isOpen={showCgv}
        onClose={() => setShowCgv(false)}
        title="Conditions générales de vente"
      >
        <ContenuCGV />
      </LegalModal>
    </>
  )
}
