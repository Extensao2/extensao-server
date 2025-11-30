db = db.getSiblingDB('sistema-aprendizagem');

db.products.drop();

db.products.insertMany([
  // --- HEADWEAR (Cabeça) ---
  {
    "_id": ObjectId(),
    "name": "Gorro de Lã",
    "type": "headwear",
    "rarity": "common",
    "price": 50,
    "url": "https://placehold.co/200x200/png?text=Gorro+La"
  },
  {
    "_id": ObjectId(),
    "name": "Elmo de Soldado",
    "type": "headwear",
    "rarity": "common",
    "price": 120,
    "url": "https://placehold.co/200x200/png?text=Elmo+Soldado"
  },
  {
    "_id": ObjectId(),
    "name": "Capacete Tático",
    "type": "headwear",
    "rarity": "rare",
    "price": 450,
    "url": "https://placehold.co/200x200/png?text=Capacete+Tatico"
  },
  {
    "_id": ObjectId(),
    "name": "Coroa do Rei Antigo",
    "type": "headwear",
    "rarity": "legendary",
    "price": 2500,
    "url": "https://placehold.co/200x200/png?text=Coroa+Rei"
  },

  // --- GLOVES (Luvas) ---
  {
    "_id": ObjectId(),
    "name": "Luvas de Jardinagem",
    "type": "gloves",
    "rarity": "common",
    "price": 30,
    "url": "https://placehold.co/200x200/png?text=Luvas+Jardinagem"
  },
  {
    "_id": ObjectId(),
    "name": "Manoplas de Couro",
    "type": "gloves",
    "rarity": "common",
    "price": 80,
    "url": "https://placehold.co/200x200/png?text=Manoplas+Couro"
  },
  {
    "_id": ObjectId(),
    "name": "Luvas de Magma",
    "type": "gloves",
    "rarity": "rare",
    "price": 600,
    "url": "https://placehold.co/200x200/png?text=Luvas+Magma"
  },
  {
    "_id": ObjectId(),
    "name": "Manoplas do Infinito",
    "type": "gloves",
    "rarity": "legendary",
    "price": 5000,
    "url": "https://placehold.co/200x200/png?text=Manoplas+Infinito"
  },

  // --- FOOTWEAR (Calçados) ---
  {
    "_id": ObjectId(),
    "name": "Sandálias Velhas",
    "type": "footwear",
    "rarity": "common",
    "price": 25,
    "url": "https://placehold.co/200x200/png?text=Sandalias"
  },
  {
    "_id": ObjectId(),
    "name": "Botas de Caminhada",
    "type": "footwear",
    "rarity": "common",
    "price": 100,
    "url": "https://placehold.co/200x200/png?text=Botas+Caminhada"
  },
  {
    "_id": ObjectId(),
    "name": "Botas Aladas",
    "type": "footwear",
    "rarity": "rare",
    "price": 800,
    "url": "https://placehold.co/200x200/png?text=Botas+Aladas"
  },
  {
    "_id": ObjectId(),
    "name": "Passos de Sombra",
    "type": "footwear",
    "rarity": "legendary",
    "price": 3200,
    "url": "https://placehold.co/200x200/png?text=Passos+Sombra"
  },

  // --- WEAPON (Armas) ---
  {
    "_id": ObjectId(),
    "name": "Adaga Enferrujada",
    "type": "weapon",
    "rarity": "common",
    "price": 60,
    "url": "https://placehold.co/200x200/png?text=Adaga"
  },
  {
    "_id": ObjectId(),
    "name": "Espada de Treino",
    "type": "weapon",
    "rarity": "common",
    "price": 150,
    "url": "https://placehold.co/200x200/png?text=Espada+Treino"
  },
  {
    "_id": ObjectId(),
    "name": "Machado de Batalha",
    "type": "weapon",
    "rarity": "rare",
    "price": 750,
    "url": "https://placehold.co/200x200/png?text=Machado"
  },
  {
    "_id": ObjectId(),
    "name": "Cajado Arcano",
    "type": "weapon",
    "rarity": "rare",
    "price": 900,
    "url": "https://placehold.co/200x200/png?text=Cajado"
  },
  {
    "_id": ObjectId(),
    "name": "Excalibur",
    "type": "weapon",
    "rarity": "legendary",
    "price": 10000,
    "url": "https://placehold.co/200x200/png?text=Excalibur"
  }
]);