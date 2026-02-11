# SUPER OUF - Setup BDD & Auth (Phase 1)

**Mission**: Mettre en place la base de données MongoDB + Prisma et l'authentification Better-Auth avec les 3 rôles (PARENT, CHILD, SUPEROUF).

---

## 🎯 Objectif de cette Phase

À la fin de cette phase, l'application doit avoir :
- ✅ MongoDB Atlas configuré avec Prisma
- ✅ Schema Prisma complet avec toutes les entités
- ✅ Better-Auth configuré pour email/password
- ✅ Login/Register pour PARENT
- ✅ Login PIN pour CHILD
- ✅ Middleware de protection des routes
- ✅ API Household (création de foyer)
- ✅ Pages fonctionnelles : /login, /register, /child/login

---

## 📦 Stack pour cette Phase

- **Database**: MongoDB Atlas (cloud, gratuit)
- **ORM**: Prisma (avec provider MongoDB)
- **Auth**: Better-Auth (avec Prisma adapter)
- **Hash**: bcrypt (pour les PINs)
- **Framework**: Next.js 14 App Router

---

## 🗄️ PARTIE 1 : Base de Données

### Étape 1.1 : Initialiser Prisma

```bash
npm install prisma @prisma/client
npx prisma init
```

### Étape 1.2 : Configurer MongoDB dans .env.local

Créer le fichier `.env.local` avec :

```
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/superouf?retryWrites=true&w=majority"
AUTH_SECRET="genere-une-cle-secrete-de-minimum-32-caracteres-aleatoires"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Note**: Remplacer `username:password@cluster` par les vraies credentials MongoDB Atlas.

### Étape 1.3 : Créer le Schema Prisma COMPLET

Fichier `prisma/schema.prisma` :

**Provider**: mongodb (obligatoire)

**Modèles requis** :

**1. User**
- id: ObjectId (PK)
- email: String (unique)
- name: String
- role: Enum Role (PARENT | CHILD | SUPEROUF) default PARENT
- pinCode: String? (nullable, pour les enfants)
- createdAt: DateTime default now()
- householdId: ObjectId? (FK nullable)
- Relations:
  - household: Household? (belongsTo)
  - proposedItems: ShoppingItem[] (hasMany via "ProposedBy")

**2. Household**
- id: ObjectId (PK)
- name: String
- inviteCode: String (unique) - code à 6 caractères pour inviter enfants
- createdAt: DateTime default now()
- Relations:
  - users: User[] (hasMany)
  - lists: ShoppingList[] (hasMany)

**3. ShoppingList**
- id: ObjectId (PK)
- name: String
- isActive: Boolean default true (une seule liste active par foyer)
- isTemplate: Boolean default false (pour modèles)
- createdAt: DateTime default now()
- completedAt: DateTime? (nullable)
- householdId: ObjectId (FK)
- Relations:
  - household: Household (belongsTo, onDelete Cascade)
  - items: ShoppingItem[] (hasMany)
- Index: [householdId, isActive]

**4. ShoppingItem**
- id: ObjectId (PK)
- name: String
- quantity: Int default 1
- category: String? (nullable - ex: "Fruits", "Viande")
- checked: Boolean default false
- status: Enum ItemStatus (VALIDATED | PENDING | REJECTED) default VALIDATED
- createdAt: DateTime default now()
- listId: ObjectId (FK)
- proposedById: ObjectId? (FK nullable - qui a proposé ce candidat)
- Relations:
  - list: ShoppingList (belongsTo, onDelete Cascade)
  - proposedBy: User? (belongsTo)
- Index: [listId, status]

**5. ProductAnalytics** (pour SuperOUF)
- id: ObjectId (PK)
- productName: String (unique)
- totalRequests: Int default 0 (combien de fois demandé)
- totalPurchased: Int default 0 (combien de fois acheté)
- category: String? (nullable)
- lastRequested: DateTime default now()
- Index: [totalRequests]

**6. Suggestion** (pour SuperOUF)
- id: ObjectId (PK)
- productName: String
- description: String
- discount: String? (ex: "20%", "2+1 gratuit")
- isActive: Boolean default true
- createdAt: DateTime default now()
- expiresAt: DateTime? (nullable)

**Enums** :
- Role: PARENT, CHILD, SUPEROUF
- ItemStatus: VALIDATED, PENDING, REJECTED

**IMPORTANT** : Pour MongoDB avec Prisma :
- Utiliser `@id @default(auto()) @map("_id") @db.ObjectId` pour tous les IDs
- Utiliser `@db.ObjectId` pour toutes les foreign keys
- Les relations many-to-one nécessitent le champ FK explicite

### Étape 1.4 : Push le Schema

```bash
npx prisma db push
npx prisma generate
```

Cela crée les collections MongoDB et génère le Prisma Client.

### Étape 1.5 : Créer le Prisma Client Singleton

Fichier `src/lib/db.ts` :

Créer une instance Prisma singleton qui :
- Réutilise la même instance en dev (hot reload)
- Crée une nouvelle instance en production
- Export `prisma` comme constante

Pattern :
```
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

