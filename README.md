# Super OUF - Frontend

Ce projet contient l'implémentation Frontend de la page principale de "Super OUF".
Il utilise **Next.js 14**, **Tailwind CSS**, et **Shadcn UI**.

## Fonctionnalités Implémentées

- **Sidebar (Gauche)** :
    - Affiche le profil utilisateur (Nom + Avatar).
    - Affiche la liste des listes de courses.
    - Bouton de déconnexion.
- **Mobile Navigation** :
    - Menu Burger visible uniquement sur mobile.
    - Ouvre la Sidebar dans un panneau latéral.
- **Todo List (Centre)** :
    - Barre de recherche pour filtrer les produits.
    - Liste des produits (validés et en attente).
    - Gestion des rôles via un menu déroulant.

## Architecture & Types (Backend-Ready)

Le frontend est structuré pour s'aligner avec le futur schéma Prisma (MongoDB).
Les types sont définis dans `types/schema.ts` :

- **Role** : `PARENT`, `CHILD`, `SUPEROUF`
- **ItemStatus** : `VALIDATED`, `PENDING`, `REJECTED`
- **User** : `id`, `name`, `role`, `image`...
- **ShoppingList** : `id`, `name`, `isActive`...
- **ShoppingItem** : `id`, `name`, `quantity` (number), `status`...

## Gestion des Rôles (Simulée)

1.  **Parent** : Accès complet, voit toutes les listes.
2.  **Enfant** : Accès restreint (Lecture seule, Proposition), voit uniquement la liste active.

## Comment lancer le projet

1.  Installer les dépendances :
    ```bash
    npm install
    ```

2.  Lancer le serveur de développement :
    ```bash
    npm run dev
    ```

3.  Ouvrir `http://localhost:3000` (ou le port indiqué) dans votre navigateur.
