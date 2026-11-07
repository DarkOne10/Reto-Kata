"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Eye, EyeOff, KeyRound, UsersRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/components/auth-provider"

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register"
  const { user, isLoading, signIn, signUp } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(user.role === "APPLICANT" ? "/application/follow-up" : "/dashboard")
    }
  }, [isLoading, router, user])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    if (isRegister && password !== confirmation) {
      setError("Las contraseñas no coinciden.")
      return
    }

    setIsSubmitting(true)
    try {
      const authenticatedUser = isRegister
        ? await signUp(name, email, password)
        : await signIn(email, password)
      router.replace(
        authenticatedUser.role === "APPLICANT" ? "/application/follow-up" : "/dashboard",
      )
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo completar la solicitud.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-neutral-950 p-10 text-white lg:flex xl:p-14">
        <div className="absolute inset-y-0 right-0 w-1 border-r border-white/10" />
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-lg bg-white text-neutral-950">
            <UsersRound className="size-5" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold">Reto-Kata</span>
        </div>
        <div className="relative max-w-xl">
          <p className="mb-4 text-xs font-medium uppercase text-white/60">
            Grupo Aval · Selección de practicantes
          </p>
          <h1 className="max-w-lg text-4xl font-semibold leading-tight xl:text-5xl">
            El talento que viene, empieza aquí.
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-white/65">
            Una plataforma para conectar oportunidades, candidatos y equipos de selección.
          </p>
        </div>
        <p className="text-xs text-white/45">Acceso seguro a la plataforma de selección</p>
      </aside>

      <section className="grid min-h-screen place-items-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-lg bg-neutral-950 text-white">
              <UsersRound className="size-5" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">Reto-Kata</span>
          </div>

          <div className="mb-6">
            <div className="mb-3 grid size-10 place-items-center rounded-lg border bg-card">
              <KeyRound className="size-4 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-semibold">
              {isRegister ? "Crea tu cuenta" : "Bienvenido de nuevo"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isRegister
                ? "Regístrate para continuar con tu postulación."
                : "Ingresa tus datos para acceder a la plataforma."}
            </p>
          </div>

          <Card className="rounded-lg shadow-sm">
            <CardContent className="p-5 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nombre completo
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      maxLength={120}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    maxLength={254}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      autoComplete={isRegister ? "new-password" : "current-password"}
                      minLength={10}
                      maxLength={72}
                      required
                      disabled={isSubmitting}
                      className="pr-11"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      onClick={() => setShowPassword((visible) => !visible)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  {isRegister && (
                    <p className="text-xs text-muted-foreground">
                      Usa entre 10 y 72 caracteres.
                    </p>
                  )}
                </div>

                {isRegister && (
                  <div className="space-y-2">
                    <label htmlFor="confirmation" className="text-sm font-medium">
                      Confirmar contraseña
                    </label>
                    <Input
                      id="confirmation"
                      type={showPassword ? "text" : "password"}
                      value={confirmation}
                      onChange={(event) => setConfirmation(event.target.value)}
                      autoComplete="new-password"
                      minLength={10}
                      maxLength={72}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {error && (
                  <p
                    className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                    role="alert"
                  >
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting
                    ? "Procesando..."
                    : isRegister
                      ? "Crear cuenta"
                      : "Iniciar sesión"}
                  {!isSubmitting && <ArrowRight data-icon="inline-end" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
            <Link
              href={isRegister ? "/login" : "/register"}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
