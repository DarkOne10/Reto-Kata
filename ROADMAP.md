# Hoja de ruta: Plataforma de Selección de Practicantes

## Objetivo

Construir una aplicación web para que los practicantes registren sus datos y adjunten su hoja de vida en PDF, y para que los analistas consulten las postulaciones y decidan si cada candidato es viable o no viable.

La prioridad es completar primero un MVP funcional en local. El despliegue en la nube y la autenticación se agregan después de validar el flujo principal.

## Arquitectura propuesta

- **Frontend:** Next.js, TypeScript y Tailwind CSS. Despliegue en Vercel.
- **Backend:** NestJS y Prisma. Despliegue en Koyeb.
- **Base de datos:** PostgreSQL administrado por Supabase.
- **Archivos:** Supabase Storage, en un bucket privado para las hojas de vida.

Flujo de datos:

1. El practicante completa el formulario en Next.js y adjunta su PDF.
2. Next.js envía los datos y el archivo a la API de NestJS.
3. NestJS valida la solicitud, guarda el PDF en Supabase Storage y persiste los datos del candidato con Prisma en PostgreSQL.
4. El analista consulta y actualiza las postulaciones desde el panel de Next.js mediante la API.
5. El acceso a las hojas de vida se entrega solo a analistas autorizados, preferiblemente mediante enlaces firmados de corta duración.

## Alcance del MVP

### Incluido

- Formulario de registro con nombre completo, correo, carrera, semestre y hoja de vida PDF.
- Validación de campos obligatorios en frontend y backend.
- Persistencia de candidatos y estado de evaluación.
- Panel de analista con listado y detalle de candidatos.
- Acciones para marcar un candidato como viable o no viable.
- Descarga o visualización protegida de la hoja de vida.
- README con instalación, configuración y ejecución local.

### Fuera del MVP inicial

- Flujos de correo, recuperación de contraseña y roles complejos.
- Filtros avanzados, reportes, exportación masiva y auditoría extensa.
- Automatizaciones o evaluación automática de candidatos.

La autenticación es opcional en el reto, pero debe incluirse antes de exponer el panel de analista públicamente.

## Modelo de datos inicial

### Candidate

- `id`: identificador único.
- `fullName`: nombre completo.
- `email`: correo electrónico.
- `career`: carrera universitaria.
- `semester`: semestre actual.
- `resumePath`: ruta del archivo en Supabase Storage, no el archivo binario.
- `status`: `PENDING`, `VIABLE` o `NOT_VIABLE`; por defecto `PENDING`.
- `createdAt` y `updatedAt`: fechas de creación y actualización.
- `reviewedAt`: fecha opcional de evaluación.

La unicidad del correo puede usarse para evitar registros duplicados, si esa regla se confirma con el equipo.

## Hoja de ruta

### Fase 1: Preparar entorno y servicios

- [ ] Confirmar que frontend y backend se versionan dentro del mismo repositorio.
- [ ] Crear un proyecto Supabase y obtener la conexión de PostgreSQL.
- [ ] Crear un bucket privado para CVs.
- [ ] Definir variables de entorno locales y crear `.env.example` para cada aplicación.
- [ ] Confirmar que los `.env` reales, claves y archivos de configuración local estén excluidos de Git.

**Criterio de salida:** cada aplicación arranca localmente y la configuración requerida está documentada sin publicar secretos.

### Fase 2: Backend, base de datos y API

- [ ] Añadir Prisma al backend NestJS y configurar PostgreSQL.
- [ ] Crear el modelo `Candidate` y aplicar la migración inicial.
- [ ] Implementar el registro de candidatos y consulta de la lista/detalle.
- [ ] Implementar la actualización de estado con valores permitidos.
- [ ] Validar datos también en backend; no confiar solo en validaciones del navegador.
- [ ] Habilitar Swagger con ejemplos de solicitudes y respuestas.

**Criterio de salida:** la API crea, consulta y actualiza candidatos persistidos en PostgreSQL.

### Fase 3: Carga y acceso a hojas de vida

- [ ] Recibir el PDF mediante una solicitud `multipart/form-data`.
- [ ] Limitar tamaño y validar tipo de archivo y extensión en el servidor.
- [ ] Generar nombres/rutas de almacenamiento que no dependan del nombre original del archivo.
- [ ] Subir el archivo desde NestJS a Supabase Storage.
- [ ] Guardar en PostgreSQL únicamente la ruta del objeto.
- [ ] Entregar el archivo al analista autorizado mediante una URL firmada de duración limitada.
- [ ] Manejar errores para no dejar referencias rotas si falla la carga o el registro.

