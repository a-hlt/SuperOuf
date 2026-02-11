"use client";

import { useState } from "react";
import { Suggestion } from "@/lib/fake-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Tag } from "lucide-react";

interface SuggestionsManagerProps {
    initialSuggestions: Suggestion[];
}

export function SuggestionsManager({ initialSuggestions }: SuggestionsManagerProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
    const [newProduct, setNewProduct] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newDiscount, setNewDiscount] = useState("");

    const handleAdd = () => {
        if (!newProduct || !newDesc) return;

        const newSuggestion: Suggestion = {
            id: Math.random().toString(36).substr(2, 9),
            productName: newProduct,
            description: newDesc,
            discount: newDiscount || undefined,
            isActive: true,
        };

        setSuggestions([...suggestions, newSuggestion]);
        setNewProduct("");
        setNewDesc("");
        setNewDiscount("");
    };

    const handleDelete = (id: string) => {
        setSuggestions(suggestions.filter((s) => s.id !== id));
    };

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Ajouter une suggestion</CardTitle>
                    <CardDescription>
                        Créez une nouvelle promotion ciblée pour les foyers.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Produit</label>
                        <Input
                            placeholder="Ex: Nutella"
                            value={newProduct}
                            onChange={(e) => setNewProduct(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input
                            placeholder="Ex: Promo familiale"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Réduction (optionnel)</label>
                        <Input
                            placeholder="Ex: -20%"
                            value={newDiscount}
                            onChange={(e) => setNewDiscount(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleAdd} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter la suggestion
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Suggestions actives</CardTitle>
                    <CardDescription>
                        {suggestions.length} suggestions en cours de diffusion.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {suggestions.map((suggestion) => (
                            <div
                                key={suggestion.id}
                                className="flex items-start justify-between rounded-lg border p-4 shadow-sm"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <Tag className="h-4 w-4 text-primary" />
                                        {suggestion.productName}
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {suggestion.description}
                                    </p>
                                    {suggestion.discount && (
                                        <Badge variant="secondary" className="mt-1">
                                            {suggestion.discount}
                                        </Badge>
                                    )}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                    onClick={() => handleDelete(suggestion.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        {suggestions.length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8">
                                Aucune suggestion active.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
