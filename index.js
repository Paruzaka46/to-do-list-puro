import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;
const todoArrWork = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});

const Item = mongoose.model("Item", itemsSchema);
const Work = mongoose.model("Work", itemsSchema);

const item1 = new Work({
  name: "Do coding",
});

const item2 = new Work({
  name: "Eat",
});

const item3 = new Work({
  name: "Sleep",
});

const arr = [item1, item2, item3];

// try {
//   Work.insertMany(arr);
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
  Work.find({})
    .then(function (foundItems) {
      console.log(foundItems);
      res.render("work.ejs", {
        addTodo: foundItems,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});
// res.render("work.ejs", {
//   addTodoWork: todoArrWork,
// });;

app.post("/", (req, res) => {
  // todoArr.push(req.body["new"]);
  const userInput = req.body.new;
  console.log(userInput);

  const savetoDB = new Item({
    name: userInput,
  });

  savetoDB.save();

  res.redirect("/");

  // res.render("index.ejs", {
  //   addTodo: foundItems,
  //   today: day[new Date().getDay()],
  //   month: month[new Date().getMonth()],
  // });
});

app.post("/delete", (req, res) => {
  console.log(req.body.checkbox);
  Item.deleteOne({ _id: req.body.checkbox })
    .then(() => {
      console.log("Delete Succesfully");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

app.post("/work", (req, res) => {
  const workTodo = req.body.new;
  const savetoDB = new Work({
    name: workTodo,
  });
  savetoDB.save();
  res.redirect("/work");
  // todoArrWork.push(req.body["new"]);
  // console.log(todoArrWork);
  // res.render("work.ejs", {
  //   addTodoWork: todoArrWork,
  // });
});

app.post("/deletework", (req, res) => {
  console.log(req.body.checkbox);
  Work.deleteOne({ _id: req.body.checkbox })
    .then(() => {
      console.log("Delete Succesfully");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/work");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
