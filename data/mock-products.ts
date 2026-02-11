export interface Product {
    id: string
    name: string
    category: string
}

export const MOCK_PRODUCTS: Product[] = [
    { id: "p1", name: "Lait demi-écrémé", category: "Produits Laitiers" },
    { id: "p2", name: "Oeufs bio", category: "Produits Laitiers" },
    { id: "p3", name: "Beurre doux", category: "Produits Laitiers" },
    { id: "p4", name: "Crème fraîche", category: "Produits Laitiers" },
    { id: "p5", name: "Yaourt nature", category: "Produits Laitiers" },
    { id: "p6", name: "Fromage râpé", category: "Produits Laitiers" },

    { id: "p10", name: "Pâtes", category: "Épicerie" },
    { id: "p11", name: "Riz basmati", category: "Épicerie" },
    { id: "p12", name: "Sauce tomate", category: "Épicerie" },
    { id: "p13", name: "Huile d'olive", category: "Épicerie" },
    { id: "p14", name: "Farine", category: "Épicerie" },
    { id: "p15", name: "Sucre", category: "Épicerie" },
    { id: "p16", name: "Café moulu", category: "Épicerie" },
    { id: "p17", name: "Thé vert", category: "Épicerie" },
    { id: "p18", name: "Chocolat noir", category: "Épicerie" },
    { id: "p19", name: "Biscuits", category: "Épicerie" },

    { id: "p30", name: "Pommes", category: "Fruits & Légumes" },
    { id: "p31", name: "Bananes", category: "Fruits & Légumes" },
    { id: "p32", name: "Carottes", category: "Fruits & Légumes" },
    { id: "p33", name: "Tomates", category: "Fruits & Légumes" },
    { id: "p34", name: "Salade", category: "Fruits & Légumes" },
    { id: "p35", name: "Oignons", category: "Fruits & Légumes" },
    { id: "p36", name: "Ail", category: "Fruits & Légumes" },
    { id: "p37", name: "Pommes de terre", category: "Fruits & Légumes" },

    { id: "p50", name: "Poulet entier", category: "Viandes & Poissons" },
    { id: "p51", name: "Steak haché", category: "Viandes & Poissons" },
    { id: "p52", name: "Jambon blanc", category: "Viandes & Poissons" },
    { id: "p53", name: "Saumon fumé", category: "Viandes & Poissons" },
    { id: "p54", name: "Thon en boîte", category: "Viandes & Poissons" },

    { id: "p70", name: "Papier toilette", category: "Hygiène & Maison" },
    { id: "p71", name: "Dentifrice", category: "Hygiène & Maison" },
    { id: "p72", name: "Gel douche", category: "Hygiène & Maison" },
    { id: "p73", name: "Lessive", category: "Hygiène & Maison" },
    { id: "p74", name: "Liquide vaisselle", category: "Hygiène & Maison" },
    { id: "p75", name: "Sacs poubelle", category: "Hygiène & Maison" },

    { id: "p90", name: "Coca Cola", category: "Boissons" },
    { id: "p91", name: "Jus d'orange", category: "Boissons" },
    { id: "p92", name: "Eau minérale", category: "Boissons" },
    { id: "p93", name: "Bière", category: "Boissons" },
    { id: "p94", name: "Vin rouge", category: "Boissons" },
]
