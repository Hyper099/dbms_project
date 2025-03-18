require("dotenv").config();
const { Router } = require("express");
const Razorpay = require("razorpay");
const connectDatabase = require("../Database/database");
const { studentAuth } = require("../Middleware/authMiddleware");

const paymentRouter = Router();

const razorpay = new Razorpay({
   key_id: process.env.RAZORPAY_KEY_ID,
   key_secret: process.env.RAZORPAY_KEY_SECRET
});

paymentRouter.post("/create-order", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      // Fetch cart items along with course prices
      const [cartItems] = await db.execute(`
         SELECT C.course_id, CO.price 
         FROM CART C 
         JOIN COURSES CO ON C.course_id = CO.id 
         WHERE C.student_id = ?`,
         [studentId]
      );

      if (cartItems.length === 0) {
         return res.status(404).json({ error: "No items in cart." });
      }

      // console.log("Cart Items Retrieved:", cartItems); // Debugging

      const totalAmount = cartItems.reduce((total, item) => {
         const price = parseFloat(item.price); // Convert string price to number
         if (isNaN(price)) {
            console.error("Invalid price detected in cart item:", item);
            return total; // Skip invalid items
         }
         return total + price;
      }, 0);

      // console.log("Total Amount Calculated:", totalAmount); // Debugging

      if (!totalAmount || totalAmount <= 0) {
         return res.status(400).json({ error: "Invalid total amount calculated from cart items." });
      }

      const options = {
         amount: Math.round(totalAmount * 100), // Convert to paise
         currency: "INR",
         receipt: `order_${Date.now()}`,
         notes: {
            courseIds: cartItems.map((item) => item.course_id)
         }
      };

      console.log("Razorpay Order Options:", options); // Debugging

      const order = await razorpay.orders.create(options);
      res.status(200).json(order);
   } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create order." });
   }
});



// Verify Payment
paymentRouter.post("/verify-payment", studentAuth, async (req, res) => {
   const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount } = req.body;
   const studentId = req.student.id;

   try {
      const db = await connectDatabase();
      // Fetch courses from cart
      const [cartItems] = await db.execute("SELECT course_id FROM CART WHERE student_id = ?", [studentId]);
      if (cartItems.length === 0) {
         return res.status(400).json({ error: "No courses found in cart!" });
      }

      // Store payment details
      await db.execute("INSERT INTO PAYMENT (id, student_id, amount, status, transaction_id) VALUES (?, ?, ?, ?, ?)",
         [razorpay_payment_id, studentId, amount, "Success", razorpay_order_id]);

      // Insert each course into TRANSACTION_COURSES and ENROLLMENT
      const enrollmentPromises = cartItems.map(async (item) => {
         await db.execute("INSERT INTO TRANSACTION_COURSES (transaction_id, student_id, course_id) VALUES (?, ?, ?)",
            [razorpay_payment_id, studentId, item.course_id]);

         const [courseResult] = await db.execute("SELECT access_period FROM COURSES WHERE id = ?", [item.course_id]);

         const accessPeriod = courseResult[0].access_period || 0;
         const enrollmentDate = new Date().toISOString().split('T')[0];
         const expiryDate = new Date();
         expiryDate.setDate(expiryDate.getDate() + accessPeriod);

         const [result] = await db.execute(
            "INSERT INTO ENROLLMENT (Student_id, Course_id, Enrollment_date, Start_date, Expiry_date, Status) VALUES (?, ?, ?, ?, ?, 'Active')",
            [studentId, item.course_id, enrollmentDate, enrollmentDate, expiryDate.toISOString().split('T')[0]]
         );
      });
      await Promise.all(enrollmentPromises);

      // Clear the cart
      await db.execute("DELETE FROM CART WHERE student_id = ?", [studentId]);

      res.json({ message: "Payment successful! You are enrolled in the courses." });
   } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "Error processing payment." });
   }
});

module.exports = paymentRouter;
