# FoodFact Recherche - Frontend

Application frontend moderne construite avec Next.js 14, React et TypeScript pour rechercher et explorer des produits alimentaires avec leurs informations nutritionnelles.

## 📋 Vue d'ensemble

Le frontend de FoodFact Recherche est une Single Page Application (SPA) qui permet aux utilisateurs de :
- Rechercher des produits alimentaires
- Filtrer par marque, pays, valeurs nutritionnelles
- Consulter les détails complets d'un produit
- Voir les scores nutritionnels (Nutri-Score, Eco-Score, NOVA)

## 🚀 Prérequis

- Node.js 18+ 
- npm ou yarn

## 📦 Installation

```bash
# Installer les dépendances
npm install
```

## 🏃 Développement

```bash
# Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🏗️ Build de production

```bash
# Créer une build optimisée
npm run build

# Lancer le serveur de production
npm start
```

## 📁 Structure du projet

```
frontend_react/
├── app/                    # Pages et layouts Next.js (App Router)
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Page d'accueil
│   ├── globals.css         # Styles globaux
│   └── product/            # Pages de détail produit
│
├── components/             # Composants React réutilisables
│   ├── ProductCard.tsx     # Carte produit
│   ├── SearchFilters.tsx   # Filtres de recherche
│   └── ui/                 # Composants UI (shadcn/ui)
│
├── lib/                    # Utilitaires et helpers
│   ├── api.ts              # Client API
│   ├── types.ts            # Types TypeScript
│   └── utils.ts            # Fonctions utilitaires
│
└── public/                 # Assets statiques
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Par défaut, l'application se connecte à `http://localhost:8080`.

## 🎨 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour plus de sécurité
- **Tailwind CSS** - Framework CSS utility-first
- **shadcn/ui** - Composants UI réutilisables
- **Lucide Icons** - Bibliothèque d'icônes

## 📱 Fonctionnalités

### Recherche
- Recherche en temps réel avec debounce (300ms)
- Recherche par nom de produit, marque ou catégorie

### Filtres
- **Marque** : Filtrer par nom de marque
- **Pays** : Filtrer par pays de disponibilité
- **Énergie** : Plage min/max en kcal/100g
- **Sucres** : Plage min/max en g/100g
- **Matières grasses** : Plage min/max en g/100g
- **Tri** : Par énergie, sucres ou matières grasses

### Affichage produit
- Image du produit
- Nom et marque
- Quantité
- Informations nutritionnelles
- Scores (Nutri-Score, Eco-Score, NOVA)
- Ingrédients
- Allergènes
- Labels
- Pays de disponibilité

## ⚡ Optimisations

- **Debounce** sur les recherches pour réduire les appels API
- **Lazy loading** des images
- **Mémoisation** des composants avec `React.memo`
- **Code splitting** automatique avec Next.js
- **Skeleton loaders** pour un meilleur feedback utilisateur

## 🐛 Dépannage

### Le frontend ne se connecte pas au backend

1. Vérifiez que le backend est démarré sur le port 8080
2. Vérifiez la variable d'environnement `NEXT_PUBLIC_API_URL`
3. Vérifiez la console du navigateur pour les erreurs CORS

### Erreurs de build

```bash
# Nettoyer le cache et réinstaller
rm -rf .next node_modules
npm install
npm run build
```

## 📝 Scripts disponibles

- `npm run dev` - Démarre le serveur de développement
- `npm run build` - Crée une build de production
- `npm start` - Lance le serveur de production
- `npm run lint` - Vérifie le code avec ESLint

## 🔗 Liens utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation React](https://react.dev)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
