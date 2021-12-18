express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const config = require("./config/key");

const { User } = require("./models/User");

// bodyparser: client에서 오는 정보를 서버에서 분석해서 가져올수있도록 하는 것

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// application/json
app.use(bodyParser.json());

const mongoose = require("mongoose");
// const URI =
//   "mongodb+srv://yugang60:dkssud123!@yugang.4k9ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("mongoDB connected..."))
  .catch((e) => console.log("mongoDB error:", e));

app.get("/", (req, res) => res.send("Helloworld haha"));

// register route
app.post("/register", (req, res) => {
  // 회원가입 할때 필요한 정보들을  client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다
  const user = new User(req.body); // 모든 정보들을 모델에 넣어줌
  //save 하기 전에 암호화
  //mongoDB method
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true }); //status(200):success
  });
});

//login route
app.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {});
  });

  // 비밀번호까지 있다면 토큰을 생성하기.
});

app.listen(port, () => console.log(`example  app listening on port${port}`));
