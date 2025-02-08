import { Metadata } from "next"

interface LayoutProps {
  params: Promise<{
    id: string
    meetingId: string
  }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const p = await params
  return {
    title: "Meeting Details",
    description: "Meeting details and discussions",
    alternates: {
      canonical: `/proposals/${p.id}`
    }
  }
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
