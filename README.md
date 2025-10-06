# Nicolas OSBORNE

# Clean Architecture - Tests et Stratégies de Déploiement pour une Application Clean Architecture

## Contexte

Ce TP est réalisé dans le cadre du module "Clean Architecture" en M2 Ingénierie du Web à l'ESGI, dispensé par Laurent BELLON.

## Objectif du TP

Ce projet a pour objectif :

- Implémenter des tests unitaires pour les composants du domaine (Entités, Use Cases).
- Écrire des tests d'intégration pour les adaptateurs.
- Analyser et discuter des stratégies de déploiement adaptées à la Clean Architecture.

## Prérequis

Une mini-application de gestion d'un catalogue de produits.
Composants clés :

- Entité `Product`

  - Attributs :
    - `id` (UUID/String)
    - `name`(String)
    - `description` (String)
    - `price` (Float)
    - `stock`(Integer)
  - Règles métier :
    - `name` ne peut pas être vide
    - `price` doit être strictement positif
    - `stock` doit être supérieur ou égal à zéro
  - Méthodes :
    - `updateName(newName)`
    - `updateDescription(newDescription)`
    - `changePrice(newPrice)`
    - `adjustStock(quantity)`

- Use Cases :

  - `CreateProductUseCase` : créer un nouveau produit.
  - `GetProductByIdUseCase` : récupérer un produit par son ID.
  - `UpdateProductUseCase` : mettre à jour les informations d'un produit existant.
  - `DeleteProductUseCase` : supprimer un produit.
  - `GetAllProductsUseCase` : récupérer tous les produits.

- Ports (Interfaces) :

  - `ProductRepository` : interface définissant les opérations de persistance.
  - `ProductOutputPort` : interface pour la présentation des résultats.

- Adaptateurs (Initial) :
  - `InMemoryProductRepository` : implémentation simple de `ProductRepository` utilisant une collection en mémoire pour stocker les produits.

## Technologies utilisées

- Node.js et Express en TypeScript pour le back-end
- HTML, CSS et JavaScript pour le front-end

## Lancer l'application

- S'assurer d'avoir Node.js d'installé

- Installer les dépendances :

```bash
npm install
```

- Lancer l'application :

```bash
npm start
```

- Accéder à l'application à l'addresse http://localhost:3000

## Partie 1 : Tests Unitaires (Core Domain)
