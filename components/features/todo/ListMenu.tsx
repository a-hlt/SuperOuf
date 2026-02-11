"use client"

import * as React from "react"
import { MoreHorizontal, Plus, Save, History, CheckCircle, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

import { ShoppingList } from "@/types/schema"
import { saveAsTemplate, createListFromTemplate, archiveCurrentList, restoreList } from "@/app/actions/list"
import { Dialog, DialogDescription, DialogTitle, DialogHeader, DialogContent, DialogFooter } from "@/components/ui/dialog"

interface ListMenuProps {
    listId: string
    templates: ShoppingList[]
    history: ShoppingList[]
}

export function ListMenu({ listId, templates, history }: ListMenuProps) {
    const [showSaveTemplate, setShowSaveTemplate] = React.useState(false)
    const [showUseTemplate, setShowUseTemplate] = React.useState(false)
    const [showHistory, setShowHistory] = React.useState(false)
    const [showFinish, setShowFinish] = React.useState(false)

    const [templateName, setTemplateName] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleSaveTemplate = async () => {
        if (!templateName) return
        setIsSubmitting(true)
        try {
            await saveAsTemplate(listId, templateName)
            setShowSaveTemplate(false)
            setTemplateName("")
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCreateFromTemplate = async (templateId: string, name: string) => {
        if (!confirm("Attention, cela va archiver la liste actuelle et en créer une nouvelle.")) return
        try {
            await createListFromTemplate(templateId, name) // or ask for name
            setShowUseTemplate(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleRestoreList = async (listId: string) => {
        if (!confirm("Attention, cela va archiver la liste actuelle.")) return
        try {
            await restoreList(listId)
            setShowHistory(false)
        } catch (error) {
            console.error(error)
        }
    }

    const handleFinishList = async () => {
        try {
            await archiveCurrentList(listId)
            setShowFinish(false)
        } catch (error) {
            console.error(error)
        }
    }


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Options de liste</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowSaveTemplate(true)}>
                        <Save className="mr-2 h-4 w-4" /> Sauvegarder comme modèle
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowUseTemplate(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Nouvelle liste (Modèle)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowHistory(true)}>
                        <History className="mr-2 h-4 w-4" /> Historique
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowFinish(true)} className="text-green-600 focus:text-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" /> Terminer les courses
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Save Template Dialog */}
            <Dialog open={showSaveTemplate} onOpenChange={setShowSaveTemplate}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sauvegarder comme modèle</DialogTitle>
                        <DialogDescription>
                            Créez un modèle à partir de votre liste actuelle pour la réutiliser plus tard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nom</Label>
                            <Input
                                id="name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="col-span-3"
                                placeholder="Ex: Courses mensuelles"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveTemplate} disabled={isSubmitting}>Sauvegarder</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Use Template Dialog */}
            <Dialog open={showUseTemplate} onOpenChange={setShowUseTemplate}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Utiliser un modèle</DialogTitle>
                        <DialogDescription>
                            Choisissez un modèle pour commencer une nouvelle liste.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-2 p-1">
                            {templates.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">Aucun modèle disponible</div>}
                            {templates.map(template => (
                                <Button
                                    key={template.id}
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => handleCreateFromTemplate(template.id, template.name)}
                                >
                                    <Save className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {template.name}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* History Dialog */}
            <Dialog open={showHistory} onOpenChange={setShowHistory}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Historique</DialogTitle>
                        <DialogDescription>
                            Réutilisez une liste précédente.
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[300px]">
                        <div className="space-y-2 p-1">
                            {history.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">Historique vide</div>}
                            {history.map(list => (
                                <div key={list.id} className="flex items-center justify-between p-2 rounded-lg border bg-card">
                                    <div>
                                        <div className="font-medium">{list.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                            {list.completedAt ? new Date(list.completedAt).toLocaleDateString() : 'Date inconnue'}
                                        </div>
                                    </div>
                                    <Button size="sm" variant="ghost" onClick={() => handleRestoreList(list.id)}>
                                        <RotateCcw className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>

            {/* Finish List Dialog */}
            <Dialog open={showFinish} onOpenChange={setShowFinish}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Terminer les courses ?</DialogTitle>
                        <DialogDescription>
                            Cela archivera la liste actuelle. Une nouvelle liste vide sera créée automatiquement.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowFinish(false)}>Annuler</Button>
                        <Button onClick={handleFinishList} className="bg-green-600 hover:bg-green-700">Terminer & Archiver</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
