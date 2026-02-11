// Based on Prisma Schema
export enum Role {
    PARENT = "PARENT",
    CHILD = "CHILD",
    SUPEROUF = "SUPEROUF"
}

export enum ItemStatus {
    VALIDATED = "VALIDATED",
    PENDING = "PENDING",
    REJECTED = "REJECTED"
}

export interface User {
    id: string;
    email: string;
    name: string;
    emailVerified?: boolean;
    image?: string | null;
    role: Role;
    pinCode?: string | null;
    createdAt: Date;
    updatedAt: Date;
    householdId?: string | null;
    // Relations omitted for frontend simple type, usually fetched separately or nested
}

export interface Household {
    id: string;
    name: string;
    inviteCode: string;
    createdAt: Date;
}

export interface ShoppingList {
    id: string;
    name: string;
    isActive: boolean;
    isTemplate: boolean;
    createdAt: Date;
    completedAt?: Date | null;
    householdId: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    quantity: number; // Changed from string to number (Int in DB), front-end might need parsing
    category?: string | null;
    checked: boolean;
    status: ItemStatus;
    createdAt: Date;
    listId: string;
    proposedById?: string | null;
    proposedBy?: User | null; // Optional nested relation for UI display
}
