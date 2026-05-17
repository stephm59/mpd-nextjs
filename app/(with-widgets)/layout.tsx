import StickyCallBar from '@/components/ui/StickyCallBar'
import LocalReviewsWidget from '@/components/widgets/LocalReviewsWidget'
import ChatDevisButton from '@/components/widgets/ChatDevisButton'

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
      <ChatDevisButton />
    </>
  )
}
