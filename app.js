const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://mmrabbi625442:mongo123@cluster0.lpqnnvm.mongodb.net/toDoListDB"
  )
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const listSchema = new mongoose.Schema({
  item: "string",
});

const Item = mongoose.model("item", listSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    let items = await Item.find({});
    if (items.length === 0) {
      items = [
        {
          item: "Welcome to your To Do List",
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
    const savedItem = await new Item({ item: req.body.item }).save();
    res.status(200).send(savedItem);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    await Item.deleteOne({ _id: checkedItemId });
    res.status(200).send("deleted");
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(5000, () => {
  console.log("listening on *:5000");
});
