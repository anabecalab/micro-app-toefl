"use client"

import { useState } from "react"
import {
    ChevronRight,
    CheckCircle2,
    Loader2,
    Info,
    BookOpen,
    Headphones,
    Mic,
    PenTool,
    Zap,
    AlertTriangle,
    Target,
    ChevronDown,
    Globe,
    MessageSquare,
    Mail,
} from "lucide-react"

const colors = {
    darkBlue: "#312C8E",
    mediumBlue: "#4B50D0",
    lightGreen: "#D5ED86",
    lavender: "#b1a2d2",
    gold: "#eab10b",
}

const countries = [
    "Argentina", "Bolivia", "Brasil", "Chile", "Colombia", "Costa Rica",
    "Cuba", "Ecuador", "El Salvador", "España", "Guatemala", "Honduras",
    "México", "Nicaragua", "Panamá", "Paraguay", "Perú", "Puerto Rico",
    "República Dominicana", "Uruguay", "Venezuela", "Otro",
]

const levels = [
    { value: "pregrado", label: "Pregrado / Licenciatura" },
    { value: "maestria", label: "Maestría" },
    { value: "doctorado", label: "Doctorado" },
]

const travelYears = [
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
]

interface FormData {
    name: string
    email: string
    country: string
    level: string
    travel_year: string
}

