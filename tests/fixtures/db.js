const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Todo = require("../../src/models/todo");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "testUser1",
    email: "testuser1@test.com",
    password: "test1@123",
    tokens: [
        {
            token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET),
        },
    ],
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "testUser2",
    email: "testuser2@test.com",
    password: "test2@123",
    tokens: [
        {
            token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET),
        },
    ],
};

const todoOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "first todo",
    completed: false,
    owner: userOneId,
};

const todoTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "second todo",
    completed: true,
    owner: userOneId,
};

const todoThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "third todo",
    completed: false,
    owner: userTwoId,
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Todo.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Todo(todoOne).save();
    await new Todo(todoTwo).save();
    await new Todo(todoThree).save();
};

module.exports = { userOneId, userTwoId, userOne, userTwo, todoOne, todoTwo, todoThree, setupDatabase };
