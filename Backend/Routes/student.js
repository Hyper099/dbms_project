require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../Database/database");
const { SignUpSchema, LoginSchema } = require("../Database/Schema");
const { studentAuth } = require("../Middleware/authMiddleware");

const studentRouter = Router();

// Signup Route
// Signup Route
studentRouter.post("/signup", async (req, res) => {
   try {
      // Validate request body
      const result = SignUpSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password, firstName, lastName } = result.data;
      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if email exists in either STUDENT or INSTRUCTOR tables using a single query
      db.query(
         "SELECT email FROM STUDENT WHERE email = ? UNION SELECT email FROM INSTRUCTOR WHERE email = ?",
         [email, email],
         (err, results) => {
            if (err) {
               console.error(err);
               return res.status(500).json({ error: "Database error." });
            }

            if (results.length > 0) {
               return res.status(400).json({ error: "This email is already in use." });
            }

            // Now insert the student since email is not found in either table
            db.query(
               "INSERT INTO STUDENT (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
               [email, hashedPassword, firstName, lastName],
               (err) => {
                  if (err) {
                     return res.status(500).json({ error: "Database error." });
                  }

                  res.status(201).json({ message: "Student registered successfully." });
               }
            );
         }
      );
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error signing up the student" });
   }
});


// Signin Route
studentRouter.post("/signin", async (req, res) => {
   try {
      // Validate request body
      const result = LoginSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password } = result.data;

      db.query("SELECT * FROM STUDENT WHERE email = ?", [email], async (error, results) => {
         if (error) {
            console.error(error);
            return res.status(500).json({ message: "Database error." });
         }
         if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
         }

         const student = results[0];
         const isMatch = await bcrypt.compare(password, student.password);

         if (isMatch) {
            const token = jwt.sign({ id: student.id }, process.env.JWT_STUDENT_SECRET, { expiresIn: "1h" });
            return res.status(200).json({ token, message: "Login successful." });
         } else {
            return res.status(401).json({ message: "Invalid Credentials." });
         }
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error during login process." });
   }
});

studentRouter.get("/details", studentAuth, async (req, res) => {
   try {
      const student = req.student;

      db.query("SELECT firstName FROM STUDENT WHERE id = ?", [student.id], (error, results) => {
         if (error) {
            console.error(error);
            return res.status(500).json({ error: "Database error" });
         }

         if (results.length === 0) {
            return res.status(404).json({ error: "Student not found" });
         }

         res.json({ firstName: results[0].firstName });
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});



module.exports = studentRouter;
