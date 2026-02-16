const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();

const connectToDb = require("./config/ConnectToDb");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authrouter = require("./ROUTER/authrouter");
const bankrouter = require("./ROUTER/bankrouter");

const PORT = process.env.PORT || 4007;

app.get("/", (req, res) => {
  res.send("Bank Backend is running 🚀");
});

app.use("/api/auth", authrouter);
app.use("/me", bankrouter);

connectToDb();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});
