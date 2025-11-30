db = db.getSiblingDB('sistema-aprendizagem');

db.phases.drop();

db.phases.insertMany([
  // --- GRUPO 1 ---
  { "_id": ObjectId(), "group": 1, "position": 1, "name": "Fase 1 - Baía Tranquila", "isBossPhase": false },
  { "_id": ObjectId(), "group": 1, "position": 2, "name": "Fase 2 - Recifes Perigosos", "isBossPhase": false },
  { "_id": ObjectId(), "group": 1, "position": 3, "name": "Fase 3 - Ilha Misteriosa", "isBossPhase": false },
  { "_id": ObjectId(), "group": 1, "position": 4, "name": "Fase 4 - Tempestade no Horizonte", "isBossPhase": false },
  { "_id": ObjectId(), "group": 1, "position": 5, "name": "Chefe - O Capitão Fantasma", "isBossPhase": true },

  // --- GRUPO 2 ---
  { "_id": ObjectId(), "group": 2, "position": 1, "name": "Fase 1 - Trilha do Eco", "isBossPhase": false },
  { "_id": ObjectId(), "group": 2, "position": 2, "name": "Fase 2 - Pico Gelado", "isBossPhase": false },
  { "_id": ObjectId(), "group": 2, "position": 3, "name": "Fase 3 - Vale Nebuloso", "isBossPhase": false },
  { "_id": ObjectId(), "group": 2, "position": 4, "name": "Fase 4 - Caverna Secreta", "isBossPhase": false },
  { "_id": ObjectId(), "group": 2, "position": 5, "name": "Chefe - Guardião da Montanha", "isBossPhase": true },

  // --- GRUPO 3 ---
  { "_id": ObjectId(), "group": 3, "position": 1, "name": "Fase 1 - Clareira Silenciosa", "isBossPhase": false },
  { "_id": ObjectId(), "group": 3, "position": 2, "name": "Fase 2 - Troncos Caídos", "isBossPhase": false },
  { "_id": ObjectId(), "group": 3, "position": 3, "name": "Fase 3 - Rio Rápido", "isBossPhase": false },
  { "_id": ObjectId(), "group": 3, "position": 4, "name": "Fase 4 - Penhasco Oculto", "isBossPhase": false },
  { "_id": ObjectId(), "group": 3, "position": 5, "name": "Chefe - Sábio da Floresta", "isBossPhase": true },

  // --- GRUPO 4 ---
  { "_id": ObjectId(), "group": 4, "position": 1, "name": "Fase 1 - Dunas Infinitas", "isBossPhase": false },
  { "_id": ObjectId(), "group": 4, "position": 2, "name": "Fase 2 - Oásis Escondido", "isBossPhase": false },
  { "_id": ObjectId(), "group": 4, "position": 3, "name": "Fase 3 - Tempestade de Areia", "isBossPhase": false },
  { "_id": ObjectId(), "group": 4, "position": 4, "name": "Fase 4 - Ruínas Antigas", "isBossPhase": false },
  { "_id": ObjectId(), "group": 4, "position": 5, "name": "Chefe - Faraó Esquecido", "isBossPhase": true },

  // --- GRUPO 5 ---
  { "_id": ObjectId(), "group": 5, "position": 1, "name": "Fase 1 - Túnel Escuro", "isBossPhase": false },
  { "_id": ObjectId(), "group": 5, "position": 2, "name": "Fase 2 - Lago de Lava", "isBossPhase": false },
  { "_id": ObjectId(), "group": 5, "position": 3, "name": "Fase 3 - Caverna Cristalina", "isBossPhase": false },
  { "_id": ObjectId(), "group": 5, "position": 4, "name": "Fase 4 - Abismo Profundo", "isBossPhase": false },
  { "_id": ObjectId(), "group": 5, "position": 5, "name": "Chefe - Dragão Ancião", "isBossPhase": true }
]);