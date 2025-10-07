# MyContacts
Projet de l'EFREI - Wassini BOUZIDI - Fullstack JS
Un gestionnaire de contacts (frontend en React + backend en Express/MongoDB).

Production 
- Backend : https://mycontacts-vqph.onrender.com/api
- Frontend : https://danpn-mycontacts.netlify.app
- Swagger : https://mycontacts-vqph.onrender.com/api/docs


## Setup
Prérequis :

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Une instance [MongoDB](https://www.mongodb.com/products/platform/cloud) (URI requis)

1. Cloner le dépôt, installer les dépendances du serveur et lancer le serveur :

```bash
cd server
npm install
npm run dev   # utilise nodemon pour le développement
```

1. Créer un fichier `.env` dans `server/` avec les variables suivantes :

- MONGO_URI=<your-mongo-connection-string>
- JWT_SECRET=<a-secret-for-jwt>
- FRONTEND_URL=<http://localhost:3000> (optionnel, utilisé pour le CORS)
- PORT=3000 (optionnel)

2. Dans un nouveau terminal, installer et lancer le client :

```bash
cd client
npm install
npm start
```

Une fois les deux serveurs en fonctionnement, le frontend communiquera avec le backend via l’URL configurée dans `FRONTEND_URL` et le chemin de base de l’API `/api`.

## Scripts
Server (`server/package.json`):

- `npm run dev` — démarre le serveur avec nodemon
- `npm start` — démarre le serveur avec node
- `npm test` — démarre les tests avec Jest

Client (`client/package.json`):

- `npm start` — démarre le serveur de dev
- `npm run build` — build le projet pour la production
- `npm test` — démarre les tests React
- `npm run eject` — ejecte CRA config

## API Endpoints

Chemin de base : `/api`

- Vérification de l’état (Health check)
	- GET `/api/health` — retourne { status: 'OK', timestamp }

- Authentification (pas d’authentification requise)
	- POST `/api/auth/register` — register. Body : { email, password }
	- POST `/api/auth/login` — login. Body : { email, password } — retourne un token JWT

- Contacts (requiert le header Authorization header `Bearer <token>`)
	- POST `/api/contact/` — créer un contact
	- GET `/api/contact/` — récupérer les contacts
	- PATCH `/api/contact/:id` — mettre à jour un contact par son id
	- DELETE `/api/contact/:id` — supprimer un contact par son id

- API docs (Swagger UI)
	- GET `/api/docs` — documentation interactive de l’API

NB:
- Toutes les routes protégées attendent le header `Authorization: Bearer <JWT>`
- Les JWT sont signés avec la variable d’environnement `JWT_SECRET` et expirent après environ 2 heures.

## Test Unitaires

```bash
cd server
npm run test
```

Des tests unitaires pour les contrôleurs, les services et les validateurs se trouvent dans les sous-dossiers respectifs à l'intérieur des dossiers `__tests__`.

## Test Fonctionnel

1. Rendez-vous sur : https://danpn-mycontacts.netlify.app (le test est aussi possible en local)

2. Créez un compte ou utilisez ces identifiants de test :
```md 
email : jean10@gmail.com
mot de passe : Lavieestdur!9
```

3. Créez, modifiez ou supprimez un contact !


