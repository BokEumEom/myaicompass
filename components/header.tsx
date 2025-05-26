"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Compass, Menu, User, Settings, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navigation = [
    { name: "대시보드", href: "/dashboard" },
    { name: "Reality Check", href: "/reality-check" },
    { name: "Action Roadmap", href: "/roadmap" },
    { name: "Growth Quests", href: "/quests" },
    { name: "Monthly Reports", href: "/reports" },
  ]

  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Compass className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">MyAI Compass</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-medium ${
                pathname === item.href ? "text-teal-600" : "text-foreground hover:text-teal-600 transition-colors"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">{profile?.display_name || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="h-4 w-4 mr-2" />
                      설정
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="h-4 w-4 mr-2" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-8">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-sm font-medium ${
                          pathname === item.href
                            ? "text-teal-600"
                            : "text-foreground hover:text-teal-600 transition-colors"
                        }`}
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Link
                      href="/settings"
                      className="text-sm font-medium text-foreground hover:text-teal-600 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      설정
                    </Link>
                    <Button variant="outline" onClick={() => signOut()}>
                      로그아웃
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  로그인
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">회원가입</Button>
              </Link>

              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col gap-4 mt-8">
                    <Link
                      href="/login"
                      className="text-sm font-medium text-foreground hover:text-teal-600 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link
                      href="/signup"
                      className="text-sm font-medium text-foreground hover:text-teal-600 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      회원가입
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
