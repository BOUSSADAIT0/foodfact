# FoodFact Recherche

FoodFact Recherche est une application web complète permettant de rechercher et d'explorer des informations nutritionnelles détaillées sur des produits alimentaires en utilisant les données d'OpenFoodFacts.

## 📋 Vue d'ensemble

Cette application est composée de deux parties principales :
- **Frontend** : Application React/Next.js moderne et responsive
- **Backend** : API REST en Scala utilisant http4s

## ✨ Fonctionnalités

- 🔍 Recherche avancée de produits alimentaires
- 📊 Affichage des informations nutritionnelles complètes
- 🏷️ Filtres par marque, pays, valeurs nutritionnelles
- 📈 Scores Nutri-Score, Eco-Score et NOVA
- 🌍 Filtrage par pays de disponibilité
- 📱 Interface responsive et moderne
- ⚡ Performances optimisées avec debounce et lazy loading

## 🚀 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (version 18 ou supérieure)
- [npm](https://www.npmjs.com/) (généralement inclus avec Node.js)
- [Scala](https://www.scala-lang.org/) (version 3.3+)
- [sbt](https://www.scala-sbt.org/) (Scala Build Tool)
- [Java](https://www.oracle.com/java/) (version 17 ou supérieure)

## 📦 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/Yamnyr/NutriRecherche.git
cd NutriRecherche
```

### 2. Installation du Frontend

```bash
cd frontend_react
npm install
```

### 3. Installation du Backend

Le backend utilise sbt qui téléchargera automatiquement les dépendances lors de la première compilation.

## 🏃 Lancement

### Option 1 : Lancer les deux services séparément

**Terminal 1 - Backend :**
```bash
cd backend_scala
.\sbt.bat run
# ou sur Linux/Mac:
# sbt run
```

Le backend sera disponible sur [http://localhost:8080](http://localhost:8080)

**Terminal 2 - Frontend :**
```bash
cd frontend_react
npm run dev
```

Le frontend sera disponible sur [http://localhost:3000](http://localhost:3000)

### Option 2 : Utiliser les scripts de démarrage

Consultez les README individuels dans chaque dossier pour plus de détails.

## 📁 Structure du projet

```
FoodFact-Recherche/
├── frontend_react/               # Frontend React/Next.js
│   ├── app/                      # Pages et layouts Next.js
│   ├── components/               # Composants React réutilisables
│   ├── lib/                      # Utilitaires et API client
│   └── README.md                 # Documentation frontend
│
├── backend_scala/                # Backend Scala
│   ├── src/main/scala/           # Code source Scala
│   │   ├── Models.scala          # Modèles de données
│   │   ├── OpenFoodClient.scala  # Client API OpenFoodFacts
│   │   └── Server.scala          # Serveur HTTP et routes
│   └── README.md                 # Documentation backend
│
└── README.md                     # Ce fichier
```

## 🔧 Configuration

### Variables d'environnement

**Frontend** (optionnel) :
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Backend** :
Le backend écoute par défaut sur le port 8080. Vous pouvez modifier cela dans `Server.scala`.

## 📚 Documentation

- [Documentation Frontend](./frontend_react/README.md)
- [Documentation Backend](./backend_scala/README.md)

## 🛠️ Technologies utilisées

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **Lucide Icons** - Icônes

### Backend
- **Scala 3** - Langage de programmation
- **http4s** - Framework HTTP
- **Circe** - Sérialisation JSON
- **Cats Effect** - Programmation asynchrone

## 🤝 Contribution

Les contributions sont les bienvenues ! Merci de :

1. Créer une branche pour vos modifications
2. Suivre les conventions de code existantes
3. Tester vos modifications
4. Soumettre un pull request avec une description claire

## 📝 License

Ce projet est sous licence MIT.

## 🙏 Remerciements

- [OpenFoodFacts](https://world.openfoodfacts.org/) pour l'API et les données
- La communauté open source pour les outils et bibliothèques utilisés
