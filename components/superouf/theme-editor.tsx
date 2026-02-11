"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemePreview } from "./theme-preview"

// Helper component for color input
const ColorInput = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => (
    <div className="flex items-center justify-between gap-4">
        <Label className="w-1/3 text-sm">{label}</Label>
        <div className="flex items-center gap-2 w-2/3">
            <Input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-8 p-0 cursor-pointer border-0 rounded-sm overflow-hidden"
            />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-8 font-mono text-xs uppercase"
            />
        </div>
    </div>
)

export function ThemeEditor() {
    // General
    const [primary, setPrimary] = React.useState("#000000")
    const [background, setBackground] = React.useState("#ffffff")
    const [foreground, setForeground] = React.useState("#020817")
    const [radius, setRadius] = React.useState(0.5)

    // Sidebar
    const [sidebarBg, setSidebarBg] = React.useState("#f8fafc")
    const [sidebarFg, setSidebarFg] = React.useState("#0f172a")
    const [sidebarPrimary, setSidebarPrimary] = React.useState("#0f172a")

    // Components
    const [secondary, setSecondary] = React.useState("#f1f5f9")
    const [accent, setAccent] = React.useState("#f1f5f9")
    const [card, setCard] = React.useState("#ffffff")

    // Charts
    const [chart1, setChart1] = React.useState("#e76e50")
    const [chart2, setChart2] = React.useState("#2a9d8f")
    const [chart3, setChart3] = React.useState("#e9c46a")
    const [chart4, setChart4] = React.useState("#f4a261")
    const [chart5, setChart5] = React.useState("#264653")

    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const load = async () => {
            const res = await fetch("/api/settings/theme")
            if (res.ok) {
                const data = await res.json()
                if (data.primary) setPrimary(data.primary)
                if (data.radius) setRadius(parseFloat(data.radius))
                if (data.background) setBackground(data.background)
                if (data.foreground) setForeground(data.foreground)
                if (data.sidebar) setSidebarBg(data.sidebar)
                if (data.sidebarForeground) setSidebarFg(data.sidebarForeground)
                if (data.sidebarPrimary) setSidebarPrimary(data.sidebarPrimary)
                if (data.secondary) setSecondary(data.secondary)
                if (data.accent) setAccent(data.accent)
                if (data.card) setCard(data.card)

                if (data.chart1) setChart1(data.chart1)
                if (data.chart2) setChart2(data.chart2)
                if (data.chart3) setChart3(data.chart3)
                if (data.chart4) setChart4(data.chart4)
                if (data.chart5) setChart5(data.chart5)
            }
        }
        load()
    }, [])

    const handleSave = async () => {
        setLoading(true)
        try {
            const payload = {
                primary,
                radius: `${radius}rem`,
                background,
                foreground,
                sidebar: sidebarBg,
                sidebarForeground: sidebarFg,
                sidebarPrimary: sidebarPrimary,
                secondary,
                accent,
                card,
                chart1, chart2, chart3, chart4, chart5
            }

            const res = await fetch("/api/settings/theme", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (res.ok) {
                const root = document.documentElement.style
                root.setProperty("--primary", primary)
                root.setProperty("--radius", `${radius}rem`)
                root.setProperty("--background", background)
                root.setProperty("--foreground", foreground)
                root.setProperty("--sidebar", sidebarBg)
                root.setProperty("--sidebar-foreground", sidebarFg)
                root.setProperty("--sidebar-primary", sidebarPrimary)
                root.setProperty("--secondary", secondary)
                root.setProperty("--accent", accent)
                root.setProperty("--card", card)

                root.setProperty("--chart-1", chart1)
                root.setProperty("--chart-2", chart2)
                root.setProperty("--chart-3", chart3)
                root.setProperty("--chart-4", chart4)
                root.setProperty("--chart-5", chart5)

                alert("Thème et graphiques sauvegardés avec succès !")
            } else {
                alert("Erreur lors de la sauvegarde.")
            }
        } catch (e) {
            console.error(e)
            alert("Erreur serveur.")
        } finally {
            setLoading(false)
        }
    }

    // Dynamic styles for the preview wrapper
    const previewStyles = {
        "--primary": primary,
        "--radius": `${radius}rem`,
        "--background": background,
        "--foreground": foreground,
        "--sidebar": sidebarBg,
        "--sidebar-foreground": sidebarFg,
        "--sidebar-primary": sidebarPrimary,
        "--secondary": secondary,
        "--accent": accent,
        "--card": card,
        "--chart-1": chart1,
        "--chart-2": chart2,
        "--chart-3": chart3,
        "--chart-4": chart4,
        "--chart-5": chart5,
    } as React.CSSProperties

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle>Éditeur de Thème Avancé</CardTitle>
                        <CardDescription>Personnalisez graphiques, couleurs et styles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="general">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="general">Général</TabsTrigger>
                                <TabsTrigger value="sidebar">Sidebar</TabsTrigger>
                                <TabsTrigger value="components">Composants</TabsTrigger>
                                <TabsTrigger value="charts">Graphiques</TabsTrigger>
                            </TabsList>

                            <TabsContent value="general" className="space-y-6 mt-4">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Couleurs Principales</h3>
                                    <ColorInput label="Primaire" value={primary} onChange={setPrimary} />
                                    <ColorInput label="Arrière-plan" value={background} onChange={setBackground} />
                                    <ColorInput label="Texte" value={foreground} onChange={setForeground} />
                                </div>
                                <div className="space-y-4 pt-4 border-t">
                                    <div className="flex justify-between">
                                        <Label>Arrondi (Radius): {radius}rem</Label>
                                    </div>
                                    <Slider
                                        min={0} max={2} step={0.1}
                                        value={[radius]}
                                        onValueChange={(val) => setRadius(val[0])}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="sidebar" className="space-y-6 mt-4">
                                <div className="space-y-4">
                                    <ColorInput label="Fond Sidebar" value={sidebarBg} onChange={setSidebarBg} />
                                    <ColorInput label="Texte Sidebar" value={sidebarFg} onChange={setSidebarFg} />
                                    <ColorInput label="Couleur Accent" value={sidebarPrimary} onChange={setSidebarPrimary} />
                                </div>
                            </TabsContent>

                            <TabsContent value="components" className="space-y-6 mt-4">
                                <div className="space-y-4">
                                    <ColorInput label="Secondaire" value={secondary} onChange={setSecondary} />
                                    <ColorInput label="Accent (Survol)" value={accent} onChange={setAccent} />
                                    <ColorInput label="Fond Cartes" value={card} onChange={setCard} />
                                </div>
                            </TabsContent>

                            <TabsContent value="charts" className="space-y-6 mt-4">
                                <div className="space-y-4">
                                    <ColorInput label="Chart 1 (Principal)" value={chart1} onChange={setChart1} />
                                    <ColorInput label="Chart 2" value={chart2} onChange={setChart2} />
                                    <ColorInput label="Chart 3" value={chart3} onChange={setChart3} />
                                    <ColorInput label="Chart 4" value={chart4} onChange={setChart4} />
                                    <ColorInput label="Chart 5" value={chart5} onChange={setChart5} />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 bg-muted/20 p-4">
                        <Button variant="outline" onClick={() => window.location.reload()}>Annuler</Button>
                        <Button onClick={handleSave} disabled={loading} style={{ backgroundColor: primary, color: "#fff" }}>
                            {loading ? "Sauvegarde..." : "Appliquer Tout"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="lg:col-span-1 sticky top-6">
                {/* Apply styles locally to this wrapper only */}
                <div style={previewStyles}>
                    <ThemePreview />
                </div>
            </div>
        </div>
    )
}
