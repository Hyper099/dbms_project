const { Router } = require("express");
const connectDatabase = require("../Database/database");
const { studentAuth } = require("../Middleware/authMiddleware");

const cartRouter = Router();

// Middleware to check if user is authenticated as a student.
cartRouter.use(studentAuth);

//! ADD COURSE TO CART.
cartRouter.post("/", async (req, res) => {
   const studentId = req.student.id;
   const { courseId } = req.body;

   const db = await connectDatabase();

   try {
      // Check if the student is already enrolled in the course
      const [enrollmentResult] = await db.execute(
         "SELECT * FROM ENROLLMENT WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );

      if (enrollmentResult.length > 0) {
         return res.status(400).json({ message: "Course already enrolled" });
      }

      // Check if the course is already in the cart
      const [cartResult] = await db.execute(
         "SELECT * FROM CART WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );

      if (cartResult.length > 0) {
         return res.status(400).json({ message: "Course already in cart" });
      }

      // Add the course to the cart
      await db.execute(
         "INSERT INTO CART(student_id, course_id) VALUES (?, ?)",
         [studentId, courseId]
      );

      res.json({ message: "Course added to cart successfully" });

   } catch (error) {
      console.error("Error while adding course to cart:", error);
      res.status(500).json({ error: "Failed to add course to cart." });
   }
});

//! GET COURSES FROM CART.
cartRouter.get("/", async (req, res) => {
   const studentId = req.student.id;
   const db = await connectDatabase();
   try {
      const [results] = await db.execute(
         `SELECT c.id, c.title, c.price 
          FROM CART as ca
          JOIN COURSES as c
          ON ca.course_id = c.id
          WHERE ca.student_id = ?`,
         [studentId]
      );

      res.json(results); //? sending id,price,title.
   } catch (error) {
      console.error("Error while fetching courses from cart:", error);
      res.status(500).json({ error: "Failed to fetch courses from cart." });
   }
});

//! DELETE COURSE FROM CART.
cartRouter.delete("/", async (req, res) => {
   const studentId = req.student.id;
   const { courseId } = req.body;

   const db = await connectDatabase();

   try {
      const [result] = await db.execute(
         "DELETE FROM CART WHERE student_id = ? AND course_id = ?",
         [studentId, courseId]
      );

      if (result.affectedRows === 0) {
         return res.status(404).json({ message: "Course not found in cart" });
      }

      res.json({ message: "Course deleted from cart successfully" });

   } catch (error) {
      console.error("Error while deleting course from cart:", error);
      res.status(500).json({ error: "Failed to delete course from cart." });
   }
});

module.exports = cartRouter;
