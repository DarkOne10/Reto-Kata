"use client"

import { useEffect, useState, type FormEvent } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Message = {
  id: number
  content: string
  createdAt: string
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "")

export function SectionCards() {
  const [content, setContent] = useState("")
  const [latestMessage, setLatestMessage] = useState<Message | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(apiUrl))
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    if (!apiUrl) return

    let cancelled = false

    async function loadLatestMessage() {
      try {
        const response = await fetch(`${apiUrl}/messages/latest`, {
          cache: "no-store",
        })
        if (!response.ok) throw new Error("Request failed")

        const message = (await response.json()) as Message | null
        if (!cancelled) setLatestMessage(message)
      } catch {
        if (!cancelled) setFeedback("No se pudo consultar el backend.")
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void loadLatestMessage()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedContent = content.trim()

    if (!apiUrl || !trimmedContent) return

    setIsSaving(true)
    setFeedback("")

    try {
      const response = await fetch(`${apiUrl}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmedContent }),
      })
      if (!response.ok) throw new Error("Request failed")

      const message = (await response.json()) as Message
      setLatestMessage(message)
      setContent("")
      setFeedback("Texto guardado correctamente.")
    } catch {
      setFeedback("No se pudo guardar el texto. Revisa la conexión con el backend.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Enviar texto</CardTitle>
          <CardDescription>Escribe una cadena para guardarla en Supabase.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label htmlFor="message-content" className="text-sm font-medium">
              Cadena de texto
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="message-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Escribe algo..."
                maxLength={500}
                required
                disabled={!apiUrl || isSaving}
              />
              <Button type="submit" disabled={!apiUrl || isSaving || !content.trim()}>
                <Send data-icon="inline-start" />
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
            <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
              {feedback || (!apiUrl ? "Configura NEXT_PUBLIC_API_URL para conectar el backend." : "")}
            </p>
          </form>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Último texto guardado</CardTitle>
          <CardDescription>Contenido recuperado desde la base de datos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p
            className="min-h-24 whitespace-pre-wrap break-words rounded-md border bg-muted/40 p-3 text-sm"
            aria-live="polite"
          >
            {isLoading
              ? "Consultando..."
              : latestMessage?.content ?? "Todavía no hay texto guardado."}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
