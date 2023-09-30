import express from "express";
import mongoose from "mongoose";
import ejs from "ejs"

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");

const itemsSchema = new mongoose.Schema({
  name: String,
});
const listSchema = new mongoose.Schema({
  name: String,
  list: [itemsSchema],
});

const Item = mongoose.model("Item", itemsSchema);
const Work = mongoose.model("Work", itemsSchema);
const List = mongoose.model("List", listSchema);

const item1 = new Work({
  name: "Welcome to My Todo List!",
});

const item2 = new Work({
  name: "Hit the + button add new item.",
});

const item3 = new Work({
  name: "<--- Hit the checkbox to delete item.",
});

const defaultItems = [item1, item2, item3];

// try {
//   Work.insertMany(defaultItems);
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
        listTitle: "Today",
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

app.get("/:customList", (req, res) => {
  const listName = req.params.customList;
  List.findOne({ name: listName })
    .then((found) => {
      if (found) {
        // Show the exist database
        console.log(found.list);
        res.render("index.ejs", {
          listTitle: found.name,
          addTodo: found.list,
        });
      } else {
        // Create new database directory
        console.log("list doesn't exist");
        const newTodo = new List({
          name: listName,
          list: defaultItems,
        });

        newTodo.save();
        res.redirect(`/${listName}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // List.find({ name: listName })
  //   .then((foundItems) => {
  //     console.log(foundItems.list);
  //     res.render("index.ejs", {
  //       listTitle: listName,
  //       addTodo: foundItems,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

app.post("/", (req, res) => {
  const userInput = req.body.new;
  console.log(userInput);

  const savetoDB = new Item({
    name: userInput,
  });

  savetoDB.save();

  res.redirect("/");
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

app.post("/:customList", (req, res) => {
  const listName = req.params.customList;
  const newTodo = req.body.new;

  const savetoDB = new Item({
    name: newTodo,
  });
  
  // List.find({name: listName})
  // .then((foundList) => {
  //   foundList.list.push(savetoDB)
  //   foundList.save()
  // })
  // .catch(err => {
  //   console.log(err)
  // })
  List.updateOne({ name: listName }, { $push: { list: savetoDB } })
    .then(() => {
      console.log("Insert succesfully");
      res.redirect(`/${listName}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
