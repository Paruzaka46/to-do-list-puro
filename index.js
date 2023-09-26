import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const todoArr = [];
const todoArrWork = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Do coding",
});

const item2 = new Item({
  name: "Eat",
});

const item3 = new Item({
  name: "Sleep",
});

const arr = [item1, item2, item3];

// try {
//   Item.insertMany(arr);
//   console.log("Insert succesfully");
// } catch (error) {
//   console.log(error);
// }

app.get("/", (req, res) => {
  Item.find({})
    .then(function (foundItems) {
      console.log(foundItems);
      res.render("index.ejs", {
        addTodo: foundItems,
        today: day[new Date().getDay()],
        month: month[new Date().getMonth()],
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.get("/work", (req, res) => {
  res.render("work.ejs", {
    addTodoWork: todoArrWork,
  });
});

app.post("/", (req, res) => {
  todoArr.push(req.body["new"]);
  console.log(todoArr);
  res.render("index.ejs", {
    addTodo: todoArr,
    today: day[new Date().getDay()],
    month: month[new Date().getMonth()],
  });
});

app.post("/work", (req, res) => {
  todoArrWork.push(req.body["new"]);
  console.log(todoArrWork);
  res.render("work.ejs", {
    addTodoWork: todoArrWork,
  });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
