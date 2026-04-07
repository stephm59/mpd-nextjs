'use client'

import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'

export default function StickyCallBar() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY / document.documentElement.scrollHeight
      setVisible(scrolled > 0.2)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <a
        href="tel:0328534868"
        className="flex items-center justify-center gap-3 bg-accent text-white w-full py-4 font-bold text-lg shadow-elevated"
        aria-label="Appeler Mon p'tit Dépanneur"
      >
        <Phone className="w-5 h-5" />
        03 28 53 48 68
      </a>
    </div>
  )
}
