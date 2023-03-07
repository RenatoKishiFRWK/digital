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
    return db.run(sql);
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

class TransacaoModel {
  constructor(id, remetente, destinatario, valor, data) {
    this.id = id;
    this.remetente = remetente;
    this.destinatario = destinatario;
    this.valor = valor;
    this.data = data;
  }

  static createTable() {
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

  static create(transacao) {
    const sql = `
      INSERT INTO transacoes (remetente, destinatario, valor, data)
        VALUES (?, ?, ?, datetime('now'));
      `;
    return db.run(sql, [transacao.remetente, transacao.destinatario, transacao.valor]);
  }
  

    static findAllByUser(id) {
      const sql = 'SELECT * FROM transacoes WHERE remetente = ? OR destinatario = ? ORDER BY data DESC;';
      return new Promise((resolve, reject) => {
        db.all(sql, [id, id], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            const transacoes = rows.map(row => new TransacaoModel(row.id, row.remetente, row.destinatario, row.valor, row.data));
            resolve(transacoes);
          }
        });
      });
    }
    
    }
    
    module.exports = { UserModel, TransacaoModel };