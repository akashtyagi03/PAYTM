// creating accounts router. most intresting part of the project.
const expreess = require('express');
const Accountrouter = expreess.Router();
const {auth} = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

Accountrouter.get("/balance", auth, async(req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    })
    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        });
    }
    res.json({
        balance: account.balance
    });
})

Accountrouter.post("/transfer", auth, async (req, res) => {
    // we created session to handle transaction. All the operations inside the transaction will be treated as a single unit. it does all logic at once. 
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        // If the account does not exist or has insufficient balance, abort the transaction. and it will not perform any operation. it undone all the operations.
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        // If the account does not exist or has insufficient balance, abort the transaction. and it will not perform any operation. it undone all the operations.
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    // Perform the transfer. 
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction. Saves all changes if everything succeeded
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = Accountrouter;