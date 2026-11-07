"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { DashboardShell } from "@/components/dashboard-shell"
import { AuthGuard } from "@/components/auth-guard"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiFetch } from "@/lib/api"
import type { AuthRole } from "@/components/auth-provider"

type ManagedUser = {
  id: number
  name: string
  email: string
  role: AuthRole
  createdAt: string
}

const roleLabels: Record<AuthRole, string> = {
  ADMIN: "Administrador",
  ANALYST: "Analista",
  APPLICANT: "Postulante",
}

export default function SettingsPage() {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    let active = true

    apiFetch<ManagedUser[]>("/users")
      .then((result) => {
        if (active) setUsers(result)
      })
      .catch((error: unknown) => {
        if (active) {
          setFeedback(
            error instanceof Error ? error.message : "No se pudo cargar la lista.",
          )
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  async function changeRole(userId: number, role: "ANALYST" | "APPLICANT") {
    setUpdatingId(userId)
    setFeedback("")

    try {
      const updated = await apiFetch<ManagedUser>(`/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      })
      setUsers((current) =>
        current.map((user) => (user.id === userId ? updated : user)),
      )
      setFeedback(`Rol actualizado para ${updated.name}.`)
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "No se pudo actualizar el rol.",
      )
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <DashboardShell title="Usuarios y permisos">
        <section className="px-4 lg:px-6">
          <div className="mb-4">
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              <ArrowLeft data-icon="inline-start" />
              Volver al panel
            </Button>
          </div>
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Usuarios</CardTitle>
              <CardDescription>Asigna acceso de analista a las cuentas registradas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Correo</TableHead>
                    <TableHead>Rol</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === "ADMIN" ? (
                          <Badge variant="outline">{roleLabels.ADMIN}</Badge>
                        ) : (
                          <Select
                            value={user.role}
                            onValueChange={(value) => {
                              if (value === "ANALYST" || value === "APPLICANT") {
                                void changeRole(user.id, value)
                              }
                            }}
                            disabled={updatingId === user.id}
                          >
                            <SelectTrigger
                              className="w-40"
                              aria-label={`Rol de ${user.name}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="APPLICANT">Postulante</SelectItem>
                              <SelectItem value="ANALYST">Analista</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!isLoading && users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Aún no hay usuarios registrados.
                      </TableCell>
                    </TableRow>
                  )}
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        Cargando usuarios...
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <p className="mt-4 min-h-5 text-sm text-muted-foreground" aria-live="polite">
                {feedback}
              </p>
            </CardContent>
          </Card>
        </section>
      </DashboardShell>
    </AuthGuard>
  )
}
