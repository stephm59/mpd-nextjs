'use client'

import { useRef, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Send, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ConsentementCheckbox } from '@/components/ui/ConsentementCheckbox'
import { envoyerContactAction } from '@/app/(with-widgets)/contact/actions'

const schema = z.object({
  firstName: z.string().min(2, 'Minimum 2 caractères'),
  lastName: z.string().min(2, 'Minimum 2 caractères'),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro invalide'),
  message: z.string().min(10, 'Minimum 10 caractères'),
  consentement: z.literal(true, {
    message: 'Vous devez accepter pour continuer',
  }),
  photos: z
    .array(
      z.object({
        name: z.string(),
        base64: z.string(), // Data URL sans le préfixe "data:image/...;base64,"
      })
    )
    .max(1)
    .optional(),
})

type FormData = z.infer<typeof schema>

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // Résultat = "data:image/jpeg;base64,XXX" → on garde uniquement la partie base64
      const base64 = result.split(',')[1] ?? ''
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

interface ContactFormProps {
  isOpen?: boolean
  onClose?: () => void
  title?: string
  description?: string
  inline?: boolean
  defaultMessage?: string
}

export default function ContactForm({
  isOpen,
  onClose,
  title = 'Demander un devis gratuit',
  description = 'Remplissez ce formulaire et nous vous recontacterons rapidement pour établir votre devis personnalisé et sans engagement.',
  inline = false,
  defaultMessage = '',
}: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)
  const [photo, setPhoto] = useState<{ name: string; base64: string; preview: string } | null>(null)
  const [photoError, setPhotoError] = useState<string>('')
  const [convertingHeic, setConvertingHeic] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { message: defaultMessage },
  })

  const consentement = watch('consentement')

  async function convertHeicToJpeg(file: File): Promise<File> {
    setConvertingHeic(true)
    try {
      const heic2any = (await import('heic2any')).default
      const converted = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      })
      const blob = Array.isArray(converted) ? converted[0] : converted
      return new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' })
    } finally {
      setConvertingHeic(false)
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Une seule photo autorisée : on ne traite que le premier fichier
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoError('')

    const MAX_SIZE = 2 * 1024 * 1024 // 2 Mo (marge Vercel Functions ~4.5 Mo)
    let fileToProcess = file

    // Convertir HEIC → JPEG si nécessaire
    const isHeic =
      file.type === 'image/heic' || file.type === 'image/heif' || /\.(heic|heif)$/i.test(file.name)
    if (isHeic) {
      try {
        fileToProcess = await convertHeicToJpeg(file)
      } catch (err) {
        console.error('[handlePhotoChange] Erreur conversion HEIC:', err)
        setPhotoError(
          `Impossible de convertir la photo ${file.name}. Prenez une nouvelle photo en JPEG.`
        )
        if (fileInputRef.current) fileInputRef.current.value = ''
        return
      }
    }

    // Vérifier la taille (après conversion si HEIC)
    if (fileToProcess.size > MAX_SIZE) {
      setPhotoError('La photo dépasse 2 Mo. Réduisez sa taille.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // Vérifier le type MIME final
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(fileToProcess.type)) {
      setPhotoError(`Format non supporté (${fileToProcess.type}). Utilisez JPEG, PNG ou WEBP.`)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const base64 = await fileToBase64(fileToProcess)
    const preview = URL.createObjectURL(fileToProcess)

    // Remplace la photo existante le cas échéant
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return { name: fileToProcess.name, base64, preview }
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleRemovePhoto() {
    setPhoto((prev) => {
      if (prev) URL.revokeObjectURL(prev.preview)
      return null
    })
    setPhotoError('')
  }

  const onSubmit = async (data: FormData) => {
    setStatus('sending')
    setErrorMessage('')

    startTransition(async () => {
      const result = await envoyerContactAction({
        ...data,
        photos: photo ? [{ name: photo.name, base64: photo.base64 }] : [],
      })

      if (result.success) {
        setStatus('success')
        reset()
        setPhoto(null)
        setTimeout(() => {
          setStatus('idle')
          onClose?.()
        }, 3000)
      } else {
        setStatus('error')
        setErrorMessage(result.error)
      }
    })
  }

  if (status === 'success') {
    const successContent = (
      <div className="text-center py-8">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h3 className="text-xl font-bold mb-2">Message envoyé !</h3>
        <p className="text-muted-foreground">On vous rappelle dans l&apos;heure.</p>
        <p className="font-semibold mt-2">☎ 03 28 53 48 68</p>
      </div>
    )
    if (inline) return successContent
    if (!isOpen) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
        <div className="relative bg-background rounded-xl shadow-elevated w-full max-w-lg p-6 animate-fade-in-up">
          <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-muted transition-colors" aria-label="Fermer">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
          {successContent}
        </div>
      </div>
    )
  }

  const isLoading = status === 'sending' || isPending

  const formContent = (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {title && <h3 className="text-xl font-bold text-foreground">{title}</h3>}
      {description && <p className="text-muted-foreground text-sm">{description}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" {...register('firstName')} placeholder="Jean" disabled={isLoading} />
          {errors.firstName && <p className="text-destructive text-xs">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" {...register('lastName')} placeholder="Dupont" disabled={isLoading} />
          {errors.lastName && <p className="text-destructive text-xs">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register('email')} placeholder="jean@exemple.fr" disabled={isLoading} />
        {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Téléphone</Label>
        <Input id="phone" type="tel" {...register('phone')} placeholder="06 12 34 56 78" disabled={isLoading} />
        {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" {...register('message')} rows={4} placeholder="Décrivez votre problème ou votre demande..." disabled={isLoading} />
        {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Photo (optionnel)</Label>
        <p className="text-xs text-muted-foreground">
          Une photo peut nous aider à mieux comprendre votre demande. Max 2 Mo.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          onChange={handlePhotoChange}
          disabled={isLoading || convertingHeic}
          className="hidden"
          id="photos-input"
        />

        {photo === null && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || convertingHeic}
          >
            {convertingHeic ? 'Conversion HEIC en cours...' : 'Ajouter une photo'}
          </Button>
        )}

        {photo !== null && (
          <div className="relative aspect-square w-32 rounded-lg overflow-hidden border border-border mt-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.preview} alt={photo.name} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isLoading}
              className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white p-1 rounded-full transition-colors"
              aria-label={`Supprimer la photo ${photo.name}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {photoError && <p className="text-destructive text-xs">{photoError}</p>}
      </div>

      <ConsentementCheckbox
        checked={consentement === true}
        onChange={(c) => setValue('consentement', c as true, { shouldValidate: true })}
        error={errors.consentement?.message}
        disabled={isLoading}
      />

      {status === 'error' && (
        <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-lg text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage || 'Une erreur est survenue. Appelez-nous au 03 28 53 48 68.'}
        </div>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        <Send className="w-4 h-4" />
        {isLoading ? 'Envoi en cours...' : 'Envoyer ma demande'}
      </Button>
    </form>
  )

  if (inline) return formContent

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
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
