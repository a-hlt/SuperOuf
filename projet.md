# SUPER OUF - Prompt Complet pour Claude Code

Tu es un développeur expert chargé de créer **Super OUF**, une application web de gestion de listes de courses familiales.

---

## 🎯 Objectif

Créer une application Next.js 14 complète avec 3 interfaces utilisateur distinctes (PARENT, CHILD, SUPEROUF) permettant la gestion collaborative de listes de courses en temps réel.

---

## 📋 Stack Technique Obligatoire

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: shadcn/ui + Tailwind CSS (mobile-first)
- **Base de données**: MongoDB Atlas + Prisma ORM
- **Authentication**: Better-Auth
- **Temps réel**: Server-Sent Events (SSE)
- **Deployment ready**: Vercel

---

## 🏗️ Architecture

### Pattern 3-Tiers

```
Presentation Layer (Next.js + React + shadcn/ui)
    ↓ HTTP/SSE
Business Logic Layer (API Routes + Better-Auth + RBAC)
    ↓ Prisma
Data Layer (MongoDB Atlas)
```

### Modèle de Données (Prisma Schema)

Créer exactement ce schema dans `prisma/schema.prisma`:

**Entités principales:**
- **User**: id, email, name, role (PARENT/CHILD/SUPEROUF), pinCode?, householdId?
- **Household**: id, name, inviteCode (unique), users[], lists[]
- **ShoppingList**: id, name, isActive, isTemplate, householdId, items[]
- **ShoppingItem**: id, name, quantity, category?, checked, status (VALIDATED/PENDING/REJECTED), listId, proposedById?
- **ProductAnalytics**: id, productName (unique), totalRequests, totalPurchased, category?
- **Suggestion**: id, productName, description, discount?, isActive

**Relations:**
- User belongsTo Household
- Household hasMany Users, hasMany ShoppingLists
- ShoppingList belongsTo Household, hasMany ShoppingItems
- ShoppingItem belongsTo ShoppingList, belongsTo User (proposedBy)

**Indexes:**
- ShoppingList: [householdId, isActive]
- ShoppingItem: [listId, status]
- ProductAnalytics: [totalRequests]

---

## 👥 User Stories par Rôle

### 👨‍👩‍👧‍👦 PARENT (5 User Stories)

**US1:** En tant que parent, je veux créer un compte et un foyer familial  
**US2:** En tant que parent, je veux voir ma liste de courses en temps réel  
**US3:** En tant que parent, je veux ajouter/supprimer des produits à la liste active  
**US4:** En tant que parent, je veux valider ou rejeter les produits candidats proposés par les enfants  
**US7:** En tant que parent, je veux cocher les produits achetés en temps réel  

### 🧒 CHILD (4 User Stories)

**US8:** En tant qu'enfant, je veux me connecter avec un code famille + code PIN (4 chiffres)  
**US9:** En tant qu'enfant, je veux voir la liste de courses actuelle en lecture seule  
**US10:** En tant qu'enfant, je veux proposer des produits candidats  
**US11:** En tant qu'enfant, je veux voir le statut de mes propositions (en attente/validé/rejeté)  

### 🏪 SUPEROUF (4 User Stories)

**US12:** En tant que Super OUF, je veux consulter les listes agrégées (anonymisées)  
**US13:** En tant que Super OUF, je veux voir les produits les plus demandés (top 10)  
**US14:** En tant que Super OUF, je veux créer des suggestions de promotions  
**US15:** En tant que Super OUF, je veux voir les statistiques par catégorie de produits  

---

## 🔐 Règles de Sécurité (RBAC)

### Matrice de Permissions

| Action | PARENT | CHILD | SUPEROUF |
|--------|--------|-------|----------|
| Créer liste | ✅ | ❌ | ❌ |
| Ajouter item | ✅ | ❌ | ❌ |
| Cocher item | ✅ | ❌ | ❌ |
| Supprimer item | ✅ | ❌ | ❌ |
| Proposer candidat | ✅ | ✅ | ❌ |
| Valider candidat | ✅ | ❌ | ❌ |
| Voir liste foyer | ✅ | ✅ | ❌ |
| Voir analytics | ❌ | ❌ | ✅ |
| Créer suggestion | ❌ | ❌ | ✅ |

### Middleware

Protéger TOUTES les routes sauf `/login`, `/register`, `/child/login` et `/api/*`.

Rediriger les utilisateurs non-authentifiés vers `/login`.

---

## 🎨 Structure du Projet

