const Express = require("express");
const BodyParser = require("body-parser");
const Speakeasy = require("speakeasy");

var app = Express();

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

app.post("/totp-secret", (req, res, next) => {
  var secret = Speakeasy.generateSecret({ length: 25 });
  res.send({ "secret": secret.base32 });
});

app.post("/totp-generate", (req, res, next) => {
  res.send({
    "token": Speakeasy.totp({
      secret: req.body.secret,
      encoding: "base32"
    }),
    "time-remaining": (30 - Math.floor((new Date().getTime() / 1000.0 % 30)))
  });
});

app.post("/totp-validate", (req, res, next) => {
  res.send({
    "valid": Speakeasy.totp.verify({
      secret: req.body.secret,
      encoding: "base32",
      token: req.body.token,
      window: 0
    })
  })
});

app.listen(4000, () => {
  console.log("Server running on port 4000!");
})

