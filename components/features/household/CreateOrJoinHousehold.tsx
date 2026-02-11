"use client"

import * as React from "react"
import { Home, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createHousehold, joinHousehold } from "@/app/actions/household"
import { toast } from "sonner"

export function CreateOrJoinHousehold() {
    const router = useRouter()
    const [householdName, setHouseholdName] = React.useState("")
    const [inviteCode, setInviteCode] = React.useState("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!householdName.trim()) return

        setIsSubmitting(true)
        try {
            await createHousehold(householdName)
            toast.success("Foyer créé avec succès !")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Erreur lors de la création du foyer")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inviteCode.trim()) return

        setIsSubmitting(true)
        try {
            await joinHousehold(inviteCode)
            toast.success("Foyer rejoint avec succès !")
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Code foyer invalide ou erreur")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-[60vh] p-4">
            <Tabs defaultValue="create" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Créer un Foyer</TabsTrigger>
                    <TabsTrigger value="join">Rejoindre</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nouveau Foyer</CardTitle>
                            <CardDescription>
                                Créez un espace pour gérer vos listes de courses en famille.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleCreate}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="name">Nom du foyer</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Famille Dupont"
                                        value={householdName}
                                        onChange={(e) => setHouseholdName(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Création..." : (
                                        <>
                                            <Home className="mr-2 h-4 w-4" /> Créer mon foyer
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="join">
                    <Card>
                        <CardHeader>
                            <CardTitle>Rejoindre un Foyer</CardTitle>
                            <CardDescription>
                                Entrez le code d'invitation fourni par un membre du foyer.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleJoin}>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="code">Code d'invitation</Label>
                                    <Input
                                        id="code"
                                        placeholder="Ex: AB12CD"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Connexion..." : (
                                        <>
                                            <LogIn className="mr-2 h-4 w-4" /> Rejoindre
                                        </>
                                    )}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
