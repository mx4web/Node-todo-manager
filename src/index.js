const express = require("express");
require("./db/mongoose"); //connect database
const userRouter = require("./routers/user");
const todoRouter = require("./routers/todo");
const app = express();
const port = process.env.PORT;

//automatically parse incoming json to an object
app.use(express.json());
//register router
app.use(userRouter);
app.use(todoRouter);

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
