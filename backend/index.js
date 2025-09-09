// here we are creating routing structure.
// added few dependencies and created a basic express server.
require('dotenv').config();
const express = require('express');
const core = require("cors");
const app = express();
const Userrouter = require('./router/user');
const Accountrouter = require('./router/account');
const mongoose = require('mongoose');

app.use(core());
app.use(express.json());

app.use('/api/vi/user', Userrouter);
app.use('/api/vi/account', Accountrouter);

function main(){
    mongoose.connect(process.env.MONGODB_URL)
    app.listen(3000);
    console.log("listening on port 3000");
}

main()


// /api/vi/user/signup
// /api/vi/user/signin
// /api/vi/user/changepassword ...

// /api/vi/account/transferMoney
// /api/vi/account/balance