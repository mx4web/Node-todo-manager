const request = require("supertest");
const app = require("../src/app");
const Todo = require("../src/models/todo");
const { userOneId, userOne, userTwo, todoOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create new todo for user", async () => {
    const response = await request(app)
        .post("/todos")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send({
            descriptoin: "setup test",
        })
        .expect(201);

    const todo = await Todo.findById(response.body._id);
    expect(todo).not.toBeNull();
    expect(todo.completed).toEqual(false);
});

test("Should fetch user todos", async () => {
    const response = await request(app)
        .get("/todos")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    expect(response.body.length).toBe(2);
});

test("Should not delete todos from other users", async () => {
    const response = await request(app)
        .delete(`/todos/${todoOne._id}`)
        .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404);

    //assert the todo is still in the database
    const todo = await Todo.findById(todoOne._id);
    expect(todo).not.toBeNull();
});
