const { Router } = require("express");
const jwt = require("jsonwebtoken");
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
      const hashedPassword = await bcrypt.hash(password, 10);
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
         [email, hashedPassword, firstName, lastName]
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
      const [results] = await db.execute("SELECT firstName FROM INSTRUCTOR WHERE id = ?", [req.instructor.id]);

      if (results.length === 0) {
         return res.status(404).json({ error: "Instructor not found" });
      }

      res.json({ firstName: results[0].firstName });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});

// Get Instructor Courses
instructorRouter.get("/course", instructorAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const [courses] = await db.execute("SELECT * FROM COURSES WHERE instructor_id = ?", [req.instructor.id]);

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