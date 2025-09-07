// MongoDB initialization script
db = db.getSiblingDB('sistema-aprendizagem');

// Create indexes for better performance
db.resources.createIndex({ id: 1 }, { unique: true });
db.recursos.createIndex({ title: "text" });
db.eventos.createIndex({ id: 1 }, { unique: true });
db.eventos.createIndex({ data: 1 });
db.users.createIndex({ username: 1 }, { unique: true });

console.log('Database initialized with indexes');