// ─── GUIDE SECTION COMPONENT ──────────────────────────
function GuideSection({
    icon,
    emoji,
    title,
    children,
}: {
    icon: React.ReactNode
    emoji: string
    title: string
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(true)
    return (
        <div
            className="mb-4 overflow-hidden rounded-2xl border"
            style={{
                borderColor: `${colors.lavender}25`,
                backgroundColor: "rgba(255,255,255,0.04)",
            }}
        >
            <button
                onClick={() => setOpen(!open)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/5"
            >
                <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${colors.mediumBlue}30` }}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: "#ffffff" }}>
                        {emoji} {title}
                    </p>
                </div>
                <ChevronDown
                    size={16}
                    className="transition-transform duration-200"
                    style={{
                        color: colors.lavender,
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                    }}
                />
            </button>
            {open && (
                <div
                    className="animate-fade-in-up px-5 pb-5 text-[13px] leading-relaxed"
                    style={{ color: "rgba(255,255,255,0.8)" }}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

// ─── TIP COMPONENT ──────────────────────────
function Tip({ children }: { children: React.ReactNode }) {
    return (
        <div
            className="my-2 rounded-xl px-4 py-2.5 text-[12px]"
            style={{
                backgroundColor: `${colors.lightGreen}12`,
                borderLeft: `3px solid ${colors.lightGreen}`,
                color: colors.lightGreen,
            }}
        >
            <strong>💡 Tip Real:</strong> {children}
        </div>
    )
}

// ─── MAIN COMPONENT ──────────────────────────
export function ToeflForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        country: "",
        level: "pregrado",
        travel_year: "",
    })

    const knownShortTlds = ['co', 'mx', 'ar', 'br', 'cl', 'uk', 'us', 'es', 'de', 'fr', 'it', 'nl', 'pt', 'io', 'ai', 'me', 'tv', 'hn', 'sv', 'gt', 'py', 'uy', 'pe', 'bo', 'ec', 'cr', 'pa', 'ni', 've', 'cu', 'do', 'pr']
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const emailTld = formData.email.split('.').pop()?.toLowerCase() || ''
    const isValidEmail = emailRegex.test(formData.email) && (emailTld.length >= 3 || knownShortTlds.includes(emailTld))
    const [emailTouched, setEmailTouched] = useState(false)

    const canSubmit =
        !!formData.name.trim() &&
        !!formData.email.trim() &&
        isValidEmail &&
        !!formData.country &&
        !!formData.level &&
        !!formData.travel_year

    const handleSubmit = async () => {
        if (!canSubmit) return
        setIsSubmitting(true)
        setError("")

        const payload = {
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            country: formData.country,
            level: formData.level,
            travel_year: formData.travel_year,
        }

        try {
            let lastResponse: Response | null = null
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    lastResponse = await fetch("/api/submit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    })
                    if (lastResponse.ok) break
                    if (attempt < 2)
                        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)))
                } catch {
                    if (attempt < 2)
                        await new Promise((r) => setTimeout(r, 800 * (attempt + 1)))
                }
            }

            if (!lastResponse) throw new Error("No se pudo conectar al servidor")
            if (lastResponse.ok) {
                setIsSuccess(true)
                return
            }

            const errorData = await lastResponse.json().catch(() => ({
                error: "Error al registrar",
            }))
            throw new Error(
                errorData.details || errorData.error || "Error al registrar"
            )
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al registrar")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ─── SUCCESS / GUIDE SCREEN ──────────────────────
    if (isSuccess) {
        return (
            <div
                className="flex min-h-screen flex-col items-center justify-start overflow-y-auto p-4 py-8"
                style={{ backgroundColor: colors.darkBlue }}
            >
                <div className="w-full max-w-lg animate-scale-in">
                    {/* Header */}
                    <div
                        className="mb-6 flex flex-col items-center rounded-[2.5rem] p-8 text-center shadow-2xl"
                        style={{
                            backgroundColor: "#1e1a5e",
                            border: `1.5px solid ${colors.lavender}35`,
                        }}
                    >
                        <div
                            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                            style={{ backgroundColor: `${colors.lightGreen}20` }}
                        >
                            <CheckCircle2 size={32} style={{ color: colors.lightGreen }} />
                        </div>

                        <h2
                            className="mb-1 text-xl font-black"
                            style={{ color: "#ffffff" }}
                        >
                            ¡Listo, {formData.name.split(" ")[0]}!
                        </h2>
                        <p
                            className="mb-4 text-sm"
                            style={{ color: "rgba(255,255,255,0.75)" }}
                        >
                            Tu registro fue exitoso. Aquí tienes tu{" "}
                            <strong style={{ color: colors.lightGreen }}>
                                Guía TOEFL 2026
                            </strong>
                            .
                        </p>

                        <div
                            className="w-full rounded-2xl p-4 text-left"
                            style={{
                                backgroundColor: `${colors.mediumBlue}15`,
                                border: `1px solid ${colors.lightGreen}30`,
                            }}
                        >
                            <p
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: colors.lightGreen }}
                            >
                                Guía exclusiva
                            </p>
                            <p
                                className="mt-1 text-xs font-bold"
                                style={{ color: "#ffffff" }}
                            >
                                Todo sobre el nuevo TOEFL 2026: formato, secciones, tips y
                                estrategia de estudio.
                            </p>
                        </div>
                    </div>

                    {/* ─── GUIDE CONTENT ─── */}
                    <div className="guide-scroll space-y-1">
                        {/* WHAT CHANGED */}
                        <GuideSection
                            emoji="⚡️"
                            title="LO QUE CAMBIÓ (Y DEBES SABER YA)"
                            icon={<Zap size={18} style={{ color: colors.gold }} />}
                        >
                            <ul className="ml-1 space-y-2">
                                <li>
                                    El examen{" "}
                                    <strong style={{ color: "#fff" }}>
                                        ya no es una prueba de resistencia de 3 horas
                                    </strong>
                                    . Ahora es un{" "}
                                    <strong style={{ color: colors.lightGreen }}>
                                        sprint de 90 minutos
                                    </strong>
                                    .
                                </li>
                                <li>
                                    <strong style={{ color: "#fff" }}>Es Adaptativo:</strong> Si
                                    te va bien en el primer bloque, el segundo será más difícil (y
                                    valdrá más puntos).{" "}
                                    <em>
                                        No te asustes si sientes que las preguntas suben de nivel;
                                        ¡es buena señal!
                                    </em>
                                </li>
                                <li>
                                    <strong style={{ color: "#fff" }}>Resultados:</strong> En 72
                                    horas los tienes en tu mail.
                                </li>
                                <li>
                                    <strong style={{ color: "#fff" }}>Nota:</strong> Olvida el
                                    0-120. Ahora es del{" "}
                                    <strong style={{ color: colors.lightGreen }}>
                                        1 al 6 (Escala CEFR)
                                    </strong>
                                    .
                                </li>
                            </ul>
                        </GuideSection>

                        {/* READING */}
                        <GuideSection
                            emoji="📖"
                            title="READING (3 Tareas Nuevas)"
                            icon={<BookOpen size={18} style={{ color: colors.lightGreen }} />}
                        >
                            <p className="mb-3" style={{ color: colors.gold }}>
                                <strong>Adiós a los textos de 800 palabras.</strong>
                            </p>

                            <p className="mb-1">
                                <strong style={{ color: "#fff" }}>
                                    1. Complete the Words:
                                </strong>{" "}
                                Un párrafo con palabras &quot;mochas&quot; (faltan letras).
                            </p>
                            <Tip>
                                No leas el texto entero primero. Ve directo a la palabra y
                                fíjate en la gramática (¿es plural?, ¿es un pasado?).
                            </Tip>

                            <p className="mb-1 mt-3">
                                <strong style={{ color: "#fff" }}>
                                    2. Read in Daily Life:
                                </strong>{" "}
                                Mails, menús, anuncios.
                            </p>
                            <Tip>
                                Aquí el truco es el <em>Scanning</em>. Busca la información
                                específica que te piden, no intentes entender el &quot;contexto
                                profundo&quot; del menú.
                            </Tip>

                            <p className="mb-1 mt-3">
                                <strong style={{ color: "#fff" }}>
                                    3. Read an Academic Passage:
                                </strong>{" "}
                                Un texto corto (200 palabras).
                            </p>
                            <Tip>
                                Al ser corto, las preguntas son muy específicas sobre
                                inferencias. Lee entre líneas.
                            </Tip>
                        </GuideSection>

                        {/* LISTENING */}
                        <GuideSection
                            emoji="🎧"
                            title="LISTENING (Más rápido, más real)"
                            icon={<Headphones size={18} style={{ color: colors.mediumBlue }} />}
                        >
                            <p className="mb-3" style={{ color: colors.gold }}>
                                <strong>Ya no son monólogos aburridos.</strong>
                            </p>
                            <p className="mb-2">
                                <strong style={{ color: "#fff" }}>Tareas:</strong> Listen &
                                Choose a Response, Conversations, Mini-lectures y Discussions.
                            </p>
                            <p className="mb-2">
                                <strong style={{ color: "#fff" }}>La Diferencia:</strong> El
                                lenguaje es mucho más natural (con muletillas y pausas reales).
                            </p>
                            <Tip>
                                Toma menos notas. Al ser audios cortos, si te distraes
                                escribiendo, pierdes el hilo. Entrena tu memoria a corto plazo.
                            </Tip>
                        </GuideSection>

                        {/* SPEAKING */}
                        <GuideSection
                            emoji="🎤"
                            title="SPEAKING (El mayor reto: 8 Minutos)"
                            icon={<Mic size={18} style={{ color: "#f472b6" }} />}
                        >
                            <p className="mb-3" style={{ color: colors.gold }}>
                                <strong>Sin tiempo de preparación.</strong>
                            </p>

                            <p className="mb-1">
                                <strong style={{ color: "#fff" }}>
                                    1. Listen and Repeat:
                                </strong>{" "}
                                Escuchas 7 oraciones y las repites.
                            </p>
                            <Tip>
                                No te enfoques solo en las palabras, imita la entonación. Si
                                suena como pregunta, dilo como pregunta.
                            </Tip>

                            <p className="mb-1 mt-3">
                                <strong style={{ color: "#fff" }}>
                                    2. Take an Interview:
                                </strong>{" "}
                                4 preguntas espontáneas.
                            </p>
                            <Tip>
                                ¡No hay reloj de preparación! Tienes que empezar a hablar en
                                cuanto termine la pregunta. Practica grabar audios de WhatsApp a
                                tus amigos en inglés para perder el miedo a la espontaneidad.
                            </Tip>
                        </GuideSection>

                        {/* WRITING */}
                        <GuideSection
                            emoji="✍️"
                            title="WRITING (Escribir bajo presión: 23 Minutos)"
                            icon={<PenTool size={18} style={{ color: "#34d399" }} />}
                        >
                            <p className="mb-3" style={{ color: colors.gold }}>
                                <strong>Se acabó el ensayo de 5 párrafos.</strong>
                            </p>

                            <p className="mb-1">
                                <strong style={{ color: "#fff" }}>
                                    1. Build a Sentence:
                                </strong>{" "}
                                Ordenar palabras para crear oraciones complejas.
                            </p>
                            <Tip>
                                Repasa conectores (<em>however, nonetheless, although</em>). El
                                sistema busca que sepas estructurar, no solo vocabulario.
                            </Tip>

                            <p className="mb-1 mt-3">
                                <strong style={{ color: "#fff" }}>2. Write an Email:</strong>{" "}
                                Tienes 7 minutos.
                            </p>
                            <Tip>
                                Sé directo. Usa un saludo formal, el cuerpo del mensaje y una
                                despedida clara. No rellenes con paja.
                            </Tip>

                            <p className="mb-1 mt-3">
                                <strong style={{ color: "#fff" }}>
                                    3. Academic Discussion:
                                </strong>{" "}
                                Escribir en un foro.
                            </p>
                            <Tip>
                                Responde a lo que dijeron los &quot;otros alumnos&quot; en el
                                prompt. El algoritmo premia que sepas interactuar con otras
                                ideas.
                            </Tip>
                        </GuideSection>

                        {/* STRATEGY */}
                        <GuideSection
                            emoji="🛠"
                            title="MI ESTRATEGIA DE ESTUDIO 2026"
                            icon={<Target size={18} style={{ color: colors.gold }} />}
                        >
                            <ul className="ml-1 space-y-2">
                                <li>
                                    <strong style={{ color: "#fff" }}>
                                        Apps sobre Libros:
                                    </strong>{" "}
                                    Usa simuladores actualizados. Si el software no es adaptativo,
                                    no te sirve para practicar la presión real.
                                </li>
                                <li>
                                    <strong style={{ color: "#fff" }}>
                                        Sin Cronómetro no hay Práctica:
                                    </strong>{" "}
                                    En este formato, el tiempo es el enemigo #1. Si practicas
                                    Speaking, hazlo sin pausar para pensar.
                                </li>
                                <li>
                                    <strong style={{ color: "#fff" }}>
                                        Fuentes Oficiales:
                                    </strong>{" "}
                                    Solo confía en materiales que mencionen el cambio de enero
                                    2026.
                                </li>
                            </ul>
                        </GuideSection>

                        {/* GOLDEN NOTE */}
                        <div
                            className="mb-6 rounded-2xl p-5"
                            style={{
                                backgroundColor: `${colors.gold}15`,
                                border: `1.5px solid ${colors.gold}40`,
                            }}
                        >
                            <div className="mb-2 flex items-center gap-2">
                                <AlertTriangle size={18} style={{ color: colors.gold }} />
                                <p
                                    className="text-sm font-black"
                                    style={{ color: colors.gold }}
                                >
                                    ⚠️ NOTA DE ORO
                                </p>
                            </div>
                            <p
                                className="text-[13px] leading-relaxed"
                                style={{ color: "rgba(255,255,255,0.85)" }}
                            >
                                Antes de pagar el examen,{" "}
                                <strong style={{ color: "#fff" }}>
                                    confirma que tu universidad ya acepta la escala 1-6
                                </strong>
                                . Algunas universidades top aún están actualizando sus sistemas
                                de admisión.
                            </p>
                        </div>
                    </div>

                    {/* ─── BECABOT SECTION ─── */}
                    <section
                        className="relative mt-6 mb-4 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-2xl"
                        style={{ backgroundColor: "rgba(75,80,208,0.25)", border: "1px solid rgba(177,162,210,0.2)" }}
                    >
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-6 h-24 w-24 rotate-2 overflow-hidden rounded-3xl shadow-2xl transition-transform hover:rotate-0">
                                <img
                                    src="/images/becabot-logo.png"
                                    alt="BecaBot Logo"
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="mb-2 text-2xl font-black" style={{ color: "#ffffff" }}>
                                ¿Quieres más becas?
                            </h3>
                            <p className="mb-8 max-w-xs text-sm leading-relaxed" style={{ color: colors.lavender }}>
                                Encuentra cientos de opciones en{" "}
                                <strong style={{ color: colors.lightGreen }}>BecaBot</strong>
                                , disponible en WhatsApp y Web.
                            </p>
                            <a
                                href="https://www.becalab.org/becabot"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
                                style={{ backgroundColor: colors.lightGreen, color: colors.darkBlue }}
                            >
                                IR A BECABOT <ChevronRight size={20} />
                            </a>
                            <div className="mt-6 flex justify-center gap-6 text-[10px] font-black uppercase tracking-widest">
                                <a
                                    href="https://www.becalab.org/becabot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 transition-colors hover:opacity-80"
                                    style={{ color: colors.lightGreen }}
                                >
                                    <MessageSquare size={14} /> WhatsApp
                                </a>
                                <a
                                    href="https://www.becalab.org/becabot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 transition-colors hover:opacity-80"
                                    style={{ color: colors.lightGreen }}
                                >
                                    <Globe size={14} /> Versión Web
                                </a>
                            </div>
                        </div>
                    </section>

                    {/* ─── BECALAB+ SECTION ─── */}
                    <section
                        className="relative mb-4 overflow-hidden rounded-[2.5rem] p-8 text-center shadow-2xl"
                        style={{ backgroundColor: "rgba(213,237,134,0.08)", border: "1px solid rgba(213,237,134,0.25)" }}
                    >
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="mb-6 h-24 w-24 -rotate-2 overflow-hidden rounded-3xl shadow-2xl transition-transform hover:rotate-0">
                                <img
                                    src="/images/becalabplus-logo.png"
                                    alt="BecaLab+ Logo"
                                    width={96}
                                    height={96}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="mb-2 text-2xl font-black" style={{ color: colors.lightGreen }}>
                                ¿Buscas asesoría personalizada?
                            </h3>
                            <p className="mb-8 max-w-xs text-sm leading-relaxed" style={{ color: colors.lavender }}>
                                Conoce{" "}
                                <strong style={{ color: "#ffffff" }}>BecaLab+</strong>
                                , nuestro programa de mentoría 100% personalizada para que apliques con confianza.
                            </p>
                            <a
                                href="https://www.becalab.org/plus"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black shadow-lg transition-all hover:brightness-110 active:scale-[0.98]"
                                style={{ backgroundColor: colors.lightGreen, color: colors.darkBlue }}
                            >
                                CONOCER BECALAB+ <ChevronRight size={20} />
                            </a>
                        </div>
                    </section>

                    {/* ─── CONTACT + BACK ─── */}
                    <div className="mt-4 space-y-3">
                        <button
                            onClick={() => {
                                setIsSuccess(false)
                                setFormData({
                                    name: "",
                                    email: "",
                                    country: "",
                                    level: "pregrado",
                                    travel_year: "",
                                })
                                setError("")
                            }}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 py-3.5 text-xs font-black uppercase tracking-widest transition-all hover:brightness-110 active:scale-[0.98]"
                            style={{
                                borderColor: `${colors.lavender}40`,
                                color: "#ffffff",
                                backgroundColor: "transparent",
                            }}
                        >
                            ← Volver al inicio
                        </button>

                        <div className="flex items-center justify-center gap-1.5 pt-2">
                            <Mail size={13} style={{ color: colors.lavender }} />
                            <p
                                className="text-xs leading-relaxed"
                                style={{ color: colors.lavender }}
                            >
                                ¿Necesitas ayuda? Escríbenos a{" "}
                                <a
                                    href="mailto:info@becalab.org"
                                    className="font-bold underline underline-offset-2 transition-colors hover:opacity-80"
                                    style={{ color: colors.lightGreen }}
                                >
                                    info@becalab.org
                                </a>
                            </p>
                        </div>
                    </div>

                    <p
                        className="mt-6 pb-8 text-center text-[10px] font-bold uppercase tracking-[0.4em]"
                        style={{ color: "rgba(177,162,210,0.5)" }}
                    >
                        BecaLab &copy; 2026
                    </p>
                </div>
            </div>
        )
    }

    // ─── WELCOME + FORM SCREEN ──────────────────────
    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center p-4"
            style={{ backgroundColor: colors.darkBlue }}
        >
            <div className="w-full max-w-md animate-scale-in">
                <div
                    className="relative flex flex-col items-center overflow-hidden rounded-[2.5rem] p-8 pb-10 text-center shadow-2xl"
                    style={{ backgroundColor: colors.mediumBlue }}
                >
                    {/* Decorative circles */}
                    <div
                        className="absolute -mr-16 -mt-16 right-0 top-0 h-32 w-32 rounded-full opacity-20"
                        style={{ backgroundColor: colors.lightGreen }}
                    />
                    <div
                        className="absolute -ml-12 bottom-10 left-0 h-24 w-24 rounded-full opacity-10"
                        style={{ backgroundColor: colors.gold }}
                    />

                    {/* Logo */}
                    <div className="relative mb-6">
                        <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Sin%20slogan%20-%20morado-F52TEuQPSglZmv73XA1kszKRE9NF1y.png"
                            alt="BecaLab Logo"
                            width={120}
                            height={120}
                            className="rounded-2xl drop-shadow-lg"
                        />
                    </div>

                    {/* Badge */}
                    <span
                        className="mb-4 inline-block rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-inner"
                        style={{
                            backgroundColor: colors.lightGreen,
                            color: colors.darkBlue,
                        }}
                    >
                        TOEFL 2026 · Nueva Versión
                    </span>

                    {/* Title */}
                    <h1
                        className="mb-3 text-2xl font-black uppercase leading-tight text-balance"
                        style={{ color: "#ffffff" }}
                    >
                        Guía del nuevo TOEFL 2026
                    </h1>
                    <p
                        className="mb-6 text-sm leading-relaxed"
                        style={{ color: "rgba(255,255,255,0.8)" }}
                    >
                        Regístrate y obtén acceso a la guía completa con{" "}
                        <strong>tips, cambios y estrategia</strong> para el nuevo formato
                        del examen.
                    </p>

                    {/* ─── FORM ─── */}
                    <div className="w-full space-y-3 text-left">
                        {/* Name */}
                        <div className="space-y-1">
                            <label
                                className="ml-2 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                                }
                                placeholder="Tu nombre"
                                className="w-full rounded-2xl border-2 px-4 py-3 text-sm transition-all focus:outline-none"
                                style={{
                                    borderColor: "rgba(255,255,255,0.2)",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "#ffffff",
                                }}
                            />
                        </div>

                        {/* Email */}
                        <div className="space-y-1">
                            <label
                                className="ml-2 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                                }
                                onBlur={() => setEmailTouched(true)}
                                placeholder="tucorreo@ejemplo.com"
                                className="w-full rounded-2xl border-2 px-4 py-3 text-sm transition-all focus:outline-none"
                                style={{
                                    borderColor: emailTouched && formData.email && !isValidEmail
                                        ? "rgba(239,68,68,0.6)"
                                        : "rgba(255,255,255,0.2)",
                                    backgroundColor: "rgba(255,255,255,0.1)",
                                    color: "#ffffff",
                                }}
                            />
                            {emailTouched && formData.email && !isValidEmail && (
                                <p className="ml-2 text-[10px] font-bold" style={{ color: "#fca5a5" }}>
                                    ⚠ Por favor, introduce un correo electrónico válido
                                </p>
                            )}
                        </div>

                        {/* Country */}
                        <div className="space-y-1">
                            <label
                                className="ml-2 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                País
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, country: e.target.value }))
                                    }
                                    className="w-full appearance-none rounded-2xl border-2 px-4 py-3 pr-10 text-sm transition-all focus:outline-none"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.2)",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        color: formData.country ? "#ffffff" : "rgba(255,255,255,0.5)",
                                    }}
                                >
                                    <option value="">Selecciona tu país</option>
                                    {countries.map((c) => (
                                        <option key={c} value={c}>
                                            {c}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: colors.lavender }} />
                            </div>
                        </div>

                        {/* Level */}
                        <div className="space-y-1">
                            <label
                                className="ml-2 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                Nivel académico
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.level}
                                    onChange={(e) =>
                                        setFormData((prev) => ({ ...prev, level: e.target.value }))
                                    }
                                    className="w-full appearance-none rounded-2xl border-2 px-4 py-3 pr-10 text-sm transition-all focus:outline-none"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.2)",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        color: "#ffffff",
                                    }}
                                >
                                    {levels.map((l) => (
                                        <option key={l.value} value={l.value}>
                                            {l.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: colors.lavender }} />
                            </div>
                        </div>

                        {/* Travel Year */}
                        <div className="space-y-1">
                            <label
                                className="ml-2 text-[10px] font-black uppercase tracking-widest"
                                style={{ color: "rgba(255,255,255,0.7)" }}
                            >
                                ¿Cuándo planeas viajar?
                            </label>
                            <div className="relative">
                                <select
                                    required
                                    value={formData.travel_year}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            travel_year: e.target.value,
                                        }))
                                    }
                                    className="w-full appearance-none rounded-2xl border-2 px-4 py-3 pr-10 text-sm transition-all focus:outline-none"
                                    style={{
                                        borderColor: "rgba(255,255,255,0.2)",
                                        backgroundColor: "rgba(255,255,255,0.1)",
                                        color: formData.travel_year
                                            ? "#ffffff"
                                            : "rgba(255,255,255,0.5)",
                                    }}
                                >
                                    <option value="">Selecciona una opción</option>
                                    {travelYears.map((y) => (
                                        <option key={y.value} value={y.value}>
                                            {y.label}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" style={{ color: colors.lavender }} />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div
                            className="mt-4 w-full rounded-xl p-3 text-center text-sm"
                            style={{
                                backgroundColor: "rgba(239,68,68,0.15)",
                                color: "#fca5a5",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black uppercase tracking-widest shadow-xl transition-all hover:brightness-105 active:scale-[0.98] disabled:opacity-50"
                        style={{
                            backgroundColor: colors.lightGreen,
                            color: colors.darkBlue,
                        }}
                    >
                        {isSubmitting ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Ver Guía TOEFL 2026 <ChevronRight size={16} />
                            </>
                        )}
                    </button>

                    {/* Disclaimer */}
                    <p
                        className="mt-4 text-center text-[9px] leading-tight"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                        Al registrarte, autorizas a BecaLab el tratamiento de tus datos para
                        enviarte contenido académico y novedades.
                    </p>
                </div>

                {/* Footer */}
                <p
                    className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.4em]"
                    style={{ color: "rgba(177,162,210,0.4)" }}
                >
                    BecaLab &copy; 2026
                </p>
            </div>
        </div>
    )
}
