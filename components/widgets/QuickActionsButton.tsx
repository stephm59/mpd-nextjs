'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageCircle, X, Phone, Calendar, Mail, ChevronRight } from 'lucide-react'

export default function QuickActionsButton() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-elevated flex items-center justify-center hover:bg-primary-light transition-colors hover:scale-110 transform duration-200"
        aria-label="Nous contacter"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-xl shadow-elevated w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">
                Comment pouvons-nous vous aider ?
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-2.5">
              <a
                href="tel:0328534868"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Nous appeler</p>
                  <p className="text-sm text-muted-foreground">03 28 53 48 68</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </a>

              <Link
                href="/rdv"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Prendre RDV</p>
                  <p className="text-sm text-muted-foreground">Réservez votre créneau</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>

              <Link
                href="/rdv?tab=contact"
                onClick={() => setIsOpen(false)}
                className="group flex items-center gap-3 rounded-lg border border-border bg-background p-4 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">Nous écrire</p>
                  <p className="text-sm text-muted-foreground">Posez votre question</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
