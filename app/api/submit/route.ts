import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function getSupabase() {
    let url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) {
        throw new Error("Supabase no configurado. Verifica las variables de entorno.")
    }

    if (!url.startsWith("http")) {
        url = url.includes(".supabase.co") ? `https://${url}` : `https://${url}.supabase.co`
    }

    return createClient(url, key)
}

export async function POST(request: Request) {
    try {
        const supabase = getSupabase()
        const body = await request.json()

        const { name, email, country, level, travel_year } = body

        if (!name || !email || !country || !level) {
            return NextResponse.json(
                { error: "Todos los campos son obligatorios" },
                { status: 400 }
            )
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Email no válido" }, { status: 400 })
        }

        const { data, error } = await supabase
            .from("registrations")
            .insert([
                {
                    name,
                    email,
                    country,
                    level,
                    travel_year: travel_year || null,
                    post_name: "toefl-2026",
                },
            ])
            .select()

        if (error) {
            console.error("Supabase insert error:", error)
            return NextResponse.json(
                { error: "Error al guardar", details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true, data })
    } catch (err) {
        const message = err instanceof Error ? err.message : "Error desconocido"
        console.error("API error:", message)
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
