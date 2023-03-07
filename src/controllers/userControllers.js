const bcrypt = require('bcrypt');
const  UserModel  = require('../models/models');

const saltRounds = 10;

class UserController {
    static async cadastrar(req, res) {
      const { nome, cpf_cnpj, email, senha } = req.body;
     
      // Verifica se todos os campos são obrigatórios
      if (!nome || !cpf_cnpj || !email || !senha) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
      }
  
      // Verifica se o CPF/CNPJ já está em uso
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

  module.exports = UserController;
  