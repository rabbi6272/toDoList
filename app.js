const express = require("express");
const app = express();

const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

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
  name: "string",
});

const Item = mongoose.model("item", listSchema);

// Routes
app.get("/", async (req, res) => {
  try {
    let items = await Item.find({});
    if (items.length === 0) {
      items = [
        {
          name: "Welcome to your To Do List",
        },
      ];
    }
    res.render("home", { items: items });
  } catch (err) {
    res.send(err);
  }
});

app.post("/", async (req, res) => {
  try {
    const item = req.body.item;
    await new Item({ name: item }).save();
    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.post("/delete", async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    await Item.deleteOne({ _id: checkedItemId });
    res.redirect("/");
  } catch (err) {
    res.send(err);
  }
});

app.listen(3000, () => {
  console.log("listening on *:3000");
});