```
super-ouf/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx (liste active)
│   │   │   ├── history/page.tsx
│   │   │   └── layout.tsx
│   │   ├── child/
│   │   │   ├── page.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── layout.tsx
│   │   ├── superouf/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...betterauth]/route.ts
│   │   │   │   └── child-login/route.ts
│   │   │   ├── household/
│   │   │   │   ├── route.ts (GET, POST)
│   │   │   │   └── children/route.ts (POST)
│   │   │   ├── lists/
│   │   │   │   ├── route.ts (GET all, POST create)
│   │   │   │   ├── active/route.ts (GET)
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts
│   │   │   │       ├── items/route.ts (POST)
│   │   │   │       └── stream/route.ts (GET SSE)
│   │   │   ├── items/[id]/
│   │   │   │   ├── route.ts (PATCH, DELETE)
│   │   │   │   ├── check/route.ts (PATCH toggle)
│   │   │   │   └── validate/route.ts (PATCH)
│   │   │   ├── candidates/
│   │   │   │   └── route.ts (GET, POST)
│   │   │   └── analytics/
│   │   │       ├── route.ts (GET global)
│   │   │       ├── top-products/route.ts
│   │   │       ├── by-category/route.ts
│   │   │       └── suggestions/route.ts (GET, POST, DELETE)
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── auth/
│   │   ├── shopping/
│   │   ├── child/
│   │   └── superouf/
│   ├── lib/
│   │   ├── auth.ts (Better-Auth config)
│   │   ├── db.ts (Prisma client singleton)
│   │   └── utils.ts (cn, etc.)
│   ├── hooks/
│   │   ├── use-realtime-list.ts
│   │   └── use-session.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
└── .env.local
```

---

## 📡 API Routes Specifications

### Auth Routes

**POST /api/auth/sign-in**
- Body: `{ email, password }`
- Retour: Session Better-Auth

**POST /api/auth/sign-up**
- Body: `{ email, password, name, role }`
- Role par défaut: PARENT
- Retour: User créé

**POST /api/auth/child-login**
- Body: `{ inviteCode, pin }` (pin = 4 chiffres)
- Logique: Trouver household par inviteCode, vérifier bcrypt PIN
- Retour: Session enfant

### Household Routes

**POST /api/household**
- Auth required: PARENT
- Body: `{ name }`
- Logique: Créer foyer avec inviteCode aléatoire (6 chars uppercase)
- Connecter user actuel au foyer
- Retour: Household créé

**GET /api/household**
- Auth required
- Retour: Household de l'utilisateur avec users[] et lists[]

**POST /api/household/children**
- Auth required: PARENT only
- Body: `{ name, pin, householdId }`
- Logique: Créer User role=CHILD, email fictif, hash PIN
- Retour: Enfant créé

### Lists Routes

**GET /api/lists**
- Auth required
- Retour: Toutes les listes du foyer avec items[]

**POST /api/lists**
- Auth required: PARENT
- Body: `{ name, isTemplate? }`
- Logique: Si !isTemplate, désactiver ancienne liste active
- Retour: Liste créée

**GET /api/lists/active**
- Auth required
- Retour: Liste active du foyer avec items[] et proposedBy

**POST /api/lists/[id]/items**
- Auth required: PARENT
- Body: `{ name, quantity?, category? }`
- Logique: Créer item status=VALIDATED, incrémenter ProductAnalytics
- Retour: Item créé

**GET /api/lists/[id]/stream**
- Auth required
- Retour: SSE stream avec polling 2s
- Format: `data: { type: 'initial|update', data: ShoppingList }\n\n`

### Items Routes

**PATCH /api/items/[id]**
- Auth required: PARENT
- Body: Partial ShoppingItem
- Retour: Item modifié

**DELETE /api/items/[id]**
- Auth required: PARENT
- Retour: 204

**PATCH /api/items/[id]/check**
- Auth required: PARENT
- Logique: Toggle checked, si checked=true incrémenter ProductAnalytics.totalPurchased
- Retour: Item modifié

**PATCH /api/items/[id]/validate**
- Auth required: PARENT only
- Body: `{ approve: boolean }`
- Logique: Si approve, status=VALIDATED + upsert ProductAnalytics. Sinon status=REJECTED
- Retour: Item modifié

### Candidates Routes

**GET /api/candidates**
- Auth required
- Query: `?userId=xxx` (optionnel)
- Retour: Items status IN [PENDING, VALIDATED, REJECTED] du foyer ou de l'user

**POST /api/candidates**
- Auth required: CHILD ou PARENT
- Body: `{ name, quantity?, listId }`
- Logique: Créer item status=PENDING, proposedById=session.user.id
- Retour: Candidat créé

### Analytics Routes

**GET /api/analytics**
- Auth required: SUPEROUF only
- Retour: `{ stats: { totalHouseholds, totalLists, totalItems }, lists: [] anonymisées }`

