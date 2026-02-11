import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getGlobalStats, getTopProducts, getCategoryStats } from "@/app/actions/analytics";
import { Users, FileText, ShoppingBasket, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function SuperOUFDashboard() {
    const stats = await getGlobalStats();
    const topProducts = await getTopProducts();
    const categoryStats = await getCategoryStats();

    // Slice for preview
    const previewProducts = topProducts.slice(0, 5);
    const maxRequests = topProducts.length > 0 ? Math.max(...topProducts.map((p: { totalRequests: number }) => p.totalRequests)) : 1;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h1>
                    <p className="text-muted-foreground">Vue d'ensemble de l'activité Super OUF</p>
                </div>
            </div>

            {/* Global Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-green-700">Total Foyers</CardTitle>
                        <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-900">{stats.totalHouseholds}</div>
                        <p className="text-xs text-green-600/80">
                            +20.1% ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-blue-700">Listes Actives</CardTitle>
                        <FileText className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-900">{stats.totalLists}</div>
                        <p className="text-xs text-blue-600/80">
                            +180 créations
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-purple-700">Produits Achetés</CardTitle>
                        <ShoppingBasket className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-900">{stats.totalItems}</div>
                        <p className="text-xs text-purple-600/80">
                            +19% volume
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Widgets Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Top Products Widget */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Top Produits - Aperçu</CardTitle>
                        <CardDescription>Les 5 produits les plus demandés actuellement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {previewProducts.map((product, index) => (
                                <div key={product.id} className="flex items-center">
                                    <div className="font-medium w-8 text-muted-foreground">{index + 1}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold">{product.productName}</span>
                                            <span className="text-sm text-muted-foreground">{product.totalRequests} demandes</span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full bg-primary/80"
                                                style={{ width: `${(product.totalRequests / maxRequests) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 border-t bg-muted/20 flex justify-end">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/superouf/top-products">
                                Voir tout le classement <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>

                {/* Categories Widget */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Répartition Catégories</CardTitle>
                        <CardDescription>Volumes par rayon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {categoryStats.slice(0, 4).map((stat) => (
                                <div key={stat.category} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">{stat.category}</Badge>
                                    </div>
                                    <div className="text-sm font-bold">
                                        {stat.totalPurchased} <span className="text-xs font-normal text-muted-foreground">achats</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <div className="p-4 border-t bg-muted/20 flex justify-end">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/superouf/category-stats">
                                Détails par catégorie <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
