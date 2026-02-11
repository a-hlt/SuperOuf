
export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number;
    category: string;
    status: 'VALIDATED' | 'PENDING' | 'REJECTED';
    checked: boolean;
}

export interface ShoppingList {
    id: string;
    householdId: string;
    name: string;
    isActive: boolean;
    itemCount: number;
    items: ShoppingItem[];
    updatedAt: Date;
}

export interface ProductAnalytics {
    id: string;
    productName: string;
    totalRequests: number;
    totalPurchased: number;
    category: string;
}

export interface Suggestion {
    id: string;
    productName: string;
    description: string;
    discount?: string;
    isActive: boolean;
}

export interface CategoryStat {
    category: string;
    totalRequests: number;
    totalPurchased: number;
}

// Mock Data
const CATEGORIES = ['Fruits & Légumes', 'Produits Laitiers', 'Viande & Poisson', 'Épicerie', 'Boissons', 'Hygiène'];

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_LISTS: ShoppingList[] = Array.from({ length: 20 }).map((_, i) => ({
    id: generateId(),
    householdId: `HOUSEHOLD_${Math.floor(Math.random() * 1000)}`, // Anonymized
    name: 'Liste de courses',
    isActive: true,
    itemCount: Math.floor(Math.random() * 20) + 1,
    items: [],
    updatedAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
}));

const MOCK_PRODUCT_ANALYTICS: ProductAnalytics[] = [
    { id: '1', productName: 'Banane', totalRequests: 150, totalPurchased: 140, category: 'Fruits & Légumes' },
    { id: '2', productName: 'Lait demi-écrémé', totalRequests: 120, totalPurchased: 115, category: 'Produits Laitiers' },
    { id: '3', productName: 'Oeufs', totalRequests: 100, totalPurchased: 95, category: 'Produits Laitiers' },
    { id: '4', productName: 'Pâtes', totalRequests: 90, totalPurchased: 85, category: 'Épicerie' },
    { id: '5', productName: 'Riz', totalRequests: 85, totalPurchased: 80, category: 'Épicerie' },
    { id: '6', productName: 'Tomates', totalRequests: 80, totalPurchased: 75, category: 'Fruits & Légumes' },
    { id: '7', productName: 'Poulet', totalRequests: 75, totalPurchased: 70, category: 'Viande & Poisson' },
    { id: '8', productName: 'Coca-Cola', totalRequests: 70, totalPurchased: 65, category: 'Boissons' },
    { id: '9', productName: 'Papier Toilette', totalRequests: 60, totalPurchased: 60, category: 'Hygiène' },
    { id: '10', productName: 'Yaourt', totalRequests: 55, totalPurchased: 50, category: 'Produits Laitiers' },
    { id: '11', productName: 'Pommes', totalRequests: 50, totalPurchased: 45, category: 'Fruits & Légumes' },
    { id: '12', productName: 'Pain', totalRequests: 45, totalPurchased: 40, category: 'Épicerie' },
];

let MOCK_SUGGESTIONS: Suggestion[] = [
    { id: '1', productName: 'Nutella', description: 'Promo familiale', discount: '-20%', isActive: true },
    { id: '2', productName: 'Café', description: 'Lot de 3', discount: '2 achetés 1 offert', isActive: true },
];

export const fakeData = {
    getGlobalStats: async () => {
        return {
            totalHouseholds: 142,
            totalLists: 356,
            totalItems: 4521,
        };
    },

    getAggregatedLists: async () => {
        return MOCK_LISTS;
    },

    getTopProducts: async () => {
        return [...MOCK_PRODUCT_ANALYTICS].sort((a, b) => b.totalRequests - a.totalRequests).slice(0, 10);
    },

    getCategoryStats: async () => {
        const stats: Record<string, CategoryStat> = {};

        MOCK_PRODUCT_ANALYTICS.forEach(product => {
            if (!stats[product.category]) {
                stats[product.category] = { category: product.category, totalRequests: 0, totalPurchased: 0 };
            }
            stats[product.category].totalRequests += product.totalRequests;
            stats[product.category].totalPurchased += product.totalPurchased;
        });

        return Object.values(stats);
    },

    getSuggestions: async () => {
        return MOCK_SUGGESTIONS;
    },

    addSuggestion: async (suggestion: Omit<Suggestion, 'id' | 'isActive'>) => {
        const newSuggestion = {
            ...suggestion,
            id: generateId(),
            isActive: true,
        };
        MOCK_SUGGESTIONS.push(newSuggestion);
        return newSuggestion;
    },

    deleteSuggestion: async (id: string) => {
        MOCK_SUGGESTIONS = MOCK_SUGGESTIONS.filter(s => s.id !== id);
    }
};
