require("dotenv").config();
const cors = require("cors");
const express = require("express");
const studentRouter = require("../Routes/student");
const instructorRouter = require("../Routes/instructor");
const courseRouter = require("../Routes/course");
const authRouter = require("../Routes/auth");
const paymentRouter = require("../Routes/payment");
const cartRouter = require("../Routes/cart");
const assignmentRouter = require("../Routes/assignment");
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes
app.use("/api/student", studentRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/course", courseRouter);
app.use("/api/auth", authRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/assignment", assignmentRouter);

//! not using this route right now.
// app.use("/api/assessment", assessmentRouter);


app.get("/", (req, res) => {
   res.json({message : "Welcome to EduConnect."})
})
// // Start Server
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`);
// });

module.exports = app
module.exports.handler = serverless(app);