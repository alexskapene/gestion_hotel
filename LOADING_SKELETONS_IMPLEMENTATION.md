# Documentation - Implémentation Loading States avec Skeletons

## Vue d'ensemble

Ce document explique l'implémentation des **loading states avec skeletons** pour les pages d'hôtels et de chambres, utilisant l'architecture **Server Components + loading.tsx** de Next.js App Router.

## Architecture choisie : Solution 2

### Pourquoi cette solution ?

- **Prête pour l'API** : Architecture native pour connecter une vraie API sans refactor
- **SEO optimal** : Rendu côté serveur pour un meilleur référencement
- **Cache automatique** : Next.js gère le cache intelligemment
- **Streaming progressif** : Affichage progressif du contenu
- **Standard Next.js** : Utilise les patterns recommandés par Next.js

## Structure des fichiers

```
app/
├── (public)/
│   └── hotels/
│       ├── page.tsx          (Server Component - fetch data)
│       └── loading.tsx       (Skeletons affichés pendant le fetch)
├── dashboard/
    └── hotel/
        └── rooms/
            ├── page.tsx      (Server Component - fetch data)
            └── loading.tsx   (Skeletons affichés pendant le fetch)

components/
├── HotelCardSkeleton.tsx    (Skeleton pour carte hôtel)
├── RoomCardSkeleton.tsx     (Skeleton pour carte chambre)
├── HotelsPageClient.tsx     (Client Component - interactivité)
└── RoomsPageClient.tsx      (Client Component - interactivité)

lib/
├── fetchHotels.ts           (Data fetching async)
└── fetchRooms.ts            (Data fetching async)
```

## Composants créés

### 1. Skeletons

#### HotelCardSkeleton (`components/HotelCardSkeleton.tsx`)

Skeleton qui matche exactement la structure de `HotelCard` :
- Image placeholder (aspect 4/3)
- Badge de notation
- Titre
- Prix
- Icônes d'équipements
- CTA "Découvrir"

#### RoomCardSkeleton (`components/RoomCardSkeleton.tsx`)

Skeleton qui matche la structure des cartes de chambres :
- Image placeholder
- Badge de statut
- Bouton menu
- Titre et numéro
- Prix
- Description
- Capacité et équipements
- Boutons d'action

### 2. Fonctions de Data Fetching

#### fetchHotels (`lib/fetchHotels.ts`)

```typescript
export async function fetchHotels() {
  // Simuler un délai réseau (2 secondes)
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Retourner les données mockées
  return Hotels;
}
```

**Pour connecter une vraie API :**

```typescript
export async function fetchHotels() {
  const response = await fetch('https://api.example.com/hotels', {
    next: { revalidate: 3600 } // Cache 1h
  });
  return response.json();
}
```

#### fetchRooms (`lib/fetchRooms.ts`)

Même pattern que `fetchHotels` pour les chambres.

### 3. Client Components

#### HotelsPageClient (`components/HotelsPageClient.tsx`)

Gère toute l'interactivité côté client :
- État de recherche
- Filtres (ville, prix, équipements)
- Tri
- Rendu des cartes d'hôtels

Reçoit les données en props du Server Component.

#### RoomsPageClient (`components/RoomsPageClient.tsx`)

Même pattern pour la gestion des chambres :
- Recherche par numéro/type
- Filtres par statut et type
- Actions (modifier, supprimer, changer statut)

### 4. Server Components

#### Hotels Page (`app/(public)/hotels/page.tsx`)

```typescript
import { HotelsPageClient } from "@/components/HotelsPageClient";
import { fetchHotels } from "@/lib/fetchHotels";

export default async function HotelsPage() {
  const hotels = await fetchHotels();
  return <HotelsPageClient hotels={hotels} />;
}
```

**Points clés :**
- Pas de `"use client"` → Server Component par défaut
- `async function` → permet d'attendre le data fetching
- Passe les données au Client Component

#### Rooms Page (`app/dashboard/hotel/rooms/page.tsx`)

Même pattern que la page hotels.

### 5. Loading States

#### Hotels Loading (`app/(public)/hotels/loading.tsx`)

Affiché automatiquement par Next.js pendant le fetch :
- Hero section skeleton
- Header et search bar skeleton
- Grille de 8 `HotelCardSkeleton`

#### Rooms Loading (`app/dashboard/hotel/rooms/loading.tsx`)

- Header skeleton
- Filtres skeleton
- Grille de 6 `RoomCardSkeleton`

## Fonctionnement

### Flux de navigation

1. **User visite la page** → Next.js rend immédiatement `loading.tsx`
2. **Server Component fetch** les données de manière asynchrone
3. **Une fois les données reçues** → Next.js remplace `loading.tsx` par `page.tsx` avec les vraies données
4. **Client Component** gère l'interactivité (filtres, recherche)

### Avantages du streaming

Si certaines parties chargent plus vite, elles s'affichent progressivement. Avec React Suspense, vous pouvez avoir des loading states granulaires par section.

## Migration vers une vraie API

### Étape 1 : Modifier les fonctions de fetch

