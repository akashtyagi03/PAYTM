//creating user routing structure.

const express = require('express');
const router = express.Router();
const {JWT_SECRET} = require('../config');
const jwt = require('jsonwebtoken');
const {signin, signup, updateuser} = require('../type');
const {User, Account} = require('../db');
const {auth} = require('../middleware');

// here we create user schema and validate it using zod.
router.post("/signup", async (req, res) => {
    const body = req.body;
    const {success} = signup.safeParse(req.body); // for validation of zod.
    if (!success) {
        return res.json({
            message: "Email already taken/Invalid user data",
        });
    }

    // here we check that user already exists or not.
    const user = await User.findOne({
        username: req.body.username
    })
    if(user) {
        return res.json({
            message: "Email already taken/Invalid user data"
        });
    }

    // here if user does not exists then we create user.
    const dbuser = await User.create({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
    })
    
    const userId = dbuser._id;
    // create account f const userId = user._id;or user. and give some random money
    await Account.create({
        userId,
        balance: 1 + Math.random()*10000, // initial balance for user
    });
    // and genrate jwt token for user.
    const token = jwt.sign({
        userId,
    }, JWT_SECRET)

    res.json({
        message: "User created successfully",
        token: token
    })
})

// here we create signin route for user.    
router.post("/signin", async(req, res)=>{
    const {success} = signin.safeParse(req.body); // for validation of zod.
    if (!success) {
        return res.json({
            message: "Invalid user data",
        });
    }
    // here we check that user exists or not.
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    }); 

    if(user){
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET);
        res.json({
            token: token,
        })
        return;
    }
    res.status(401).json({
        message: "Invalid credentials",
    });
})  

// here we create update user route.
router.put("/user", auth, async(req, res) => {
    const {success} = updateuser.safeParse(req.body); // for validation of zod.
    if (!success) {
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
router.get("/bulk", async (req, res) => {
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
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router; 