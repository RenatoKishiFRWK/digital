const axios = require('axios');
const bcrypt = require('bcrypt');
const { UserModel, TransacaoModel } = require('../models/models');

const saltRounds = 10;

class UserController {
  static async cadastrar(req, res) {
    const { nome, cpf_cnpj, email, senha } = req.body;
   
    // Verifica se todos os campos são obrigatórios
    if (!nome || !cpf_cnpj || !email || !senha) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o CPF/CNPJ já está em uso
      /* fazer */

      
    // Verifica se o email já está em uso
    
    const userExists = await UserModel.findByEmail(email);
    if (userExists) {
      return res.status(409).json({ error: 'Este e-mail já está cadastrado.' });
    }


    // Criptografa a senha
    const hash = await bcrypt.hash(senha, saltRounds);

    // Cria o usuário
    const user = new UserModel(null, nome, cpf_cnpj, email, hash);
    try {
      await user.constructor.createTable();
      await user.constructor.create(user);
      return res.status(201).json({ message: 'Usuário cadastrado com sucesso.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ocorreu um erro interno.' });
    }
  }
}

class TransacaoController {
  static async transferir(req, res) {
    const { remetente, destinatario, valor } = req.body;

    // Verifica se todos os campos são obrigatórios
    if (!remetente || !destinatario || !valor) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // Verifica se o remetente e o destinatário existem
    const remetenteExists = await UserModel.findById(remetente);
    const destinatarioExists = await UserModel.findById(destinatario);
    if (!remetenteExists || !destinatarioExists) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    console.log(remetenteExists.cpf_cnpj);
    
    // Verifica se o remetente é um lojista
    if (remetenteExists.cpf_cnpj && remetenteExists.cpf_cnpj.replace(/\D/g, '').length === 14) {
      return res.status(403).json({ error: 'Lojista não autorizado.' });
    }

    // Verifica se o remetente tem saldo suficiente
    const transacoes = await TransacaoModel.findAllByUser(remetente);
    const saldo = transacoes.reduce((acc, cur) => {
      if (cur.remetente === remetente) {
        return acc - cur.valor;
      } else {
        return acc + cur.valor;
      }
    }, 0);
    if (saldo < valor) {
      return res.status(400).json({ error: 'Saldo insuficiente.' });
    }

    // Consulta o serviço autorizador externo
    try {
      const response = await axios.get('https://run.mocky.io/v3/1f1b822a-3d6f-4b95-9a01-b3e6191e436b');
      
      if (response.data.status !== 'Autorizado') {
       
        return res.status(400).json({ error: 'Transferência não autorizada.' });
      }
       console.log("autorizado fazer transferencia");
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Ocorreu um erro interno.' });
    }

/*
   // Verifica se a senha está correta
const user = await UserModel.findByEmail(remetenteExists.email);
const passwordMatch = await bcrypt.compare(senha, user.senha);
if (!passwordMatch) {
  return res.status(401).json({ error: 'Senha incorreta.' });
}
*/

// Cria a transação
const transacao = new TransacaoModel(null, remetente, destinatario, valor, new Date().toISOString());
try {
  await transacao.constructor.createTable();
  await transacao.constructor.create(transacao);
  return res.status(201).json({ message: 'Transferência realizada com sucesso.' });
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Ocorreu um erro interno.' });
}
}
}

module.exports = { UserController, TransacaoController };
