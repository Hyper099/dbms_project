require("dotenv").config();
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../Database/database");

const authRouter = Router();

// Unified Login Route
authRouter.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         return res.status(400).json({ error: "Email and password are required." });
      }

      // Check Student Table
      db.query("SELECT * FROM STUDENT WHERE email = ?", [email], async (error, studentResults) => {
         if (error) return res.status(500).json({ message: "Database error." });

         if (studentResults.length > 0) {
            const student = studentResults[0];
            const isMatch = await bcrypt.compare(password, student.password);

            if (isMatch) {
               const token = jwt.sign({ id: student.id, role: "student" }, process.env.JWT_STUDENT_SECRET, { expiresIn: "1h" });
               return res.status(200).json({ token, role: "student", message: "Login successful." });
            }
         }

         // Check Instructor Table
         db.query("SELECT * FROM INSTRUCTOR WHERE email = ?", [email], async (error, instructorResults) => {
            if (error) return res.status(500).json({ message: "Database error." });

            if (instructorResults.length > 0) {
               const instructor = instructorResults[0];
               const isMatch = await bcrypt.compare(password, instructor.password);

               if (isMatch) {
                  const token = jwt.sign({ id: instructor.id, role: "instructor" }, process.env.JWT_INSTRUCTOR_SECRET, { expiresIn: "1h" });
                  return res.status(200).json({ token, role: "instructor", message: "Login successful." });
               }
            }

            return res.status(401).json({ message: "Invalid Credentials." });
         });
      });
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error during login process." });
   }
});

module.exports = authRouter;
