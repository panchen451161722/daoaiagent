"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navItems = [
  {
    title: "DAO",
    pattern: /^\/(?:daos|proposals|manifesto)(?:\/|$)/,
    description: "Manage DAOs and proposals",
    children: [
      {
        title: "All DAOs",
        href: "/daos",
        description: "View and manage all existing DAOs"
      },
      {
        title: "All Proposals",
        href: "/proposals",
        description: "View and manage all proposals"
      },
      {
        title: "Create DAO",
        href: "/manifesto",
        description: "Create a new DAO with custom configuration"
      }
    ]
  },
  {
    title: "AI Agent",
    pattern: /^\/(?:aias|meetings)(?:\/|$)/,
    description: "Manage AI Agents and their activities",
    children: [
      {
        title: "All AI Agents",
        href: "/aias",
        description: "View and manage all AI Agents"
      },
      {
        title: "Create AI Agent",
        href: "/aias/create",
        description: "Create a new AI Agent with custom capabilities"
      },
      {
        title: "Recent Meetings",
        href: "/meetings",
        description: "View recent AI Agent meetings and discussions"
      }
    ]
  }
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="flex items-center space-x-6 lg:space-x-8">
      <Link 
        href="/"
        className="ml-6 text-xl font-bold"
      >
        Civitas AI
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          {navItems.map((item) => (
            <NavigationMenuItem key={item.title}>
              <NavigationMenuTrigger
                className={cn(
                  item.pattern.test(pathname) && "text-foreground"
                )}
              >
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 w-[400px]">
                  <li className="row-span-3">
                    <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none">
                      <div className="mb-2 mt-4 text-lg font-medium">
                        {item.title}
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </li>
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={child.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">
                            {child.title}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {child.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
