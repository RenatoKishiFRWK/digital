const express = require('express');
const { UserController, TransacaoController } = require('../controllers/controllers');

const router = express.Router();

router.get('/test', (req, res) => {
    res.send('Test route 2!');
  });
  
// Rotas para o usuário
router.post('/usuarios', UserController.cadastrar);

// Rotas para a transação
router.post('/transacoes', TransacaoController.transferir);

module.exports = router;
