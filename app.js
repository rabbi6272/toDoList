require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const listSchema = new mongoose.Schema({
  item: "string",
  completed: Boolean,
});

const Item = mongoose.model("item", listSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    let items = await Item.find({});
    if (items.length === 0) {
      items = [
        {
          _id: "1",
          item: "Welcome to your To Do List",
          completed: false,
        },
      ];
    }
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/", async (req, res) => {
  try {
    const savedItem = await new Item({
      item: req.body.item,
      completed: req.body.completed,
    }).save();
    res.status(200).send(savedItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/", async (req, res) => {
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.body.id },
      { completed: req.body.completed }
    );
    res.status(200).send(updatedItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/", async (req, res) => {
  try {
    const checkedItemId = req.body.id;
    await Item.deleteOne({ _id: checkedItemId });
    res.status(200).send("deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/reset", async (req, res) => {
  try {
    await Item.deleteMany({});
    res.status(200).send("deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});
app.listen(5000, () => {
  console.log("listening on *:5000");
});
