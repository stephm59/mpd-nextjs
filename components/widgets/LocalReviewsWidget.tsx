'use client'

import { useState, useEffect, useRef } from 'react'
import { CheckCircle, X, Star } from 'lucide-react'

const localReviews = [
  { name: 'Sophie L.', city: 'Lille', rating: 5, review: "Intervention rapide pour ma fuite d'eau. Très satisfaite !", time: "Aujourd'hui" },
  { name: 'Marc D.', city: 'Roubaix', rating: 5, review: 'Plombier très professionnel, je recommande !', time: 'Hier' },
  { name: 'Julie M.', city: 'Tourcoing', rating: 5, review: 'Dépannage chaudière parfait, merci beaucoup', time: 'Il y a 2 jours' },
  { name: "Pierre R.", city: "Villeneuve-d'Ascq", rating: 5, review: 'Service excellent, tarifs transparents', time: 'Il y a 3 jours' },
  { name: 'Anne B.', city: 'Marcq-en-Barœul', rating: 5, review: 'Très bon artisan, travail soigné et rapide', time: 'Hier' },
  { name: 'Thomas K.', city: 'Wattrelos', rating: 5, review: 'Installation impeccable, équipe sympathique', time: 'Il y a 2 jours' },
  { name: 'Marie C.', city: 'Lomme', rating: 5, review: "Dépannage d'urgence, très réactif !", time: "Aujourd'hui" },
  { name: 'David L.', city: 'La Madeleine', rating: 5, review: 'Parfait du début à la fin, je recommande', time: 'Il y a 3 jours' },
]

export default function LocalReviewsWidget() {
  const [current, setCurrent] = useState(localReviews[0])
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const showRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  useEffect(() => {
    if (disabled) return

    const showNext = () => {
      setCurrent(localReviews[Math.floor(Math.random() * localReviews.length)])
      setVisible(true)
      setClosing(false)
    }

    showRef.current = setTimeout(showNext, 3000)
    intervalRef.current = setInterval(showNext, 8000)

    return () => {
      clearTimeout(showRef.current)
      clearInterval(intervalRef.current)
    }
  }, [disabled])

  useEffect(() => {
    if (!visible || disabled) return
    const t = setTimeout(() => {
      setClosing(true)
      setTimeout(() => { setVisible(false); setClosing(false) }, 300)
    }, 3000)
    return () => clearTimeout(t)
  }, [visible, disabled])

  function dismiss() {
    setDisabled(true)
    setClosing(true)
    clearTimeout(showRef.current)
    clearInterval(intervalRef.current)
    setTimeout(() => { setVisible(false); setClosing(false) }, 300)
  }

  // Hidden on mobile (md:block), hidden if not visible
  if (!visible || disabled) return null

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 hidden md:block transition-all duration-300 transform ${
        closing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div className="bg-white rounded-lg shadow-elevated border border-gray-200 p-4 max-w-sm relative animate-slide-in-left">
        <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-lg" />
        <button
          onClick={dismiss}
          className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>
        <div className="flex items-start gap-3 mt-2">
          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1 pr-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{current.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-sm">{current.city}</span>
            </div>
            <div className="flex gap-0.5 mb-2">
              {[...Array(current.rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-rating text-rating" />
              ))}
            </div>
            <p className="text-gray-800 text-sm leading-relaxed mb-1">&quot;{current.review}&quot;</p>
            <p className="text-gray-500 text-xs">{current.time}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
