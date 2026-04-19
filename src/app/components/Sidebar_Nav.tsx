'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Plus, Users, Book, ArrowRight, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"

export function AppSidebar() {
  const path = usePathname()
  const router = useRouter()
  const isPath = path.includes("/dashboard/poll/")
  const [open, setOpen] = useState(false)
  const [pollCode, setPollCode] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const handleJoin = async () => {
    const code = pollCode.trim()
    if (!code) return

    try {
      const res = await fetch(`/api/poll/${code}`)
      const data = await res.json()

      if (!res.ok && data?.message) {
        toast.error(data.message || "Error joining poll")
        setPollCode("")
      } else {
        const { pollId } = data
        router.push(`/dashboard/poll/${pollId}`)
        setOpen(false)
      }
    } catch (err) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "message" in err &&
        typeof err.message === "string"
          ? err.message
          : "Error joining poll"
      toast.error(message)
    }

    setPollCode("")
  }

  return (
    <Sidebar className="w-64 border-2 border-black bg-white">
      <SidebarHeader className="border-b-2 border-black p-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-lg font-bold text-black">
            Poll It Out
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold text-gray-600 uppercase tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {/* Create Poll */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="h-auto py-2">
                  <Link
                    href="/dashboard/create-poll"
                    className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-semibold">
                      {isPath ? "Create New Poll" : "Create Poll"}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Join Poll */}
              <SidebarMenuItem className="relative">
                <button
                  onClick={() => setOpen(!open)}
                  className="w-full flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-black font-semibold rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Join A Poll</span>
                </button>

                {open && (
                  <div className="absolute top-full left-0 mt-2 z-50 border-2 border-black bg-white shadow-[4px_4px_0px_rgba(0,0,0,1)] p-3 animate-in fade-in slide-in-from-top-1 duration-150 w-full rounded-none">
                    <div className="flex gap-1.5 items-center">
                      <input
                        ref={inputRef}
                        type="text"
                        value={pollCode}
                        onChange={(e) => setPollCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleJoin()
                        }}
                        placeholder="Enter code"
                        className="flex-1 min-w-0 px-2 py-1.5 border-2 border-black text-sm font-medium placeholder:text-gray-400 focus:outline-none bg-white rounded-none"
                      />
                      <button
                        onClick={handleJoin}
                        disabled={!pollCode.trim()}
                        className="shrink-0 bg-black text-white px-3 py-1.5 border-2 border-black text-sm font-semibold shadow-[2px_2px_0px_gray] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[2px_2px_0px_gray] rounded-none"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </SidebarMenuItem>

              {/* About */}
              {!isPath && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild className="h-auto py-2">
                    <Link
                      href="#about"
                      className="flex items-center gap-2 px-3 py-2 border-2 border-black bg-white text-black rounded-none shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer font-semibold"
                    >
                      <Book className="w-4 h-4" />
                      <span>About</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Clerk Auth */}
      <SidebarFooter className="border-t-2 border-black p-4">
        <div className="w-full">
          <SignedOut>
            <div className="flex flex-col gap-2">
              <Link href="/signin" className="w-full">
                <button className="w-full font-semibold bg-black text-white px-3 py-2 border-2 border-black shadow-[2px_2px_0px_gray] hover:shadow-[4px_4px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer rounded-none">
                  Sign In
                </button>
              </Link>
              <Link href="/signup" className="w-full">
                <button className="w-full font-semibold bg-white text-black border-2 border-black px-3 py-2 shadow-[2px_2px_0px_gray] hover:shadow-[4px_4px_0px_gray] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer rounded-none">
                  Sign Up
                </button>
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center justify-between gap-2 p-2 border-2 border-black bg-gray-50 rounded-none">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase">Account</p>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonPopoverCard:
                      "border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                  },
                  variables: {
                    colorPrimary: "#000000",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}