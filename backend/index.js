// here we are creating routing structure.
// added few dependencies and created a basic express server.

const express = require('express');
const core = require("cors");
const app = express();

app.use(core());
app.use(express.json());
const mainrouter = require('./router/index');

app.use('/api/vi', mainrouter);


app.listen(3000);


// /api/vi/user/signup
// /api/vi/user/signin
// /api/vi/user/changepassword ...

// /api/vi/account/transferMoney
// /api/vi/account/balance