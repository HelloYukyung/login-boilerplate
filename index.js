express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
const URI =
  "mongodb+srv://yugang60:dkssud123!@yugang.4k9ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(URI)
  .then(() => console.log("mongoDB connected..."))
  .catch((e) => console.log("mongoDB error:", e));

app.get("/", (req, res) => res.send("Helloworld"));

app.listen(port, () => console.log(`example  app listening on port${port}`));
