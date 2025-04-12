const { Router } = require("express");
const connectDatabase = require("../Database/database");
const { studentAuth } = require("../Middleware/authMiddleware");
const { isCourseExist, isCourseInCart, isStudentEnrolled } = require("../Services/cartService");

const cartRouter = Router();

// Middleware to check student authentication
cartRouter.use(studentAuth);

//! ADD COURSE TO CART
cartRouter.post("/", async (req, res) => {
   try {
      const studentId = req.student.id;
      const { courseId } = req.body;

      if (!courseId) return res.status(400).json({ error: "Course ID is required" });

      const db = await connectDatabase();

      if (!(await isCourseExist(db,courseId))) {
         return res.status(404).json({ error: "Course not found" });
      }

      if (await isStudentEnrolled(db,studentId, courseId)) {
         return res.status(409).json({ error: "Already enrolled in this course" });
      }

      if (await isCourseInCart(db,studentId, courseId)) {
         return res.status(409).json({ error: "Course already in cart" });
      }

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

      const [cartItems] = await db.execute(
         `
      SELECT 
        c.id,
        cd.title,
        cd.price,
        cat.name AS category
      FROM CART ca
      JOIN COURSES c ON ca.course_id = c.id
      JOIN COURSE_DETAILS cd ON c.id = cd.course_id
      LEFT JOIN CATEGORIES cat ON cd.category_id = cat.id
      WHERE ca.student_id = ?
      `,
         [studentId]
      );

      const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price), 0);

      res.status(200).json({
         cartItems,
         totalPrice
      });

   } catch (error) {
      console.error("Error fetching cart courses:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});


//! REMOVE COURSE FROM CART
cartRouter.delete("/", async (req, res) => {
   try {
      const studentId = req.student.id;
      const { courseId } = req.body;

      if (!courseId) return res.status(400).json({ error: "Course ID is required" });

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

//! GET THE COUNT OF THE ITEMS IN THE CART.
cartRouter.get("/count", async (req, res) => {
   try {
      const studentId = req.student.id;
      const db = await connectDatabase();

      const [result] = await db.execute(
         "SELECT COUNT(*) AS count FROM CART WHERE student_id = ?",
         [studentId]
      );

      res.status(200).json({ count: result[0].count });

   } catch (error) {
      console.error("Error fetching cart count:", error);
      res.status(500).json({ error: "Internal server error" });
   }
});

module.exports = cartRouter;