---

## 🔐 PARTIE 2 : Authentification

### Étape 2.1 : Installer Better-Auth

```bash
npm install better-auth bcrypt
npm install -D @types/bcrypt
```

### Étape 2.2 : Configurer Better-Auth

Fichier `src/lib/auth.ts` :

Créer la config Better-Auth avec :
- Database: prismaAdapter (provider: "mongodb")
- EmailAndPassword: enabled
- Session: expiresIn 7 jours (60 * 60 * 24 * 7)
- User additionalFields: role (type: string, defaultValue: "PARENT")

Export :
- `auth` : l'instance Better-Auth
- `Session` type : typeof auth.$Infer.Session.session
- `User` type : typeof auth.$Infer.Session.user

### Étape 2.3 : API Route Better-Auth

Fichier `src/app/api/auth/[...betterauth]/route.ts` :

Importer auth depuis @/lib/auth
Utiliser toNextJsHandler(auth)
Exporter { GET, POST }

### Étape 2.4 : Middleware de Protection

Fichier `src/middleware.ts` :

Logique :
- Récupérer le cookie 'better-auth.session_token'
- Routes publiques : /login, /register, /child/login, /api/*
- Si pas de session ET route privée → redirect /login
- Si session ET route auth → redirect /
- Sinon → next()

Matcher : tous les paths sauf _next/static, _next/image, favicon.ico

---

## 👤 PARTIE 3 : Pages Auth PARENT

### Étape 3.1 : Layout Auth

Fichier `src/app/(auth)/layout.tsx` :

Layout simple centré avec :
- Container max-w-md
- Centrage vertical et horizontal (min-h-screen flex items-center justify-center)
- Padding responsive

### Étape 3.2 : Page Register

Fichier `src/app/(auth)/register/page.tsx` :

Page serveur qui affiche RegisterForm component

Fichier `src/components/auth/register-form.tsx` :

Composant client avec :
- Champs : email (type email), password (type password), name (text)
- Bouton Submit
- Lien vers /login ("Déjà un compte ?")
- onSubmit :
  - POST /api/auth/sign-up avec { email, password, name, role: "PARENT" }
  - Si succès → redirect /
  - Si erreur → afficher message erreur

Utiliser shadcn/ui : Card, Input, Button, Form

### Étape 3.3 : Page Login

Fichier `src/app/(auth)/login/page.tsx` :

Page serveur qui affiche LoginForm component

Fichier `src/components/auth/login-form.tsx` :

Composant client avec :
- Champs : email, password
- Bouton Submit
- Lien vers /register ("Créer un compte")
- Lien vers /child/login ("Je suis un enfant")
- onSubmit :
  - POST /api/auth/sign-in avec { email, password }
  - Si succès → redirect /
  - Si erreur → afficher message erreur

---

## 🧒 PARTIE 4 : Login PIN Enfant

### Étape 4.1 : API Child Login

Fichier `src/app/api/auth/child-login/route.ts` :

POST handler qui :
1. Reçoit { inviteCode, pin } (pin = string de 4 chiffres)
2. Trouve le Household avec inviteCode
3. Si pas trouvé → 401 "Code famille invalide"
4. Récupère tous les users CHILD de ce household
5. Pour chaque child, compare bcrypt le PIN avec child.pinCode
6. Si match trouvé → créer session Better-Auth pour cet enfant
7. Retour { success: true, user }
8. Si aucun match → 401 "Code PIN invalide"

**Important**: Utiliser `bcrypt.compare(pin, child.pinCode)` pour comparer

### Étape 4.2 : Page Login PIN

Fichier `src/app/child/login/page.tsx` :

Page serveur qui affiche PinLogin component

Fichier `src/components/child/pin-login.tsx` :

Composant client avec :

**UI** :
- Input inviteCode (6 caractères, uppercase auto, placeholder "ABC123")
- Section "Code PIN" avec :
  - 4 boxes pour afficher les chiffres saisis (afficher • au lieu du chiffre)
  - Clavier numérique 3x3 + 0 en bas (boutons 1-9, 0)
  - Bouton "Effacer" qui reset le PIN
- Bouton "Valider" (disabled si PIN != 4 chiffres OU inviteCode vide)

**Logique** :
- State : inviteCode, pin
- handlePinInput(digit) → si pin.length < 4, ajouter digit
- handleClear → pin = ""
- handleSubmit :
  - POST /api/auth/child-login avec { inviteCode, pin }
  - Si succès → window.location.href = '/child'
  - Si erreur → afficher toast erreur

**Style** :
- Card avec gradient fun (purple-pink)
- Gros boutons numériques (size lg)
- Boxes PIN avec border-2

---

## 🏠 PARTIE 5 : Household API

### Étape 5.1 : API Create Household

Fichier `src/app/api/household/route.ts` :

**POST** :
1. Vérifier session Better-Auth
2. Si pas de session → 401
3. Récupérer { name } du body
4. Générer inviteCode unique à 6 caractères (uppercase, alphanumerique)
5. Créer Household avec name + inviteCode
6. Connecter l'user actuel à ce household (relation)
7. Retour Household créé avec users included

**GET** :
1. Vérifier session
2. Récupérer l'user avec son household (include users, lists avec items)
3. Retour household ou null

### Étape 5.2 : API Create Child

Fichier `src/app/api/household/children/route.ts` :

**POST** :
1. Vérifier session
2. Vérifier que user.role === "PARENT" sinon 403
3. Récupérer { name, pin, householdId } du body
4. Valider : pin doit être 4 chiffres
5. Hash le PIN avec bcrypt (bcrypt.hash(pin, 10))
6. Créer User avec :
   - name
   - email: `${name.toLowerCase().replace(/\s/g, '')}@child.local` (email fictif)
   - role: "CHILD"
   - pinCode: hashedPin
   - householdId
7. Retour child créé (sans pinCode dans la réponse)

---

## 📱 PARTIE 6 : Pages de Base

### Étape 6.1 : Page d'accueil temporaire

Fichier `src/app/page.tsx` :

Page serveur qui :
1. Récupère la session
2. Si pas de session → redirect /login
3. Si role === "CHILD" → redirect /child
4. Si role === "SUPEROUF" → redirect /superouf
5. Sinon (PARENT) → redirect /dashboard

Ou afficher un message "Bienvenue" avec liens vers les sections

### Étape 6.2 : Layout Dashboard

Fichier `src/app/(dashboard)/layout.tsx` :

Layout avec :
- Header avec logo "Super OUF" + nom user + bouton logout
- Navigation (si besoin)
- Container principal avec children

### Étape 6.3 : Page Dashboard Placeholder

Fichier `src/app/(dashboard)/page.tsx` :

Pour l'instant, juste afficher :
- "Dashboard Parent"
- Afficher le nom du household
- Message "Liste de courses à venir..."

---

## ✅ Checklist Phase 1

### Base de Données
- [ ] MongoDB Atlas configuré
- [ ] Prisma init
- [ ] Schema avec 6 modèles (User, Household, ShoppingList, ShoppingItem, ProductAnalytics, Suggestion)
- [ ] Enums Role et ItemStatus
- [ ] Index sur [householdId, isActive] et [listId, status]
- [ ] prisma db push réussi
- [ ] prisma generate réussi
- [ ] src/lib/db.ts singleton créé

### Authentication
- [ ] Better-Auth installé
- [ ] src/lib/auth.ts configuré avec Prisma adapter
- [ ] API route [...betterauth] créé
- [ ] Middleware de protection créé
- [ ] Routes publiques : /login, /register, /child/login

### Pages PARENT
- [ ] Layout (auth) créé
- [ ] Page /register fonctionnelle
- [ ] Page /login fonctionnelle
- [ ] Composant RegisterForm (shadcn)
- [ ] Composant LoginForm (shadcn)
- [ ] Redirect après login

### Login CHILD
- [ ] API /api/auth/child-login créé
- [ ] Page /child/login créée
- [ ] Composant PinLogin avec keypad
- [ ] Validation PIN avec bcrypt
- [ ] Redirect vers /child après login

### Household
- [ ] API POST /api/household (create)
- [ ] API GET /api/household (read)
- [ ] API POST /api/household/children (create child)
- [ ] InviteCode généré aléatoirement
- [ ] PIN hashé avec bcrypt

### Pages de Base
- [ ] Page / avec redirections par rôle
- [ ] Layout dashboard basique
- [ ] Page dashboard placeholder

---

## 🧪 Tests Manuels Phase 1

### Test 1 : Register Parent
1. Aller sur /register
2. Remplir email, password, name
3. Submit
4. Vérifier redirect vers /
5. Vérifier user créé dans MongoDB (Prisma Studio)

### Test 2 : Login Parent
1. Logout (si besoin)
2. Aller sur /login
3. Remplir credentials
4. Submit
5. Vérifier redirect vers /dashboard

### Test 3 : Créer Household
1. En tant que parent connecté
2. Appeler POST /api/household avec { name: "Famille Test" }
3. Vérifier inviteCode généré
4. Vérifier household créé dans MongoDB

### Test 4 : Créer Enfant
1. Appeler POST /api/household/children avec { name: "Tom", pin: "1234", householdId }
2. Vérifier child créé avec email fictif
3. Vérifier pinCode hashé (pas "1234" en clair)

### Test 5 : Login PIN Enfant
1. Aller sur /child/login
2. Entrer inviteCode du household
3. Entrer PIN 1234 via keypad
4. Submit
5. Vérifier redirect vers /child
6. Essayer mauvais PIN → erreur

### Test 6 : Middleware
1. Déconnecter
2. Essayer d'aller sur /dashboard → redirect /login
3. Connecter
4. Essayer d'aller sur /login → redirect /

---

## 🎨 Composants shadcn/ui Nécessaires

Installer avec `npx shadcn-ui@latest add [component]` :

- [ ] button
- [ ] card
- [ ] input
- [ ] label
- [ ] form (optional, pour validation)
- [ ] toast (pour messages erreur/succès)

---

## 🚨 Points d'Attention

### MongoDB ObjectId
- TOUJOURS utiliser `@db.ObjectId` pour les IDs et FKs
- Format : `@id @default(auto()) @map("_id") @db.ObjectId`

### Better-Auth Session
- Le cookie s'appelle 'better-auth.session_token'
- Utiliser `auth.api.getSession({ headers: req.headers })`

### bcrypt
- TOUJOURS hasher les PINs : `bcrypt.hash(pin, 10)`
- Comparer avec : `bcrypt.compare(pin, hashedPin)`
- Ne JAMAIS stocker les PINs en clair

### InviteCode
- Générer avec : `Math.random().toString(36).substring(2, 8).toUpperCase()`
- Vérifier unicité (peut retry si collision)

### Middleware
- Ne PAS protéger /api/* (sinon Better-Auth ne fonctionne pas)
- Ne PAS protéger /_next/*

---

## 🎯 Résultat Attendu

À la fin de cette phase, l'application doit :

✅ Permettre à un parent de s'inscrire  
✅ Permettre à un parent de se connecter  
✅ Permettre de créer un foyer  
✅ Permettre de créer un enfant avec PIN  
✅ Permettre à un enfant de se connecter avec inviteCode + PIN  
✅ Protéger toutes les routes privées  
✅ Avoir une base MongoDB avec toutes les collections  

**Les autres fonctionnalités (listes, items, temps réel, analytics) seront dans les phases suivantes.**

---

## 📝 Commandes Utiles

```bash
# Voir la base de données
npx prisma studio

# Reset la base (si besoin)
npx prisma db push --force-reset

# Voir les logs Prisma
# Ajouter dans prisma/schema.prisma :
# datasource db {
#   url = env("DATABASE_URL")
#   provider = "mongodb"
#   log = ["query", "info", "warn", "error"]
# }

# Tester une API route
curl -X POST http://localhost:3000/api/household \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Family"}'
```

---

**Commence par la PARTIE 1 (BDD), puis PARTIE 2 (Auth), puis les autres dans l'ordre. Chaque partie doit être fonctionnelle avant de passer à la suivante.**

**Bonne chance ! 🚀**