express = require("express");
const app = express();
const port = 5000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");

const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

// bodyparser: client에서 오는 정보를 서버에서 분석해서 가져올수있도록 하는 것

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.post("/api/users/register", (req, res) => {
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

// login route
app.post("/api/users/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인.
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });
      // 비밀번호까지 맞다면 토큰을 생성하기.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        // token을 저장한다.  어디에? 쿠키, 로컬스토리지, 세션스토리지... 여기서는 쿠키에!
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

//auth route
app.get("api/users/auth", auth, (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 얘기는 authentication이 true 라는말
  res.status(200).json({
    _id: req.user_id,
    isAdmin: req.user.role === 0 ? false : true, //? role이 0 -> 일반유저, role 0 이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.listen(port, () => console.log(`example  app listening on port${port}`));
