"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "DAOs",
    href: "/daos",
    description: "View and manage DAOs"
  },
  {
    title: "Proposals",
    href: "/proposals",
    description: "View and manage proposals"
  },
  {
    title: "AIA Meetings",
    href: "/meetings",
    description: "View all AIA meetings"
  },
  {
    title: "AIA List",
    href: "/aias",
    description: "View all available AIAs"
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <Link 
        href="/"
        className="text-xl font-bold"
      >
        DAO AI Agent
      </Link>
      <nav className="flex items-center space-x-6 lg:space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === item.href
                ? "text-foreground"
                : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </div>
  )
}
