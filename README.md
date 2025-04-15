# 📦 API Carte de Restaurant (v0.2.0)

## 🚀 Objectif du projet

Développer un web service local permettant de récupérer :

- La liste des produits nationaux disponibles en stock
- La liste des stocks filtrés et ordonnés selon les règles suivantes :

### 🎯 Règles métier

- Les produits hors stock **ne sont pas retournés**
- Les produits avec une DLC à **J+3** apparaissent dans la catégorie **"produits mis en avant"** et bénéficient d’une **remise de 30%**
- Les produits sont **ordonnés par prix décroissant**

---

## ✅ Bilan

L’ensemble du POC a été réalisé avec succès.

---

## 📚 Documentation API

Un Swagger est mis en place pour documenter l'API.

👉 Accès : [http://localhost:3000/api](http://localhost:3000/api)

---

## ⚙️ Lancer le projet

```bash
git clone https://github.com/Massi-97/restaurant-api.git
cd restaurant-api
git checkout main
npm run start
```

## 🧪 Couverture de tests (Jest)

Les modules `product`, `stock` et `auth` ont été testés avec **Jest**.

| Type de couverture | Pourcentage |
|--------------------|-------------|
| Statements         | 76.92%      |
| Branches           | 28.57%      |
| Functions          | 66.66%      |
| Lines              | 75.15%      |

---

## 🎁 Bonus

Une stratégie de **cache** a été mise en place à l’aide de `@nestjs/cache-manager` (v3.0.1) :

- **TTL** (Time To Live) : 1 minute
- **Max items** : 100 objets en cache

---

## 🗂️ Versioning

Stratégie Git : **Git Flow**
Historique des releases: **CHANGELOG.md**

📦 Trois livrables disponibles sur [GitHub - Releases](https://github.com/Massi-97/restaurant-api/tags) :

- `v0.0.1`
- `v0.1.0`
- `v0.2.0` (🎯 version finale, disponible sur la branche `main`)