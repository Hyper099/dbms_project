require("dotenv").config();
const { Router } = require("express");
const Razorpay = require("razorpay");
const connectDatabase = require("../Database/Database");
const { studentAuth } = require("../Middleware/authMiddleware");

const paymentRouter = Router();

const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET
});

//! CREATE ORDER
paymentRouter.post("/create-order", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      // Fetch cart with prices
      const [cartItems] = await db.execute(`
         SELECT C.course_id, CD.price 
         FROM CART C
         JOIN COURSE_DETAILS CD ON C.course_id = CD.course_id 
         WHERE C.student_id = ?`,
         [studentId]
      );

      if (!cartItems.length) {
         return res.status(404).json({ error: "Your cart is empty." });
      }

      // Total amount calculation
      const totalAmount = cartItems.reduce((sum, item) => {
         const price = parseFloat(item.price);
         return isNaN(price) ? sum : sum + price;
      }, 0);

      if (totalAmount <= 0) {
         return res.status(400).json({ error: "Invalid amount in cart." });
      }

      // Razorpay order config
      const options = {
         amount: Math.round(totalAmount * 100), // in paise
         currency: "INR",
         receipt: `order_${Date.now()}`,
         notes: {
            courseIds: cartItems.map(item => item.course_id).join(",")
         }
      };

      const order = await razorpay.orders.create(options);
      res.status(201).json(order);

   } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Could not create Razorpay order." });
   }
});

//! VERIFY PAYMENT & ENROLL
paymentRouter.post("/verify-payment", studentAuth, async (req, res) => {
   const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;
   const studentId = req.student.id;

   if (!razorpay_payment_id || !razorpay_order_id || !amount) {
      return res.status(400).json({ error: "Missing payment details." });
   }

   try {
      const db = await connectDatabase();

      const [cartItems] = await db.execute(
         "SELECT course_id FROM CART WHERE student_id = ?",
         [studentId]
      );

      if (!cartItems.length) {
         return res.status(400).json({ error: "Your cart is empty." });
      }

      // Store payment
      await db.execute(
         "INSERT INTO PAYMENT (id, student_id, amount, status, transaction_id) VALUES (?, ?, ?, ?, ?)",
         [razorpay_payment_id, studentId, amount, "Success", razorpay_order_id]
      );

      //! Enroll for each course
      const enrollments = cartItems.map(async ({ course_id }) => {
         await db.execute(
            "INSERT INTO TRANSACTION_COURSES (transaction_id, student_id, course_id) VALUES (?, ?, ?)",
            [razorpay_payment_id, studentId, course_id]
         );

         const [courseResult] = await db.execute(
            "SELECT access_period FROM COURSE_DETAILS WHERE course_id = ?",
            [course_id]
         );

         // Calculate enrollment and expiry dates
         const accessPeriod = courseResult[0]?.access_period || 0;
         const enrollmentDate = new Date().toISOString().split("T")[0];
         const expiryDate = new Date();
         expiryDate.setDate(expiryDate.getDate() + accessPeriod);

         // Insert new enrollment record
         const [result] = await db.execute(
            "INSERT INTO ENROLLMENT (student_id, course_id, enrollment_date, start_date, expiry_date) VALUES (?, ?, ?, ?, ?)",
            [studentId, course_id, enrollmentDate, enrollmentDate, expiryDate.toISOString().split("T")[0]]
         );
      });

      await Promise.all(enrollments);

      // Clear cart
      await db.execute("DELETE FROM CART WHERE student_id = ?", [studentId]);

      res.status(200).json({ message: "Payment verified and courses enrolled successfully." });

   } catch (error) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: "Payment verification failed." });
   }
});

module.exports = paymentRouter;
