const express = require("express");
const auth = require("../middleware/auth");
const Todo = require("../models/todo");
const router = express.Router();

router.post("/todos", auth, async (req, res) => {
    const todo = new Todo({ ...req.body, owner: req.user._id });
    try {
        await todo.save();
        res.status(201).send(todo);
    } catch (e) {
        res.status(500).send(e);
    }
});

//GET /todos?completed=true
//GET /todos?limit=10&skip=20
router.get("/todos", auth, async (req, res) => {
    const match = {};

    if (req.query.completed) {
        match.completed = req.query.completed == "true";
    }

    try {
        // const todos = await Todo.find({ owner: req.user._id });
        await req.user
            .populate({
                path: "myTodos",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                },
            })
            .execPopulate();
        res.send(req.user.myTodos);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, owner: req.user._id });
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (e) {
        res.status(500).send();
    }
});

router.delete("/todos/:id", auth, async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (e) {
        res.status(500).send();
    }
});

module.exports = router;
