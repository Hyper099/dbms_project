require("dotenv").config();
const { Router } = require("express");
const Razorpay = require("razorpay");
const db = require("../Database/database");
const { studentAuth } = require("../Middleware/authMiddleware");

const paymentRouter = Router();

const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET
});

paymentRouter.post("/create-order", studentAuth, (req, res) => {
   const studentId = req.student.id;  // fetched from token
   const { courseId, amount } = req.body; // will pass in frontend.

   db.query(
      "SELECT * FROM ENROLLMENT WHERE student_id = ? AND course_id = ?", [studentId, courseId], (err, result) => {

         if (err) {
            console.error("Error checking enrollment:", err);
            return res.status(500).json({ error: "Internal server error." });
         }

         if (result.length > 0) {
            return res.status(400).json({ error: "You are already enrolled in this course." });
         }

         // If not enrolled, proceed with payment
         const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `order_rcptid_${studentId}_${courseId}`,
         };

         razorpay.orders.create(options, (err, order) => {
            if (err) {
               console.error("Error creating Razorpay order:", err);
               return res.status(500).json({ error: "Failed to create order." });
            }

            res.status(200).json(order);
         });
      });
});


// Verify Payment
paymentRouter.post("/verify-payment", async (req, res) => {
   const { razorpay_payment_id, amount } = req.body;

   db.query(
      "INSERT INTO PAYMENT(id,amount,status) VALUES (?,?,?)", [razorpay_payment_id, amount, "Success"], (err, result) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error." });
         }
         console.log("Payment successful!");
         res.json({ message: "Payment successful!" });
      }
   );
});

module.exports = paymentRouter;