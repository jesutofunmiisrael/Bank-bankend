const dotenv = require("dotenv")
dotenv.config()



const express = require("express")
const app = express()

const connectToDb = require("./config/ConnectToDb")
const cors = require("cors")
app.use(express.json())

const authrouter = require("./ROUTER/authrouter")
const bankrouter = require("./ROUTER/bankrouter")



const PORT = 4007
app.use(cors());
app.get("/", (req, res) =>{
    
})
app.use("/api/auth", authrouter)
app.use("/me", bankrouter )

connectToDb()

app.listen(PORT,() =>{
    console.log(`sever running on port ${PORT} ✅✅✅`);
    
})




// baseUrl:http://localhost:4007/


// const dotenv = require("dotenv");
// dotenv.config();

// const express = require("express");
// const cors = require("cors");
// const http = require("http");

// const connectToDb = require("./config/ConnectToDb");

// const authrouter = require("./ROUTER/authrouter");
// const bankrouter = require("./ROUTER/bankrouter");

// const { initSocket } = require("./sockect"); 

// const PORT = 4007;

// const app = express();
// app.use(express.json());
// app.use(cors());

// app.get("/", (req, res) => {
//   res.send("API running...");
// });

// app.use("/api/auth", authrouter);
// app.use("/me", bankrouter);

// connectToDb();

// // create HTTP server from Express
// const server = http.createServer(app);

// // initialize socket.io
// initSocket(server);

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT} ✅✅✅`);
// });
