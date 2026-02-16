const express = require("express")
const { getIO } = require("../sockect");
const Transaction = require("../MODEL/transactionmodel");
const User= require("../MODEL/usermodel");






const getMe = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

const getBalance = (req, res) => {
  res.status(200).json({
    success: true,
    balance: req.user.balance
  });
};




const transferMoney = async (req, res) => {
  try {
    const { receiverAccountNumber, amount } = req.body;
    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const sender = await User.findById(req.user._id); 
    const receiver = await User.findOne({ accountNumber: receiverAccountNumber });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (sender.balance < transferAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const senderBefore = sender.balance;
    const receiverBefore = receiver.balance;

    await User.updateOne(
      { _id: sender._id },
      { $inc: { balance: -transferAmount } }
    );

    await User.updateOne(
      { _id: receiver._id },
      { $inc: { balance: transferAmount } }
    );

    await Transaction.insertMany([
      {
        user: sender._id,
        type: "transfer-out",
        amount: transferAmount,
        receiverAccountNumber,
        balanceBefore: senderBefore,
        balanceAfter: senderBefore - transferAmount,
      },
      {
        user: receiver._id,
        type: "transfer-in",
        amount: transferAmount,
        receiverAccountNumber: sender.accountNumber,
        balanceBefore: receiverBefore,
        balanceAfter: receiverBefore + transferAmount,
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Transfer successful",
      newBalance: senderBefore - transferAmount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


















const getHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await Transaction.find({
      user: userId   
    })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};




const depositeMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ message: "Enter valid amount" });
    }

    const user = await User.findById(req.user._id);

    const before = user.balance;

    user.balance += numAmount;

    await user.save();

    await Transaction.create({
      user: user._id,
      type: "deposit",
      amount: numAmount,
      balanceBefore: before,
      balanceAfter: user.balance,
    });

    res.json({
      success: true,
     newBalance: user.balance,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const withdrawMoney = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = Number(amount);

    const user = await User.findById(req.user._id);

    if (user.balance < numAmount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const before = user.balance;

    user.balance -= numAmount;

    await user.save();

    await Transaction.create({
      user: user._id,
      type: "withdraw",
      amount: numAmount,
      balanceBefore: before,
      balanceAfter: user.balance,
    });

    res.json({
      success: true,
 newBalance: user.balance,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {getMe, getBalance, transferMoney, getHistory,  depositeMoney, withdrawMoney, getUserProfile

}