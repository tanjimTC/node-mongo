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

app.get("/product/:key", (req, res) => {
  const key = req.params.key;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection
      .find({key})
      .toArray((err, documents) => {
        if (err) {
          console.log(err);
          res.status(500).send({ message: err });
        } else {
          res.send(documents[0]);
        }
      });
    client.close();
  });
});

app.post("/getProductByKey", (req, res) => {
  const key = req.params.key;
  const productKeys = req.body;
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("products");
    collection
      .find({key: { $in: productKeys }})
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

app.post("/placeOrder", (req, res) => {
  const orderDetail = req.body;
  orderDetail.orderTime = new Date();
  client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect((err) => {
    const collection = client.db("onlineStore").collection("orders");
    collection.insertOne(orderDetail, (err, result) => {
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
