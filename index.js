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

// 회원가입을 위한 route
app.post("/register", (req, res) => {
  // 회원가입 할때 필요한 정보들을  client에서 가져오면
  // 그것들을 데이터베이스에 넣어준다

  const user = new User(req.body);
  //mongoDB method
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true }); //status(200):success
  });
});

app.listen(port, () => console.log(`example  app listening on port${port}`));
