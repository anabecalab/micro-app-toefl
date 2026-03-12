# 🚀 Micro App Template — BecaLab

Plantilla maestra para crear micro apps de campañas BecaLab rápidamente. Cada micro app tiene:
1. **Landing Page 1**: Formulario de registro (conectado a Supabase `registrations`)
2. **Landing Page 2**: Contenido de valor (guía, recurso, info exclusiva)

---

## 📋 Cómo crear una nueva micro app

### 1. Copiar la plantilla
```bash
cp -r micro-app-toefl micro-app-NUEVA-CAMPANA
cd micro-app-NUEVA-CAMPANA
```

### 2. Actualizar `package.json`
Cambia el nombre:
```json
{ "name": "micro-app-NUEVA-CAMPANA" }
```

### 3. Actualizar `app/layout.tsx`
Cambia el **título** y la **descripción** del SEO.

### 4. Editar `components/[nombre]-form.tsx`
Este es el archivo principal. Tiene dos secciones:

| Sección | Qué modificar |
|---|---|
| **Badge** | Texto del badge (ej: "TOEFL 2026 · Nueva Versión") |
| **Título + descripción** | Encabezado y copy del formulario |
| **Campos del formulario** | Agregar/quitar inputs según necesites |
| **`post_name`** | Valor fijo para identificar esta campaña en Supabase |
| **Guía/contenido** | El contenido de valor post-registro |
| **CTAs finales** | Links y botones al final de la guía |

### 5. Actualizar `app/api/submit/route.ts`
Asegúrate de que los campos del `insert` coincidan con lo que envía el formulario y con las columnas de la tabla `registrations`.

### 6. Environment variables
Copia `.env.example` → `.env.local` con las credenciales correctas:
```
NEXT_PUBLIC_SUPABASE_URL=https://pbcznvtuwjounvwygicu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 7. Probar
```bash
npm install
npm run build    # Verificar que compila
npm run dev      # Probar en localhost:3000
```

### 8. Deploy a Vercel
Ver instrucciones detalladas abajo.

---

## 🌐 Deploy a Vercel — Paso a Paso

### Opción A: Desde la CLI (más rápido)
```bash
# 1. Instalar Vercel CLI (si no la tienes)
npm i -g vercel

# 2. Ir a la carpeta del proyecto
cd micro-app-NUEVA-CAMPANA

# 3. Deploy (te pedirá login la primera vez)
vercel

# 4. Seguir las instrucciones:
#    - Scope: tu cuenta
#    - Link to existing project? → No
#    - Project name: micro-app-nueva-campana
#    - Framework: Next.js (auto-detectado)
#    - Build settings: defaults

# 5. Configurar variables de entorno
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# 6. Re-deploy con las env vars
vercel --prod
```

### Opción B: Desde GitHub + Vercel Dashboard
```bash
# 1. Crear repo en GitHub
gh repo create micro-app-nueva-campana --public --source=. --push

# Si no tienes gh CLI, hazlo manual:
# - Ve a github.com/new
# - Crea el repo
# - Sigue las instrucciones para hacer push
```

Luego en [vercel.com](https://vercel.com):
1. **New Project** → Import Git Repository → selecciona el repo
2. **Framework Preset**: Next.js
3. **Environment Variables**: agrega las dos vars de Supabase
4. Click **Deploy**

---

## 📁 Estructura del proyecto
```
micro-app-[nombre]/
├── app/
│   ├── api/submit/route.ts    ← API route → Supabase
│   ├── globals.css            ← Estilos globales
│   ├── layout.tsx             ← SEO + metadata
│   └── page.tsx               ← Monta el componente
├── components/
│   └── [nombre]-form.tsx      ← ⭐ Componente principal
├── lib/
│   └── supabase.ts            ← Cliente Supabase
├── .env.local                 ← Credenciales (no committear)
├── .env.example               ← Template de credenciales
└── [configs: next, tailwind, ts, postcss, package.json]
```

---

## 🗄️ Tabla Supabase: `registrations`
| Columna | Tipo | Descripción |
|---|---|---|
| `id` | uuid | Auto-generado |
| `name` | text | Nombre del estudiante |
| `email` | text | Correo electrónico |
| `country` | text | País de residencia |
| `level` | text | pregrado / maestria / doctorado |
| `travel_year` | text | Año planeado (nullable) |
| `post_name` | text | **Identificador de campaña** (ej: `toefl-2026`) |
| `created_at` | timestamptz | Auto-generado |

> **💡 Para filtrar por campaña**: `SELECT * FROM registrations WHERE post_name = 'tu-campana'`

---

## 🔮 Ideas para mejorar en el futuro
1. **Script CLI generador**: Un comando tipo `npm run create-micro-app "nombre"` que clone la plantilla, renombre archivos y actualice los campos automáticamente
2. **Monorepo con Turborepo**: Unificar todas las micro apps en un solo repo con shared components
3. **Analytics**: Agregar tracking de conversiones (% que completa el form vs % que ve la guía)
4. **A/B Testing**: Servir diferentes versiones de la guía para medir engagement
5. **Email automático**: Enviar la guía por email vía Supabase Edge Function + Resend
6. **Dashboard**: Panel en BecaLab Admin para ver leads por campaña en tiempo real
