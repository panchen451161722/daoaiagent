import { Metadata } from "next"

interface LayoutProps {
  params: {
    id: string
    meetingId: string
  }
}

export const generateMetadata = ({ params }: LayoutProps): Metadata => {
  return {
    title: "Meeting Details",
    description: "Meeting details and discussions",
    alternates: {
      canonical: `/proposals/${params.id}`
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
