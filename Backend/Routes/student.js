require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const connectDatabase = require("../Database/database");
const { SignUpSchema, LoginSchema } = require("../Database/schema");
const { studentAuth } = require("../Middleware/authMiddleware");

const studentRouter = Router();

// Signup Route
studentRouter.post("/signup", async (req, res) => {
   try {
      const db = await connectDatabase();

      // Validate request body
      const result = SignUpSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password, firstName, lastName } = result.data;
      const hashedPassword = await bcrypt.hash(password, 10); //1234567.

      // Check if email exists
      const [existingUsers] = await db.execute(
         "SELECT email FROM STUDENT WHERE email = ? UNION SELECT email FROM INSTRUCTOR WHERE email = ?",
         [email, email]
      );

      if (existingUsers.length > 0) {
         return res.status(400).json({ error: "This email is already in use." });
      }

      // Insert new student
      await db.execute(
         "INSERT INTO STUDENT (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
         [email, hashedPassword, firstName, lastName]
      );

      res.status(201).json({ message: "Student registered successfully." });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error signing up the student" });
   }
});

// // Signin Route
// studentRouter.post("/signin", async (req, res) => {
//    try {
//       const db = await connectDatabase();

//       // Validate request body
//       const result = LoginSchema.safeParse(req.body);
//       if (!result.success) {
//          return res.status(400).json({ error: result.error.format() });
//       }

//       const { email, password } = result.data;

//       const [students] = await db.execute("SELECT * FROM STUDENT WHERE email = ?", [email]);

//       if (students.length === 0) {
//          return res.status(404).json({ message: "User not found." });
//       }

//       const student = students[0];
//       const isMatch = await bcrypt.compare(password, student.password);

//       if (isMatch) {
//          const token = jwt.sign({ id: student.id }, process.env.JWT_STUDENT_SECRET);
//          return res.status(200).json({ token, message: "Login successful." });
//       } else {
//          return res.status(401).json({ message: "Invalid Credentials." });
//       }
//    } catch (err) {
//       console.error(err);
//       res.status(500).json({ message: "Error during login process." });
//    }
// });

// Details of the Student.
studentRouter.get("/details", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const student = req.student;

      const [results] = await db.execute("SELECT firstName,lastName FROM STUDENT WHERE id = ?", [student.id]);

      if (results.length === 0) {
         return res.status(404).json({ error: "Student not found" });
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

// Get the Courses student is enrolled in.
studentRouter.get("/course/enrolled", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      const [result] = await db.execute(
         `SELECT
            C.id, C.title, C.description, C.category, C.price, 
            C.access_period, C.instructor_id, C.created_at,
            E.completed_lessons, E.total_lessons
         FROM ENROLLMENT E
         JOIN COURSES C ON E.course_id = C.id
         WHERE E.student_id = ?`,
         [studentId]
      );

      if (result.length === 0) {
         return res.status(404).json({ error: "No courses found" });
      }

      res.json(result);

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
   }
});

// Get stats of a student.
studentRouter.get("/stats", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      const [result] = await db.execute(
         `SELECT
            COUNT(CASE WHEN status = 'Completed' THEN 1 END) AS completedCourses,
            COUNT(CASE WHEN status = 'Active' THEN 1 END) AS inProgressCourses,
            COUNT(CASE WHEN certificate_earned = 1 THEN 1 END) AS certificatesEarned
         FROM ENROLLMENT WHERE student_id = ?`,
         [studentId]
      );

      res.json(result.length > 0 ? result[0] : {
         completedCourses: 0,
         inProgressCourses: 0,
         certificatesEarned: 0,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
   }
});

module.exports = studentRouter;
