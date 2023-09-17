import express from "express";

const app = express();
const port = 3000;
const todoArr = [];
const todoArrWork = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", {
    addTodo: todoArr,
    today: day[new Date().getDay()],
    month: month[new Date().getMonth()],
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