**Criterio de salida:** se puede registrar un candidato con un PDF válido, y el archivo no es accesible públicamente.

### Fase 4: Frontend del postulante y del analista

- [ ] Crear el formulario de postulación con estados de carga, éxito y error.
- [ ] Validar los campos requeridos y el archivo antes del envío.
- [ ] Crear el panel con lista, detalle y estado actual de cada candidato.
- [ ] Añadir acciones de viable/no viable y reflejar el resultado de la API.
- [ ] Mostrar errores de red y estados vacíos de manera clara.
- [ ] Conectar el frontend con la URL de API configurada por entorno.

**Criterio de salida:** el flujo completo se puede realizar desde la interfaz, sin editar datos manualmente en la base de datos.

### Fase 5: Acceso y privacidad

- [ ] Proteger el panel y los endpoints de listado, detalle, evaluación y descarga.
- [ ] Mantener las credenciales de analista y claves administrativas solo en el backend.
- [ ] No exponer claves de Supabase con permisos administrativos en variables `NEXT_PUBLIC_*`.
- [ ] Añadir un aviso de privacidad/consentimiento para el envío de datos personales y CV.
- [ ] Configurar CORS para permitir únicamente los orígenes necesarios.

**Criterio de salida:** un usuario no autenticado no puede revisar candidatos ni descargar CVs.

### Fase 6: Pruebas y documentación

- [ ] Probar validaciones de creación y transiciones de estado.
- [ ] Probar controladores/servicios del backend; simular Supabase Storage en pruebas unitarias.
- [ ] Probar el recorrido principal de integración: registro, consulta, evaluación y acceso al CV.
- [ ] Verificar build y lint de frontend y backend.
- [ ] Documentar requisitos, instalación, variables, migraciones y comandos para ejecutar ambos servicios.
- [ ] Añadir capturas de las pantallas principales para la presentación.

**Criterio de salida:** una persona nueva puede levantar el proyecto siguiendo el README y las pruebas principales pasan.

### Fase 7: Despliegue y ensayo de presentación

- [ ] Desplegar la API NestJS en Koyeb y configurar sus variables en el servicio.
- [ ] Ejecutar migraciones de Prisma contra Supabase siguiendo el modo de conexión recomendado por Supabase/Prisma.
- [ ] Desplegar Next.js en Vercel y configurar la URL pública de la API.
- [ ] Configurar el origen de Vercel permitido en CORS.
- [ ] Verificar en el entorno desplegado el registro, la carga/descarga privada y la evaluación.
- [ ] Ensayar una demostración de siete minutos con datos ficticios.

**Criterio de salida:** el flujo funciona desde las URLs desplegadas o, si el despliegue no es necesario, desde el entorno local documentado.

## Variables de entorno previstas

Los valores reales se configuran localmente en archivos ignorados por Git y, en producción, en los paneles de Vercel y Koyeb. Los nombres exactos se ajustarán durante la implementación.

### Backend (NestJS / Koyeb)

- `DATABASE_URL`: conexión de la aplicación a PostgreSQL.
- `DIRECT_URL`: conexión directa para migraciones, si la configuración elegida de Prisma la requiere.
- `SUPABASE_URL`: URL del proyecto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: clave privada usada exclusivamente por el backend.
- `CORS_ORIGIN`: origen del frontend autorizado.
- `PORT`: puerto de escucha, según el proveedor.
- `JWT_SECRET`: solo si se implementa autenticación propia con JWT.

### Frontend (Next.js / Vercel)

- `NEXT_PUBLIC_API_URL`: URL pública de la API NestJS.

Las variables con prefijo `NEXT_PUBLIC_` se exponen al navegador y nunca deben contener secretos.

## Verificación final del reto

- Un postulante puede enviar sus datos y un PDF válido.
- Los campos obligatorios se validan en cliente y servidor.
- La postulación queda guardada en PostgreSQL y el CV en el bucket privado.
- El analista puede ver candidatos y marcarlos como viables o no viables.
- La hoja de vida solo se entrega a un analista autorizado.
- El proyecto se puede ejecutar siguiendo el README, y la demostración puede completarse en siete minutos.