**GET /api/analytics/top-products**
- Retour: ProductAnalytics[] orderBy totalRequests DESC limit 10

**GET /api/analytics/by-category**
- Retour: ProductAnalytics groupBy category avec _sum et _count

**GET /api/analytics/suggestions**
- Retour: Suggestion[] where isActive=true

**POST /api/analytics/suggestions**
- Auth required: SUPEROUF only
- Body: `{ productName, description, discount? }`
- Retour: Suggestion créée

**DELETE /api/analytics/suggestions?id=xxx**
- Auth required: SUPEROUF only
- Retour: 200

---

## 🎨 Composants Frontend

### Composants Auth (shadcn/ui)

**LoginForm**: Email + Password + Submit
**RegisterForm**: Email + Password + Name + Submit
**PinLogin**: InviteCode input + PIN keypad (0-9) + Submit

### Composants Shopping

**ShoppingList**:
- Affiche liste active avec items validés
- Section candidats en attente (si PARENT)
- Badge nombre candidats
- Utilise `useRealtimeList(listId)` hook

**ShoppingItem**:
- Checkbox (PARENT only)
- Nom + Quantité
- Bouton supprimer (PARENT only)
- Boutons Valider/Rejeter si candidat (PARENT only)

**AddItemForm**:
- Input nom + Input quantité + Bouton Ajouter
- PARENT only

### Composants Child

**ChildListView**:
- Affichage read-only des items validés
- Items cochés en vert avec icône check

**ProposeItemForm**:
- Input nom + Input quantité + Bouton Proposer
- Style fun avec gradient purple-pink

**MyProposals**:
- Liste des propositions de l'enfant
- Badges: En attente (Clock), Validé (Check green), Rejeté (X red)

### Composants SuperOUF

**AnalyticsDashboard**:
- 3 StatsCards: Foyers, Listes, Produits
- Intègre TopProducts, CategoryStats, SuggestionsManager

**StatsCard**:
- Icône + Nombre + Label

**TopProducts**:
- Liste top 10 avec rang, nom, nb demandes, nb achetés

**CategoryStats**:
- Grid de cards par catégorie

**SuggestionsManager**:
- Formulaire ajout suggestion
- Liste suggestions avec bouton supprimer

---

## 🔄 Temps Réel (SSE)

### Hook `useRealtimeList(listId)`

- Créer EventSource vers `/api/lists/${listId}/stream`
- Écouter messages SSE
- Parser JSON: `{ type: 'initial|update', data: ShoppingList }`
- Mettre à jour state local
- Cleanup: eventSource.close() au unmount

### API Stream

- Utiliser ReadableStream avec TextEncoder
- Envoyer état initial immédiatement
- Polling toutes les 2s pour récupérer liste à jour
- Format SSE: `data: ${JSON.stringify(...)}\n\n`
- Headers: Content-Type: text/event-stream, no-cache, keep-alive

---

## 🎯 Parcours Utilisateur

### Parcours PARENT

1. Register → Créer foyer → Voir dashboard
2. Créer nouvelle liste automatiquement
3. Ajouter 3-5 produits
4. Voir candidats enfants apparaître
5. Valider/Rejeter candidats
6. Cocher produits achetés

### Parcours CHILD

1. Login avec code famille + PIN
2. Voir liste read-only
3. Proposer 2 candidats
4. Voir statut propositions (en attente)
5. Voir statut passer à Validé ou Rejeté

### Parcours SUPEROUF

1. Login email/password
2. Voir dashboard analytics
3. Consulter top 10 produits
4. Voir stats par catégorie
5. Créer suggestion promo
6. Supprimer suggestion

---

## ✅ Checklist Fonctionnalités

### Essentielles (MVP)

- [ ] Auth Better-Auth (email/password)
- [ ] Login PIN enfants (inviteCode + 4 digits)
- [ ] CRUD listes de courses
- [ ] CRUD items (PARENT only)
- [ ] Temps réel SSE (2+ browsers)
- [ ] Propositions candidats (CHILD)
- [ ] Validation candidats (PARENT)
- [ ] Toggle check items (PARENT)
- [ ] Analytics globales (SUPEROUF)
- [ ] Top 10 produits (SUPEROUF)
- [ ] Stats par catégorie (SUPEROUF)
- [ ] Suggestions CRUD (SUPEROUF)
- [ ] RBAC strict (middleware + API)
- [ ] Mobile responsive
- [ ] Error handling
- [ ] Loading states

### Nice-to-Have

- [ ] Historique listes
- [ ] Modèles de listes
- [ ] Dupliquer liste
- [ ] Catégories prédéfinies
- [ ] Notifications badge
- [ ] Dark mode

