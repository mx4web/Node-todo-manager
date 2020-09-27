const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { userOneId, userOne, setupDatabase } = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
    const response = await request(app)
        .post("/users")
        .send({
            name: "michelle",
            email: "michelle@test.com",
            password: "michelle@123",
        })
        .expect(201);

    // assert the database was changed correctly
    const user = await User.findById(response.body._id);
    expect(user).not.toBeNull();

    //assertions about the response
    expect(response.body).toMatchObject({
        name: "michelle",
        email: "michelle@test.com",
    });

    expect(user.password).not.toBe("michelle@123");
});

test("Should login existing user", async () => {
    const response = await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);

    await User.findOne({ _id: userOne._id, token: userOne.tokens[0].token });
    expect(user).not.toBeNull();
});

test("Should not login non-existing user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: "userOne@123",
        })
        .expect(400);
});

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);
});

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
        .get("/users/me")
        .send()
        .expect(401);
});

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/profile")
        .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
        .attach("avatar", "tests/fixtures/panda-bear.jpg")
        .expect(200);
    const user = User.findById(userOne._id);
    //assert user's avatr is Buffer type
    expect(user.avatar).toEqual(expect.any(Buffer));
});
