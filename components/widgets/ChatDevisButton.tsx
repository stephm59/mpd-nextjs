'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import ContactForm from '@/components/forms/ContactForm'

export default function ChatDevisButton() {
  const [isFormOpen, setIsFormOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center hover:bg-primary-light transition-colors hover:scale-110 transform duration-200"
        aria-label="Demander un devis"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <ContactForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Demander un devis gratuit"
        description="Décrivez votre besoin et nous vous recontactons rapidement."
      />
    </>
  )
}
