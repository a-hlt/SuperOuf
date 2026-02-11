"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, ShoppingCart, Users, TrendingUp } from "lucide-react"

export function ThemePreview() {
    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-lg">Aperçu en direct</h3>

            {/* Sidebar Mock */}
            <div className="flex rounded-lg overflow-hidden border shadow-sm min-h-[300px]">
                <div className="w-16 bg-sidebar border-r border-sidebar-border hidden sm:flex flex-col items-center py-4 gap-4">
                    <div className="h-8 w-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-bold">SO</div>
                    <div className="h-6 w-6 rounded bg-sidebar-accent/50"></div>
                    <div className="h-6 w-6 rounded bg-sidebar-accent/50"></div>
                    <div className="mt-auto h-6 w-6 rounded bg-sidebar-accent/50"></div>
                </div>

                <div className="flex-1 bg-background p-4 flex flex-col gap-4">
                    {/* Header Mock */}
                    <div className="flex justify-between items-center pb-2 border-b">
                        <div className="font-bold text-xl text-foreground">Dashboard</div>
                        <Badge variant="secondary">Admin</Badge>
                    </div>

                    {/* Stats Mock */}
                    <div className="grid grid-cols-2 gap-2">
                        <Card className="p-3 bg-card text-card-foreground">
                            <div className="text-xs text-muted-foreground flex justify-between">Ventes <TrendingUp className="h-3 w-3 text-primary" /></div>
                            <div className="text-lg font-bold">1,234€</div>
                            <div className="h-1 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-chart-1 w-[70%]"></div>
                            </div>
                        </Card>
                        <Card className="p-3 bg-card text-card-foreground">
                            <div className="text-xs text-muted-foreground flex justify-between">Utilisateurs <Users className="h-3 w-3 text-primary" /></div>
                            <div className="text-lg font-bold">854</div>
                            <div className="h-1 w-full bg-secondary mt-2 rounded-full overflow-hidden">
                                <div className="h-full bg-chart-2 w-[40%]"></div>
                            </div>
                        </Card>
                    </div>

                    {/* UI Elements Mock */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium text-foreground">Éléments d'interface</div>
                        <div className="flex gap-2">
                            <Button size="sm">Primaire</Button>
                            <Button size="sm" variant="secondary">Secondaire</Button>
                            <Button size="sm" variant="outline">Outline</Button>
                        </div>
                        <Input placeholder="Champ texte..." className="bg-input text-foreground h-8 text-sm" />
                    </div>

                    {/* Chart Mock */}
                    <div className="flex-1 bg-muted/20 rounded-md border border-dashed flex items-end justify-center p-2 gap-1">
                        <div className="w-4 bg-chart-1 h-[40%] rounded-t-sm"></div>
                        <div className="w-4 bg-chart-2 h-[75%] rounded-t-sm"></div>
                        <div className="w-4 bg-chart-3 h-[55%] rounded-t-sm"></div>
                        <div className="w-4 bg-chart-4 h-[90%] rounded-t-sm"></div>
                        <div className="w-4 bg-chart-5 h-[30%] rounded-t-sm"></div>
                    </div>
                </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
                Ceci est une simulation. Le rendu réel dépend aussi du contenu.
            </p>
        </div>
    )
}
