db = db.getSiblingDB('sistema-aprendizagem');

db.products.drop();

db.products.insertMany([
  {
    "_id": ObjectId(),
    "name": "Boné Estiloso",
    "type": "headwear",
    "rarity": "common",
    "price": 50,
    "url": "https://storage.googleapis.com/skillup-bucket/public/items/cap.png"
  },
  {
    "_id": ObjectId(),
    "name": "Luva de Boxeador",
    "type": "gloves",
    "rarity": "common",
    "price": 120,
    "url": "https://storage.googleapis.com/skillup-bucket/public/items/boxing-gloves.png"
  },
  {
    "_id": ObjectId(),
    "name": "Excalibur",
    "type": "weapon",
    "rarity": "legendary",
    "price": 200,
    "url": "https://storage.googleapis.com/skillup-bucket/public/items/sword.png"
  }
]);