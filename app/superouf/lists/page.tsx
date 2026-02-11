import { getAggregatedLists } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AggregatedListsPage() {
    const lists = await getAggregatedLists();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Listes Agrégées (US12)</h1>
                <p className="text-muted-foreground">
                    Consultation des listes anonymisées de tous les foyers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listes en cours</CardTitle>
                    <CardDescription>
                        {lists.length} listes actives actuellement.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                                <tr>
                                    <th className="p-4 align-middle font-medium">Household ID (Hash)</th>
                                    <th className="p-4 align-middle font-medium">Items</th>
                                    <th className="p-4 align-middle font-medium">Statut</th>
                                    <th className="p-4 align-middle font-medium text-right">Dernière MàJ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lists.map((list: { id: string; householdId: string; name: string; isActive: boolean; itemCount: number; updatedAt: string }) => (
                                    <tr key={list.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle font-mono text-xs">{list.householdId}</td>
                                        <td className="p-4 align-middle">{list.itemCount} produits</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant={list.isActive ? "default" : "secondary"}>
                                                {list.isActive ? "Active" : "Archivée"}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle text-right">
                                            {new Date(list.updatedAt).toLocaleDateString("fr-FR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
