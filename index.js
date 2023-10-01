require('dotenv').config()
import express from "express";
import mongoose from "mongoose";
import _ from "lodash";

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false)

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// mongoose.connect("mongodb://127.0.0.1:27017/todoListDB");
// mongoose.connect("mongodb+srv://admin-ray:Permainan48@cluster0.9wirdq7.mongodb.net/todoListDB");
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

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


//Opening 
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
  Item.find()
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

app.get("/:customList", (req, res) => {
  const listName = _.capitalize(req.params.customList);
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
  const listName = req.body.listName
  const idDelete = req.body.checkbox

  if (listName === "Today") {
    Item.deleteOne({ _id: req.body.checkbox })
    .then(() => {
      console.log("Delete Succesfully");
    })
    .catch((err) => {
      console.log(err);
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {list: {_id: idDelete}}})
    .then(() => {
      console.log("Delete Succesfully")
      res.redirect(`/${listName}`);
    })
    .catch(err => {
      console.log(err)
    })

  }
  
});

app.post("/:customList", (req, res) => {
  const listName = req.params.customList;
  const newTodo = req.body.new;

  const savetoDB = new Item({
    name: newTodo,
  });

  List.updateOne({ name: listName }, { $push: { list: savetoDB } })
    .then(() => {
      console.log("Insert succesfully");
      res.redirect(`/${listName}`);
    })
    .catch((err) => {
      console.log(err);
    });
});

connectDB().then(() => {
  app.listen(PORT, () => {
      console.log("listening for requests");
  })
})

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

const day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
