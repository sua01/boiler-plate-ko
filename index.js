const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const {auth} = require('./middleware/auth')
const { User } = require("./models/User");

// application/x-www-form-urlencoded 된 데이터를 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

// application/json 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());
app.use(cookieParser());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser : true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕!!ㅎㅎ')
})


app.post('/api/users/register', (req, res)=>{

  // 회원 가입 할때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.

  const user = new User(req.body)
  user.save((err, userInfo) => {
    if(err) return res.json({ success: false, err}) // 에러났을 경우
    return res.status(200).json({ // 성공했을 경우
      success: true
    })
  }) // 몽고DB에서 오는 메소드
})


app.post('/api/users/login', (req, res) =>{
  
  // 요청된 이메일을 데이터베이스에서 있는지 찾기
  User.findOne({email: req.body.email}, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
  // 요청한 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인

    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})



      // 비밀번호까지 맞다면 토큰 생성하기
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        // 토큰을 저장하기 어디? 쿠키, 로컬 스토리지에서도 저장 가능 > 쿠키에 저장하기로 결정
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
  })
})


app.get('/api/users/auth',auth, (req, res) => {
  // 여기까지 미들웨어를 통과해왔다는 얘기는 Authentication이 True라는 말
  res.status(200).json({
    _id: req.user._id,  // 클라이언트한테 전달
    isAdmin: req.user.role ===0 ? false: true,  // role이 0이면 일반유저, 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.rol,
    image: req.user.image
  })
})

// 로그아웃
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({_id: req.user._id},
    {token: ""} // token 지우기
    ,(err, user) => {
      if(err) return res.json({ success: false, err});  // 에러난 경우
      return res.status(200).send({ // 성공한 경우
        success: true
      })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})