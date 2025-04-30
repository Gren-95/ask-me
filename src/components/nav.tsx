"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export function Nav() {
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Ask Me
        </Link>
        <div className="flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/forms">
                    <Button variant="ghost">My Forms</Button>
                  </Link>
                  <Link href="/forms/new">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Form
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-sm">{user.name}</span>
                    <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button>
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}