const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../Database/database");
const { SignUpSchema, LoginSchema } = require("../Database/Schema");
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
      db.query(
         "SELECT * FROM STUDENT WHERE email = ? UNION SELECT * FROM INSTRUCTOR WHERE email = ? ", [email, email], (err, result) => {
            if (err) return res.status(500).json({ message: "Database error." });

            if (result.length > 0) {
               return res.status(409).json({ message: "Email is already being used." });
            }

            db.query(
               "INSERT INTO INSTRUCTOR (email, password, firstName, lastName) VALUES (?, ?, ?, ?)",
               [email, hashedPassword, firstName, lastName],
               (err) => {
                  if (err) {
                     return res.status(500).json({ error: "Instructor already exists or database error." });
                  }
                  res.status(201).json({ message: "Instructor Registered Successfully." });
               }
            );
         }
      )
   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error signing up the instructor." });
   }
});

// Signin Route
instructorRouter.post("/signin", async (req, res) => {
   try {
      const result = LoginSchema.safeParse(req.body);
      if (!result.success) {
         return res.status(400).json({ error: result.error.format() });
      }

      const { email, password } = result.data;

      db.query("SELECT * FROM INSTRUCTOR WHERE email = ?", [email], async (error, results) => {
         if (error) return res.status(500).json({ message: "Database error." });
         if (results.length === 0) {
            return res.status(404).json({ message: "Instructor not found." });
         }

         const instructor = results[0];
         const isMatch = await bcrypt.compare(password, instructor.password);

         if (isMatch) {
            const token = jwt.sign({ id: instructor.id }, process.env.JWT_INSTRUCTOR_SECRET, { expiresIn: "1h" });
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

instructorRouter.get("/details", instructorAuth, async (req, res) => {
   try {
      const instructor = req.instructor;

      db.query("SELECT firstName FROM INSTRUCTOR WHERE id = ?", [instructor.id], (error, results) => {
         if (error) {
            console.error(error);
            return res.status(500).json({ error: "Database error" });
         }

         if (results.length === 0) {
            return res.status(404).json({ error: "Instructor not found" });
         }

         res.json({ firstName: results[0].firstName });
      });
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
   }
});


module.exports = instructorRouter;
