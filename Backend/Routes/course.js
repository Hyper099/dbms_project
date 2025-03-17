const { Router } = require("express");
const db = require("../Database/database");
const { CourseSchema } = require("../Database/Schema");
const { instructorAuth, studentAuth } = require("../Middleware/authMiddleware");

const courseRouter = Router();

// Add Course
courseRouter.post("/add", instructorAuth, (req, res) => {
   const result = CourseSchema.safeParse(req.body);
   if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
   }

   const { title, description, price } = result.data;
   const instructor_id = req.instructor.id; // Corrected

   db.query(
      "INSERT INTO COURSES (title, description, price, instructor_id) VALUES (?, ?, ?, ?)",
      [title, description, price, instructor_id],
      (err) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error or instructor ID invalid." });
         }
         res.status(201).json({ message: "Course added successfully." });
      }
   );
});

// Update Course
courseRouter.put("/update/:id", instructorAuth, (req, res) => {
   const courseId = req.params.id;
   const result = CourseSchema.partial().safeParse(req.body);
   if (!result.success) {
      return res.status(400).json({ error: result.error.format() });
   }

   const { title, description, price } = result.data;

   db.query(
      "UPDATE COURSES SET title = ?, description = ?, price = ? WHERE id = ? AND instructor_id = ?",
      [title, description, price, courseId, req.instructor.id], // Corrected
      (err, results) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error updating course." });
         }
         if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found or unauthorized action." });
         }
         res.status(200).json({ message: "Course updated successfully." });
      }
   );
});

// Delete Course
courseRouter.delete("/delete/:id", instructorAuth, (req, res) => {
   const courseId = req.params.id;

   db.query("DELETE FROM COURSES WHERE id = ? AND instructor_id = ?",
      [courseId, req.instructor.id], // Corrected
      (err, results) => {
         if (err) {
            console.error(err);
            return res.status(500).json({ error: "Error deleting course." });
         }
         if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Course not found or unauthorized action." });
         }
         res.status(200).json({ message: "Course deleted successfully." });
      });
});

// Get All Courses (Public Route)
courseRouter.get("/", (req, res) => {
   db.query("SELECT * FROM COURSES", (err, results) => {
      if (err) {
         console.error(err);
         return res.status(500).json({ error: "Error fetching courses." });
      }
      res.status(200).json(results);
   });
});

// Get single course by ID
courseRouter.get("/:id", (req, res) => {
   const { id } = req.params;
   db.query("SELECT * FROM courses WHERE id = ?", [id], (err, result) => {
      if (err)
         return res.status(500).send(err);
      if (result.length === 0)
         return res.status(404).send("Course not found");
      res.status(200).json(result[0]);
   });
});

// !Enroll user in a course
courseRouter.post("/enroll", studentAuth, (req, res) => {
   const student = req.student;
   const studentId = student.id;
   const courseId = req.body.courseId;

   // Fetch access period for the selected course
   const getCourseQuery = `
      SELECT access_period
      FROM COURSES
      WHERE id = ?
   `;

   db.query(getCourseQuery, [courseId], (err, courseResult) => {
      if (err) {
         console.error("Error fetching course details:", err);
         return res.status(500).json({ error: "Failed to fetch course details." });
      }

      if (courseResult.length === 0) {
         return res.status(404).json({ error: "Course not found." });
      }

      db.query(
         "SELECT * FROM ENROLLMENT where student_id = ? AND course_id = ?", [studentId, courseId], (err, result) => {
            if (err) {
               console.error("Error checking enrollment status:", err);
               return res.status(500).json({ error: "Failed to check enrollment status." });
            }

            if (result.length > 0) {
               return res.status(400).json({ error: "You have already enrolled in this course." });
            }

            const accessPeriod = courseResult[0].access_period || 0;
            const enrollmentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getDate() + accessPeriod);

            const insertQuery = `
               INSERT INTO ENROLLMENT
               (Student_id, Course_id, Enrollment_date, Start_date, Expiry_date, Status) 
               VALUES (?, ?, ?, ?, ?, 'Active')
            `;

            db.query(insertQuery,
               [studentId, courseId, enrollmentDate, enrollmentDate, expiryDate.toISOString().split('T')[0]],
               (err, result) => {
                  if (err) {
                     console.error("Error during enrollment:", err);
                     return res.status(500).json({ error: "Failed to enroll in the course." });
                  }

                  res.json({ message: "Enrollment successful", id: result.insertId });
               }
            );
         }
      )
   }
   )
});

module.exports = courseRouter;
