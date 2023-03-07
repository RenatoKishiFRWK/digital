const sqlite3 = require('sqlite3').verbose();
const DB_PATH = './src/database/database.sqlite';

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error(err.message);
    throw err;
  }
  console.log('Connected to the database.');
});


function createUsersTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cpf_cnpj TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    );
  `;
  return db.run(sql);
}

function createTransacoesTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS transacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      remetente INTEGER NOT NULL,
      destinatario INTEGER NOT NULL,
      valor REAL NOT NULL,
      data TEXT NOT NULL,
      FOREIGN KEY (remetente) REFERENCES usuarios(id),
      FOREIGN KEY (destinatario) REFERENCES usuarios(id)
    );
  `;
  return db.run(sql);
}

module.exports =  db;