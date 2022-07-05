const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require("./models/User");

// application/x-www-form-urlencoded 된 데이터를 가져올 수 있게 해줌
app.use(bodyParser.urlencoded({extended: true}));

// application/json 데이터를 분석해서 가져올 수 있게 해줌
app.use(bodyParser.json());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
  useNewUrlParser : true, useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))



app.get('/', (req, res) => {
  res.send('Hello World! 안녕!!ㅎㅎ')
})


app.post('/register', (req, res)=>{
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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})