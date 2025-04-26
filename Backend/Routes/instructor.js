const { Router } = require("express");
const bcrypt = require("bcrypt");
const connectDatabase = require("../Database/database");
const { SignUpSchema, LoginSchema } = require("../Database/schema");
const { instructorAuth } = require("../Middleware/authMiddleware");

const instructorRouter = Router();

// Signup Route
instructorRouter.post("/signup", async (req, res) => {
   try {
      const result = SignUpSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password, firstName, lastName } = result.data;
      // const hashedPassword = await bcrypt.hash(password, 10);
      const db = await connectDatabase();

      const [existingUsers] = await db.execute(
         "SELECT * FROM STUDENT WHERE email = ? UNION SELECT * FROM INSTRUCTOR WHERE email = ?",
         [email, email]
      );

      if (existingUsers.length > 0) {
         return res.status(409).json({ message: "Email is already being used." });
      }

      await db.execute(
         "INSERT INTO INSTRUCTOR (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
         [email, password, firstName, lastName]
      );

      res.status(201).json({ message: "Instructor Registered Successfully." });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error signing up the instructor." });
   }
});

// Get Instructor Details
instructorRouter.get("/details", instructorAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const [results] = await db.execute(
         "SELECT firstName, lastName FROM INSTRUCTOR WHERE id = ?",
         [req.instructor.id]
      );

      if (results.length === 0) {
         return res.status(404).json({ error: "Instructor not found" });
      }

      res.json({
         firstName: results[0].firstName,
         lastName: results[0].lastName,
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

// Get Instructor Courses (JOIN with COURSE_DETAILS)
instructorRouter.get("/course", instructorAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const instructorId = req.instructor.id;

      const [courses] = await db.execute(
         `SELECT
            CD.id AS course_details_id,
            CD.title,
            CD.description,
            CD.price,
            CD.category_id,
            CD.access_period,
            CD.duration,
            CD.created_at,
            C.id 
         FROM COURSES C
         JOIN COURSE_DETAILS CD ON CD.course_id = C.id
         WHERE C.instructor_id = ?`,
         [instructorId]
      );

      if (courses.length === 0) {
         return res.status(404).json({ error: "No courses found for the instructor" });
      }

      res.json(courses);
   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
   }
});

module.exports = instructorRouter;
