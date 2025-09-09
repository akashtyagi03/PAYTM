//creating user routing structure.
const express = require('express');
const Userrouter = express.Router();
const jwt = require('jsonwebtoken');
const {signin, signup, updateuser} = require('../type');
const {User, Account} = require('../db');
const {auth} = require('../middleware');

// here we create user schema and validate it using zod.
// also here we have to use bycrpt for password encryption but for now we are not using it.
Userrouter.post("/signup", async (req, res) => {
    const { firstname, lastname, email, password} = req.body;
    const validate = signup.safeParse(req.body); // for validation of zod.
    if (!validate.success) {
        console.log(validate.error);
        return res.json({
            message: "Invalid user data",
        });
    }

    // here we check that user already exists or not.
    try{
        const user = await User.findOne({ email })
        if(user) {
            return res.json({
                message: "Email already taken/ Invalid user data"
            });
        }
        // here if user does not exists then we create user.
        const dbuser = await User.create({
            firstname,
            lastname,
            email,
            password
        })
        
        const userId = dbuser._id;
        // create account f const userId = user._id;or user. and give some random money
        await Account.create({
            userId,
            balance: 1 + Math.random()*10000, // initial balance for user
        });
    }catch(err){
        console.error(err)
    }

    res.json({
        message: "User created successfully"
    })
})

// here we create signin route for user.    
// also here we have to use bycrpt for password encryption(campare) but for now we are not using it.
Userrouter.post("/signin", async(req, res)=>{
    const validate = signin.safeParse(req.body); // for validation of zod.
    if (!validate.success) {
        console.log(validate.error);
        return res.json({
            message: "Invalid user data",
        });
    }
    console.log("hii")
    try{
        // here we check that user exists or not.
        const user = await User.findOne({
            email: req.body.email,
            password: req.body.password
        }); 
        // if user exist then create jwt_token for user for future authentication.
        if(user){
            const token = jwt.sign({
                userId: user._id,
            }, JWT_SECRET_TOKEN);
            return res.json({ token })
        }
    } catch(err){
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
})  

// here we create update user route.
Userrouter.put("/user", auth, async(req, res) => {
    const validate = updateuser.safeParse(req.body); // for validation of zod.
    if (!validate.success) {
        console.log(validate.error)
        return res.json({
            message: "Invalid user data",
        });
    }

    // here we check that user exists or not.
    const user = await User.findOne({
        _id: req.userId
    });

    if(!user){
        return res.status(404).json({
            message: "User not found",
        });
    }

    // here we update user data.
    await User.updateOne({ _id: req.userId }, req.body);

    // ✅ Get updated data
    const updatedUser = await User.findOne({ _id: req.userId }).lean();

    res.json({
        message: "User updated successfully",
        user: updatedUser,
    });      
})

// here we filter out user by these query params.don't understand much!!
Userrouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstname,
            lastName: user.lastname,
            _id: user._id
        }))
    })
})

module.exports = Userrouter; 