const router = require("express").Router();
const jwt = require("jsonwebtoken");
const UserController = require('../controllers/UserController')

// MODELS
const User = require("../models/User");

// ROTA PRIVADA
router.get("/user/:id", checkToken, UserController.privateRoute)
// FUNCAO PARA VERIFICAR O TOKEN
function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(" ")[1]
  if(!token){
    return res.status(401).json({ msg: "Acesso negado!" })
  }
  // VALIDANDO SE O TOKEN E CORRETO
  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret)
    next()
  } catch (err) {
    console.log(err)
    return res.status(400).json({ msg: "Token inválido!" })
  }
}
// ROTA PUBLICA
router.get("/", (req, res) => {
  return res.status(200).json({ msg: "Bem vindo a nossa API!" });
});
// ROTA REGISTER USER
router.post("/auth/register", UserController.registerUser);
// ROTA DE LOGIN
router.post('/auth/login', UserController.authLogin)

module.exports = router;
