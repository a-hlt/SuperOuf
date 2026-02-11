import { getTopProducts } from "@/app/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function TopProductsPage() {
    const products = await getTopProducts();
    const maxRequests = products.length > 0 ? Math.max(...products.map((p: { totalRequests: number }) => p.totalRequests)) : 1;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Top Produits (US13)</h1>
                <p className="text-muted-foreground">
                    Les 10 produits les plus demandés par les foyers.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Classement par popularité</CardTitle>
                    <CardDescription>
                        Basé sur le nombre de fois où un produit est ajouté aux listes.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {products.map((product, index) => (
                            <div key={product.id} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 font-medium">
                                        <span className="text-muted-foreground w-6 text-center">{index + 1}.</span>
                                        {product.productName}
                                        <Badge variant="outline" className="text-xs font-normal">
                                            {product.category}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold">{product.totalRequests}</span> demandes
                                        <span className="text-xs text-muted-foreground ml-2">({product.totalPurchased} achats)</span>
                                    </div>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                                        style={{ width: `${(product.totalRequests / maxRequests) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
