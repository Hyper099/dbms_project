require("dotenv").config();
const { Router } = require("express");
const bcrypt = require("bcrypt");
const connectDatabase = require("../Database/database");
const { SignUpSchema } = require("../Database/schema");
const { studentAuth } = require("../Middleware/authMiddleware");

const studentRouter = Router();

//! Signup Route
studentRouter.post("/signup", async (req, res) => {
   try {
      const db = await connectDatabase();

      // Validate request body
      const result = SignUpSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password, firstName, lastName } = result.data;
      // const hashedPassword = await bcrypt.hash(password, 10); //1234567.

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
         [email, password, firstName, lastName]
      );

      res.status(201).json({ message: "Student registered successfully." });

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error signing up the student" });
   }
});


//! Details of the Student.
studentRouter.get("/details", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const student = req.student;

      const [results] = await db.execute(
         "SELECT firstName,lastName FROM STUDENT WHERE id = ?", [student.id]
      );

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

//! Get the Courses student is enrolled in.
studentRouter.get("/course/enrolled", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      const [result] = await db.execute(
         `SELECT
            C.id,
            CD.id AS course_details_id,
            CD.title,
            CD.description,
            CD.price,
            CD.category_id,
            CD.access_period,
            CD.created_at,
            CD.duration,
            C.instructor_id,
            CD.total_lessons,
            E.completed_lessons
         FROM ENROLLMENT E
         JOIN COURSES C ON E.course_id = C.id
         JOIN COURSE_DETAILS CD ON CD.course_id = C.id
         WHERE E.student_id = ?`,
         [studentId]
      );

      if (result.length === 0) {
         return res.status(404).json({ message : "No courses found" });
      }

      res.json(result);

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
   }
});


//! Get stats of a student.
studentRouter.get("/stats", studentAuth, async (req, res) => {
   try {
      const db = await connectDatabase();
      const studentId = req.student.id;

      // Completed courses (certificate issued)
      const [completedCourses] = await db.execute(
         `SELECT COUNT(*) AS count
          FROM ENROLLMENT E
          JOIN CERTIFICATES C ON E.id = C.enrollment_id
          WHERE E.student_id = ?`,
         [studentId]
      );

      // Active courses (no certificate yet, lessons > 0)
      const [inProgressCourses] = await db.execute(
         `SELECT COUNT(*) AS count
          FROM ENROLLMENT E
          LEFT JOIN CERTIFICATES C ON E.id = C.enrollment_id
          WHERE E.student_id = ? AND C.enrollment_id IS NULL AND E.completed_lessons >= 0`,
         [studentId]
      );

      // Total certificates earned
      const [certificatesEarned] = await db.execute(
         `SELECT COUNT(*) AS count
          FROM CERTIFICATES
          WHERE enrollment_id IN (SELECT id FROM ENROLLMENT WHERE student_id = ?)`,
         [studentId]
      );

      res.json({
         completedCourses: completedCourses[0].count,
         inProgressCourses: inProgressCourses[0].count,
         certificatesEarned: certificatesEarned[0].count,
      });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Database error" });
   }
});


module.exports = studentRouter;
