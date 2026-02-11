"use client"

import * as React from "react"

export function DynamicThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false)

    const fetchTheme = React.useCallback(async () => {
        try {
            const res = await fetch("/api/settings/theme")
            if (res.ok) {
                const data = await res.json()
                const root = document.documentElement.style

                if (data.primary) root.setProperty("--primary", data.primary)
                if (data.radius) root.setProperty("--radius", data.radius)
                if (data.background) root.setProperty("--background", data.background)
                if (data.foreground) root.setProperty("--foreground", data.foreground)

                if (data.sidebar) root.setProperty("--sidebar", data.sidebar)
                if (data.sidebarForeground) root.setProperty("--sidebar-foreground", data.sidebarForeground)
                if (data.sidebarPrimary) root.setProperty("--sidebar-primary", data.sidebarPrimary)

                if (data.secondary) root.setProperty("--secondary", data.secondary)
                if (data.accent) root.setProperty("--accent", data.accent)
                if (data.card) root.setProperty("--card", data.card)

                if (data.chart1) root.setProperty("--chart-1", data.chart1)
                if (data.chart2) root.setProperty("--chart-2", data.chart2)
                if (data.chart3) root.setProperty("--chart-3", data.chart3)
                if (data.chart4) root.setProperty("--chart-4", data.chart4)
                if (data.chart5) root.setProperty("--chart-5", data.chart5)
            }
        } catch (e) {
            console.error("Failed to fetch theme", e)
        }
    }, [])

    React.useEffect(() => {
        setMounted(true)
        fetchTheme()
    }, [fetchTheme])

    if (!mounted) {
        return <>{children}</>
    }

    return <>{children}</>
}
