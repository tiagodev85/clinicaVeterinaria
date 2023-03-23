const User = require('../models/User')
const bcrypt = require("bcrypt");


module.exports = {
  async registerUser(req,res) {
    const { name, email, password, confirmpassword } = req.body;
    //VALIDACOES
    if (!name) {
      return res.status(422).json({ msg: "O nome é obrigatório!" });
    }
    if (!email) {
      return res.status(422).json({ msg: "O email é obrigatório!" });
    }
    if (!password) {
      return res.status(422).json({ msg: "O password é obrigatório!" });
    }
    if (password !== confirmpassword) {
      return res.status(422).json({ msg: "As senhas não conferem!" });
    }  
    // CHECANDO SE O USUARIO EXISTE
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res
        .status(422)
        .json({ msg: "Email já utilizado! Por favor insira outro email." });
    }
    // CRIANDO A SENHA FORTE
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);
    // CRIANDO USUARIO
    const user = new User({
      name,
      email,
      password: passwordHash
    });
    // SALVANDO USUARIO NO BANCO
    try {
      await user.save();
      res.status(201).json({ msg: "Usuário criado com sucesso!" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Erro de servidor!" });
    }
  },

  async authLogin(req,res) {
    const { email, password } = req.body
  //VALIDACOES
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório!" });
  }
  // CHECANDO SE O USUARIO EXISTE
  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(404).json({ msg: "Usuário não encontrado!" });
  }
  //CHECANDO SE AS SENHAS COMBINAM
  const checkPassword = await bcrypt.compare(password, user.password)
  if(!checkPassword){
    return res.status(422).json({ msg: "Senha inválida!" })    
  }
  try {
    const secret = process.env.SECRET
    const token = jwt.sign({
      id: user._id
    }, secret)
    res.status(200).json({ msg: "Autenticação realizada com sucesso!", token })
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Erro de servidor!" });
  }
  },

  async privateRoute(req,res) {
    const id = req.params.id
    // CHECANDO USUARIO
    const user = await User.findById(id, '-password')
    if(!user){
      return res.status(404).json({ msg: "Usuário não encontrado!" })
    }
    res.status(200).json({ user })
  }
}