Dans `lib/fetchHotels.ts` :

```typescript
export async function fetchHotels() {
  const response = await fetch('https://votre-api.com/hotels', {
    next: { revalidate: 3600 }, // Cache 1h
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch hotels');
  }
  
  return response.json();
}
```

### Étape 2 : Gestion des erreurs

Créez `error.tsx` dans le même dossier que `page.tsx` :

```typescript
export default function Error({ error, reset }: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Erreur de chargement</h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}
```

### Étape 3 : Cache et revalidation

Next.js propose plusieurs stratégies de cache :

```typescript
// Cache avec revalidation (ISR)
fetch('https://api.com/hotels', {
  next: { revalidate: 3600 } // Revalider toutes les heures
})

// Pas de cache (SSR à chaque requête)
fetch('https://api.com/hotels', {
  cache: 'no-store'
})

// Cache statique (SSG)
fetch('https://api.com/hotels', {
  next: { revalidate: false }
})

// Revalidation on-demand
// Utilisez revalidatePath() ou revalidateTag() dans un route handler
```

## Personnalisation des Skeletons

### Modifier le délai de chargement

Dans `lib/fetchHotels.ts` ou `lib/fetchRooms.ts` :

```typescript
// Changez 2000 (2 secondes) pour la durée souhaitée
await new Promise((resolve) => setTimeout(resolve, 2000));
```

### Ajuster le nombre de skeletons

Dans les fichiers `loading.tsx` :

```typescript
// Pour hotels : changer 8 pour le nombre souhaité
{[...Array(8)].map((_, i) => <HotelCardSkeleton key={i} />)}

// Pour rooms : changer 6 pour le nombre souhaité
{[...Array(6)].map((_, i) => <RoomCardSkeleton key={i} />)}
```

### Personnaliser l'apparence des skeletons

Les skeletons utilisent les classes Tailwind :
- `bg-muted` → couleur de fond
- `animate-pulse` → animation de pulsation
- `rounded` → coins arrondis

Vous pouvez ajuster ces classes pour changer l'apparence.

## Bonnes pratiques

### 1. Server Components vs Client Components

**Utilisez Server Components pour :**
- Data fetching
- Rendu initial
- Contenu statique

**Utilisez Client Components pour :**
- Interactivité (useState, useEffect)
- Event handlers
- Browser APIs

### 2. Séparation des responsabilités

- **Server Component** : Fetch data → Pass to Client
- **Client Component** : Receive data → Handle interactivity
- **Loading Component** : Show skeleton → Auto-replaced by Next.js

### 3. Performance

- Utilisez le cache Next.js pour réduire les appels API
- Évitez les fetchs inutiles dans les Client Components
- Utilisez Suspense pour des chargements granulaires

### 4. Accessibilité

- Les skeletons doivent avoir la même structure que le contenu réel
- Utilisez `aria-busy="true"` sur les conteneurs en chargement
- Assurez-vous que les skeletons sont annoncés par les screen readers

## Dépannage

### Le loading.tsx ne s'affiche pas

**Cause possible** : Le fetch est trop rapide

**Solution** : Augmentez le délai dans `fetchHotels.ts` ou `fetchRooms.ts`

### Erreur "useState is not defined"

**Cause possible** : Vous avez oublié `"use client"` dans un Client Component

**Solution** : Ajoutez `"use client"` en haut du fichier

### Les données ne s'affichent pas

**Cause possible** : Le fetch échoue

**Solution** : 
1. Vérifiez la console pour les erreurs
2. Créez un `error.tsx` pour capturer les erreurs
3. Vérifiez que les fonctions de fetch retournent les bonnes données

## Résumé

### Ce qui a été implémenté

✅ **Composants Skeleton**
- `HotelCardSkeleton` - Matche la structure des cartes d'hôtels
- `RoomCardSkeleton` - Matche la structure des cartes de chambres

✅ **Data Fetching**
- `fetchHotels()` - Fonction async avec délai simulé
- `fetchRooms()` - Fonction async avec délai simulé

✅ **Server Components**
- `app/(public)/hotels/page.tsx` - Fetch et passe les données
- `app/dashboard/hotel/rooms/page.tsx` - Fetch et passe les données

✅ **Client Components**
- `HotelsPageClient` - Gère l'interactivité des hôtels
- `RoomsPageClient` - Gère l'interactivité des chambres

✅ **Loading States**
- `app/(public)/hotels/loading.tsx` - Skeletons pour hôtels
- `app/dashboard/hotel/rooms/loading.tsx` - Skeletons pour chambres

### Prochaines étapes

1. **Tester** l'implémentation en naviguant sur les pages
2. **Connecter** votre vraie API en modifiant les fonctions de fetch
3. **Ajuster** le cache selon vos besoins
4. **Ajouter** la gestion des erreurs avec `error.tsx`
5. **Optimiser** avec Suspense pour des chargements plus granulaires

## Ressources
                                
- [Next.js Loading UI](https://nextjs.org/docs/app/building-your-application/routing/loading-ui)
- [Next.js Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
