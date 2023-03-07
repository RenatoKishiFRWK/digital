const db = require('./database/database');
const User = require('./model/Usuario');
const Transaction = require('./model/Transacao');

const seed = () => {
  const user1 = new User(null, 'Jose de Souza', 'jose@naosei.com', 'senha1', '111.111.111-11');
  const user2 = new User(null, 'Antonio da Silva', 'antonio@naosei.com', 'senha2', '222.222.222-22');
  
  //constructor(id, userId, remetente, destinatario, historico, valor, data) 

  const transaction1 = new Transaction(null, user1.id, user1.id, user1.id,'Deposito', 1000, new Date().toISOString());
  const transaction2 = new Transaction(null, user1.id, user1.id, user1.id,'Retirada', -500, new Date().toISOString());
  const transaction3 = new Transaction(null, user2.id, user2.id, user2.id,'Deposito', 2000, new Date().toISOString());

  db.serialize(() => {
    db.run('DELETE FROM usuarios');
    db.run('DELETE FROM transacoes');

    const usersStmt = db.prepare('INSERT INTO usuarios (nome,email, senha, cpf_cnpj) VALUES (?, ?, ?, ?)');
    usersStmt.run(user1.nome, user1.email, user1.senha, user1.cpf_cnpj);
    usersStmt.run(user2.nome, user2.email, user2.senha, user2.cpf_cnpj);
''
    const transactionsStmt = db.prepare('INSERT INTO transacoes (userId, historico, valor, data) VALUES (?, ?, ?, ?)');
    transactionsStmt.run(transaction1.userId, transaction1.historico, transaction1.valor, transaction1.data);
    transactionsStmt.run(transaction2.userId, transaction2.historico, transaction2.valor, transaction2.data);
    transactionsStmt.run(transaction3.userId, transaction3.historico, transaction3.valor, transaction3.data);
 
    usersStmt.finalize();
    transactionsStmt.finalize();
  });
};

seed(); 
