import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { CandidateStatusBadge } from "@/components/candidate-status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Candidate } from "@/lib/candidates"

export function CandidatesDashboardTable({
  candidates,
  isLoading,
}: {
  candidates: Candidate[]
  isLoading: boolean
}) {
  const recentCandidates = candidates.slice(0, 8)

  return (
    <section className="px-4 lg:px-6">
      <Card className="rounded-lg">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Postulaciones recientes</CardTitle>
            <CardDescription>Últimos candidatos registrados para revisión.</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href="/requests" />}
          >
            Ver todas
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Practicante</TableHead>
                  <TableHead>Carrera</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Postulación</TableHead>
                  <TableHead><span className="sr-only">Acción</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <div className="font-medium">{candidate.fullName}</div>
                      <div className="text-xs text-muted-foreground">{candidate.email}</div>
                    </TableCell>
                    <TableCell className="min-w-40">{candidate.career}</TableCell>
                    <TableCell>{candidate.semester}</TableCell>
                    <TableCell><CandidateStatusBadge status={candidate.status} /></TableCell>
                    <TableCell>
                      {new Date(candidate.createdAt).toLocaleDateString("es-CO", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        nativeButton={false}
                        render={<Link href={`/requests/${candidate.id}`} />}
                        aria-label={`Revisar postulación de ${candidate.fullName}`}
                      >
                        Revisar
                        <ArrowUpRight data-icon="inline-end" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Cargando postulaciones...
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && candidates.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Aún no hay postulaciones registradas.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}