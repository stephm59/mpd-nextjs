'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import emailjs from '@emailjs/browser'
import { X, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const schema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro invalide'),
  message: z.string().min(10, 'Minimum 10 caractères'),
})

type FormData = z.infer<typeof schema>

interface ContactFormProps {
  isOpen?: boolean
  onClose?: () => void
  title?: string
  description?: string
  inline?: boolean
}

export default function ContactForm({
  isOpen,
  onClose,
  title = 'Demander un devis gratuit',
  description = 'Remplissez ce formulaire et nous vous recontacterons rapidement pour établir votre devis personnalisé et sans engagement.',
  inline = false,
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus('sending')
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        {
          from_name: `${data.firstName} ${data.lastName}`,
          from_email: data.email,
          phone: data.phone,
          message: data.message,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  const formContent = (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {title && <h3 className="text-xl font-bold text-foreground">{title}</h3>}
      {description && <p className="text-muted-foreground text-sm">{description}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" {...register('firstName')} placeholder="Jean" />
          {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Dupont" />
          {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="jean@exemple.fr" />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="06 12 34 56 78" />
        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register('message')} rows={4} placeholder="Décrivez votre problème ou votre demande..." />
        {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-lg text-sm">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Message envoyé ! Nous vous recontactons très rapidement.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          Une erreur est survenue. Appelez-nous au 03 28 53 48 68.
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={status === 'sending'}>
        <Send className="w-4 h-4" />
        {status === 'sending' ? 'Envoi en cours...' : 'Envoyer ma demande'}
      </Button>
    </form>
  )

  if (inline) return formContent

  // Modal mode
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Dialog */}
      <div className="relative bg-background rounded-xl shadow-elevated w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
        {formContent}
      </div>
    </div>
  )
}
