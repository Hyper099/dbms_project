require("dotenv").config();
const cors = require("cors");
const express = require("express");
const studentRouter = require("./Routes/student");
const instructorRouter = require("./Routes/instructor");
const courseRouter = require("./Routes/course");
const authRouter = require("./Routes/auth");
const paymentRouter = require("./Routes/payment");
const cartRouter = require("./Routes/cart");

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

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
