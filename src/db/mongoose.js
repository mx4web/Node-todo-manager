const mongose = require("mongoose");

mongose.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
);
