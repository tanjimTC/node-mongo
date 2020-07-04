const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 4200;

app.use(cors());
app.use(bodyParser.json());

app.get("/fruits", (req, res) => {
  const fruit = {
    product: "adar bepari",
    price: 100,
  };
  res.send(fruit);
});

const uri = process.env.DB_PATH;

const users = ["Tanjim", "Salma", "Tithi", "Swaliha", "Nayeem", "Noushin"];
let client = new MongoClient(uri, { useNewUrlParser: true });

app.get("/products", (req, res) => {
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection
      .find()
      .toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents);
        }
      });
    client.close();
  });
});

app.get("/users/:id", (req, res) => {
  const userId = req.params.id;
  const name = users[userId];
  console.log(userId, name);
  res.send({ userId, name });
});

///post
app.post("/addProduct", (req, res) => {
  const product = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection.insert(product, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
      } else {
        res.send(result.ops[0]);
      }
    });
    client.close();
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
