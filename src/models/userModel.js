const db = require('../database/database');

class UserModel {
    constructor(id, nome, cpf_cnpj, email, senha) {
      this.id = id;
      this.nome = nome;
      this.cpf_cnpj = cpf_cnpj;
      this.email = email;
      this.senha = senha;
    }
  
    static createTable() {
      const sql = `
        CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          cpf_cnpj TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          senha TEXT NOT NULL
        );
      `;
      return db.run(sql).then(() => console.log(`Table "${TABLE_NAME}" has been created.`))
      .catch((err) => console.error(`Error running the query: ${err}`));;
    }
  
    static create(user) {
      const sql = `
        INSERT INTO usuarios (nome, cpf_cnpj, email, senha)
        VALUES (?, ?, ?, ?);
      `;
      return db.run(sql, [user.nome, user.cpf_cnpj, user.email, user.senha]);
    }
  
    static findByEmail(email) {
      return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM usuarios WHERE email = ?`;
    
        db.get(sql, [email], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            const user = new UserModel(row.id, row.nome, row.cpf_cnpj, row.email, row.senha);
            resolve(user);
          } else {
            resolve(null);
          }
        });
      });
    }
  
    static findById(id) {
      const sql = `
        SELECT * FROM usuarios WHERE id = ?;
      `;
      return new Promise((resolve, reject) => {
        db.get(sql, [id], (err, row) => {
          if (err) {
            reject(err);
          } else if (row) {
            resolve(new UserModel(row.id, row.nome, row.cpf_cnpj, row.email, row.senha));
          } else {
            resolve(null);
          }
        });
      });
    }
    
  }
  module.exports = UserModel;