---

## 🚀 Instructions de Développement

### Setup Initial

1. Créer projet Next.js 14 avec TypeScript, Tailwind, App Router
2. Installer: prisma, @prisma/client, better-auth, bcrypt
3. Init Prisma avec MongoDB provider
4. Créer schema Prisma exact
5. Push schema: `npx prisma db push`
6. Init shadcn/ui (style: default, color: slate)
7. Ajouter composants shadcn: button, card, checkbox, input, badge, dialog, form, toast

### Configuration

- `.env.local`: DATABASE_URL (MongoDB Atlas), AUTH_SECRET
- `src/lib/db.ts`: Prisma client singleton
- `src/lib/auth.ts`: Better-Auth config avec Prisma adapter MongoDB
- `src/middleware.ts`: Protection routes

### Ordre de Développement

**Phase 1**: Auth + Household
1. Better-Auth setup
2. Pages login/register
3. API household POST/GET
4. Middleware protection

**Phase 2**: Lists CRUD + Temps Réel
1. API lists GET/POST
2. API lists/[id]/items POST
3. API items/[id] PATCH/DELETE
4. API lists/[id]/stream SSE
5. Hook useRealtimeList
6. Composants ShoppingList, ShoppingItem, AddItemForm
7. Page dashboard

**Phase 3**: Candidats
1. API candidates GET/POST
2. API items/[id]/validate PATCH
3. Login PIN enfants
4. Page child + composants
5. Intégration validation dans ShoppingList

**Phase 4**: Analytics
1. ProductAnalytics auto-increment
2. API analytics routes
3. Page superouf + composants
4. RBAC SUPEROUF

**Phase 5**: Polish
1. Error boundaries
2. Loading spinners
3. Toast notifications
4. Responsive mobile
5. Tests manuels

---

## 🎨 Design Guidelines

### Mobile-First

- Breakpoints: sm (640px), md (768px), lg (1024px)
- Stack vertical sur mobile
- Grid 2-4 colonnes sur desktop

### Colors

- Primary: green-500 (theme courses)
- Success: green-600
- Danger: red-500
- Warning: yellow-500
- Muted: slate-500

### Typography

- Headings: font-bold
- Body: font-normal
- Small: text-sm text-gray-600

### Spacing

- Sections: space-y-6
- Cards: p-4
- Forms: space-y-4

---

## 🧪 Tests Manuels

### Scénario Complet

1. Ouvrir 3 browsers:
   - Browser A: Parent 1
   - Browser B: Enfant
   - Browser C: Parent 2

2. Browser A:
   - Register parent1@test.com
   - Créer foyer "Famille Test"
   - Noter inviteCode
   - Ajouter 3 produits

3. Browser B:
   - Login PIN avec inviteCode
   - Voir les 3 produits
   - Proposer 2 candidats

4. Browser A:
   - Voir badge "2 candidats"
   - Valider 1, refuser 1
   - Cocher 1 produit

5. Browser C:
   - Register parent2@test.com (rôle SUPEROUF)
   - Voir analytics
   - Top produits affichés
   - Créer suggestion

6. Vérifier temps réel:
   - Browser A ajoute produit → Browser B le voit
   - Browser A coche produit → Browser B le voit coché

---

## 📝 Notes Importantes

### Better-Auth

- Utiliser Prisma adapter MongoDB
- Session cookie: 7 jours
- Email/password enabled

### MongoDB

- Utiliser ObjectId partout (@db.ObjectId)
- Indexes critiques: [householdId, isActive], [listId, status]

### SSE

- Polling 2s acceptable pour PoC
- Production: MongoDB Change Streams

### Analytics

- Incrémenter ProductAnalytics lors:
  - Ajout item (totalRequests++)
  - Check item (totalPurchased++)

### Sécurité

- TOUTES les API routes doivent vérifier session
- RBAC: vérifier user.role avant actions sensibles
- Ne JAMAIS exposer données autres foyers

---

## 🎯 Critères de Réussite

Application considérée comme **complète** si:

✅ Un parent peut créer un foyer et une liste
✅ Un parent peut ajouter/supprimer/cocher des produits
✅ Un enfant peut se connecter avec PIN
✅ Un enfant peut proposer des produits
✅ Un parent peut valider/rejeter les propositions
✅ Le temps réel fonctionne (2 browsers en parallèle)
✅ SuperOUF peut voir les analytics
✅ L'application est responsive mobile
✅ Aucun crash, erreurs gérées proprement

---

**Commence par le setup initial, puis développe fonctionnalité par fonctionnalité en respectant l'ordre suggéré. Bonne chance ! 🚀**