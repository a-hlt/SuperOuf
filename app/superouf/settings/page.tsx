import { ThemeEditor } from "@/components/superouf/theme-editor"
import { Settings } from "lucide-react"

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                    <Settings className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Paramètres Système</h1>
                    <p className="text-muted-foreground">
                        Configuration globale de l'application Super OUF.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 max-w-[1600px]">
                <ThemeEditor />
            </div>
        </div>
    )
}
