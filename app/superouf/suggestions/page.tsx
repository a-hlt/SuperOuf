import { fakeData } from "@/lib/fake-data";
import { SuggestionsManager } from "@/components/superouf/suggestions-manager";

export default async function SuggestionsPage() {
    const suggestions = await fakeData.getSuggestions();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Suggestions Promos (US14)</h1>
                <p className="text-muted-foreground">
                    Gestion des suggestions de produits et promotions pour les foyers.
                </p>
            </div>
            <SuggestionsManager initialSuggestions={suggestions} />
        </div>
    );
}
