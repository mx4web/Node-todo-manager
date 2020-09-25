const mongose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Todo = require("./todo");

const userSchema = new mongose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Email is invalid");
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 7,
            validate(value) {
                if (validator.contains(value, "password", { ignoreCase: false })) {
                    throw new Error("password can not contain password");
                }
            },
        },
        age: {
            type: Number,
            validate(value) {
                if (value < 0) {
                    throw new Error("age must be greater than 0");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
);

//setup virtual attributes which won't store in user document; it's for mangoose to figure out how these are related
userSchema.virtual("myTodos", {
    ref: "Todo",
    localField: "_id",
    foreignField: "owner",
});

userSchema.methods.toJSON = function() {
    const userObj = this.toObject();
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;

    return userObj;
};

//create instance method
//use regular function to bind this
userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
    this.tokens.push({ token });

    await this.save();
    return token;
};

//create model method
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
};

//document middleware, hash plain text pasword before saving
//uses regular callback function instead of arrow function as arrow function does not bind 'this'
userSchema.pre("save", async function(next) {
    const user = this;

    //only run if password was modified
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.pre("remove", async function(next) {
    await Todo.deleteMany({ owner: this._id });
    next();
});

const User = mongose.model("User", userSchema);

module.exports = User;
