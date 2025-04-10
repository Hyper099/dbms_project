const { Router } = require("express");
const connectDatabase = require("../Database/database");
const { studentAuth } = require("../Middleware/authMiddleware");

const cartRouter = Router();

// Middleware to check if user is authenticated as a student.
cartRouter.use(studentAuth);

//! ADD COURSE TO CART
cartRouter.post("/", async (req, res) => {
   try {
      const studentId = req.student.id;
      const { courseId } = req.body;

      if (!courseId) {
         return res.status(400).json({ error: "Course ID is required" });
      }

      const db = await connectDatabase();

      // Check if the student is already enrolled in the course
      const [enrolled] = await db.execute(
         "SELECT 1 FROM ENROLLMENT WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );
      if (enrolled.length > 0) {
         return res.status(409).json({ error: "Already enrolled in this course" });
      }

      // Check if the course is already in the cart
      const [cart] = await db.execute(
         "SELECT 1 FROM CART WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );
      if (cart.length > 0) {
         return res.status(409).json({ error: "Course already in cart" });
      }

      // Add the course to the cart
      await db.execute(
         "INSERT INTO CART (student_id, course_id) VALUES (?, ?)",
         [studentId, courseId]
      );

      res.status(201).json({ message: "Course added to cart" });

   } catch (error) {
      console.error("Error adding course to cart:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

//! GET COURSES FROM CART
cartRouter.get("/", async (req, res) => {
   try {
      const studentId = req.student.id;
      const db = await connectDatabase();

      const [courses] = await db.execute(
         `SELECT c.id, c.title, c.price 
          FROM CART ca
          JOIN COURSES c ON ca.course_id = c.id
          WHERE ca.student_id = ?`,
         [studentId]
      );

      res.status(200).json(courses);

   } catch (error) {
      console.error("Error fetching cart courses:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

//! DELETE COURSE FROM CART
cartRouter.delete("/", async (req, res) => {
   try {
      const studentId = req.student.id;
      const { courseId } = req.body;

      if (!courseId) {
         return res.status(400).json({ error: "Course ID is required" });
      }

      const db = await connectDatabase();
      const [result] = await db.execute(
         "DELETE FROM CART WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );

      if (result.affectedRows === 0) {
         return res.status(404).json({ error: "Course not found in cart" });
      }

      res.status(200).json({ message: "Course removed from cart" });

   } catch (error) {
      console.error("Error removing course from cart:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

module.exports = cartRouter;
