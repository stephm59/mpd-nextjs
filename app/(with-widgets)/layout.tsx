import StickyCallBar from '@/components/ui/StickyCallBar'
import LocalReviewsWidget from '@/components/widgets/LocalReviewsWidget'
import QuickActionsButton from '@/components/widgets/QuickActionsButton'

export default function WithWidgetsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {children}
      <StickyCallBar />
      <LocalReviewsWidget />
      <QuickActionsButton />
    </>
  )
}
