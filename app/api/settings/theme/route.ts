import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { connectDB } from "@/lib/db"
import { SystemSetting } from "@/lib/models/system-setting"
import { headers } from "next/headers"

const THEME_KEY = "global_theme"

// Default theme (Zinc)
const DEFAULT_THEME = {
    primary: "240 5.9% 10%", // Zinc-950 (HSL) - approximated for Tailwind
    primaryForeground: "0 0% 98%",
    radius: "0.5rem",
}

export async function GET() {
    try {
        await connectDB
        const setting = await SystemSetting.findOne({ key: THEME_KEY }).lean()

        return NextResponse.json(setting?.value || DEFAULT_THEME)
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })

        // In a real app, check for ADMIN/SUPEROUF role
        if (!session) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
        }

        const body = await request.json()
        const { primary, radius } = body

        if (!primary || !radius) {
            return NextResponse.json({ error: "Données incomplètes" }, { status: 400 })
        }

        await connectDB

        const updated = await SystemSetting.findOneAndUpdate(
            { key: THEME_KEY },
            { value: { primary, radius } },
            { upsert: true, new: true }
        )

        return NextResponse.json(updated.value)
    } catch (error) {
        console.error("Theme save error:", error)
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
    }
}
