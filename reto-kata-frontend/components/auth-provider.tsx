"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { apiFetch } from "@/lib/api"

export type AuthRole = "ADMIN" | "ANALYST" | "APPLICANT"

export type AuthUser = {
  id: number
  name: string
  email: string
  role: AuthRole
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<AuthUser>
  signUp: (name: string, email: string, password: string) => Promise<AuthUser>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    apiFetch<AuthUser>("/auth/me")
      .then((currentUser) => {
        if (active) setUser(currentUser)
      })
      .catch(() => {
        if (active) setUser(null)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function signIn(email: string, password: string) {
    const authenticatedUser = await apiFetch<AuthUser>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    setUser(authenticatedUser)
    return authenticatedUser
  }

  async function signUp(name: string, email: string, password: string) {
    const createdUser = await apiFetch<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    })
    setUser(createdUser)
    return createdUser
  }

  async function signOut() {
    try {
      await apiFetch<{ success: boolean }>("/auth/logout", { method: "POST" })
    } finally {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider.")
  }
  return context
}
