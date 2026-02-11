
import { getCategoryStats } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default async function CategoryStatsPage() {
    const stats = await getCategoryStats();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Statistiques par Catégorie (US15)</h1>
                <p className="text-muted-foreground">
                    Analyse des achats par rayon/catégorie.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card key={stat.category}>
                        <CardHeader>
                            <CardTitle className="text-base">{stat.category}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Demandes:</span>
                                    <span className="font-bold">{stat.totalRequests}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Achats:</span>
                                    <span className="font-bold">{stat.totalPurchased}</span>
                                </div>
                                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className="h-full bg-primary"
                                        style={{
                                            width: `${stat.totalRequests > 0 ? (stat.totalPurchased / stat.totalRequests) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground text-right pt-1">
                                    Taux de conversion: {stat.totalRequests > 0 ? Math.round((stat.totalPurchased / stat.totalRequests) * 100) : 0}%
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
